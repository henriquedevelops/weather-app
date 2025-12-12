<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { getTemperatureColor } from '@/utils/temperatureColors'
import type { LocationSearchResult } from '@/stores/weather'
const weatherStore = useWeatherStore()
const searchQuery = ref('')
const showAutocomplete = ref(false)
const autocompleteRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const focusedIndex = ref(-1)
const autocompleteId = ref(`autocomplete-${Math.random().toString(36).slice(2, 11)}`)
const borderColor = computed(() => getTemperatureColor(weatherStore.currentTemperature))
const activeDescendantId = computed(() =>
  focusedIndex.value >= 0 ? `${autocompleteId.value}-option-${focusedIndex.value}` : undefined,
)

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (newValue.trim()) {
    searchTimeout = setTimeout(() => {
      weatherStore.searchLocations(newValue.trim())
      showAutocomplete.value = true
      focusedIndex.value = -1
    }, 300)
  } else {
    showAutocomplete.value = false
    weatherStore.clearSearchResults()
    focusedIndex.value = -1
  }
})

// Watch for search results changes to reset focus
watch(
  () => weatherStore.searchResults,
  () => {
    focusedIndex.value = -1
  },
)

async function handleSelectLocation(location: LocationSearchResult) {
  // Add location to saved locations and select it
  weatherStore.addSavedLocation(location)
  searchQuery.value = ''
  showAutocomplete.value = false
  focusedIndex.value = -1
  // Unfocus input after selection
  await nextTick()
  inputRef.value?.blur()
}

function scrollToFocusedItem() {
  nextTick(() => {
    const focusedElement = autocompleteRef.value?.querySelector(
      `[data-index="${focusedIndex.value}"]`,
    ) as HTMLElement
    if (focusedElement && autocompleteRef.value) {
      const container = autocompleteRef.value
      const itemTop = focusedElement.offsetTop
      const itemBottom = itemTop + focusedElement.offsetHeight
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.offsetHeight

      if (itemTop < containerTop) {
        container.scrollTop = itemTop
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.offsetHeight
      }
    }
  })
}

function handleKeyDown(event: KeyboardEvent) {
  const results = weatherStore.searchResults
  const resultsLength = results.length

  if (!showAutocomplete.value || resultsLength === 0) {
    if (event.key === 'Escape') {
      showAutocomplete.value = false
      searchQuery.value = ''
      weatherStore.clearSearchResults()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = focusedIndex.value < resultsLength - 1 ? focusedIndex.value + 1 : 0
      scrollToFocusedItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = focusedIndex.value > 0 ? focusedIndex.value - 1 : resultsLength - 1
      scrollToFocusedItem()
      break
    case 'Enter':
      event.preventDefault()
      if (focusedIndex.value >= 0 && focusedIndex.value < resultsLength) {
        const selectedResult = results[focusedIndex.value]
        if (selectedResult) {
          handleSelectLocation(selectedResult)
        }
      } else if (resultsLength > 0) {
        // If no item is focused, select the first one
        const firstResult = results[0]
        if (firstResult) {
          handleSelectLocation(firstResult)
        }
      }
      break
    case 'Escape':
      event.preventDefault()
      showAutocomplete.value = false
      focusedIndex.value = -1
      inputRef.value?.blur()
      break
    case 'Tab':
      // Allow Tab to work normally, but close autocomplete
      showAutocomplete.value = false
      focusedIndex.value = -1
      break
  }
}

// Close autocomplete when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (
    autocompleteRef.value &&
    !autocompleteRef.value.contains(event.target as Node) &&
    inputRef.value &&
    !inputRef.value.contains(event.target as Node)
  ) {
    showAutocomplete.value = false
    focusedIndex.value = -1
  }
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}

// Cleanup
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <div class="search-container">
    <label for="location-search" class="visually-hidden">Search for a city</label>
    <input
      id="location-search"
      ref="inputRef"
      v-model="searchQuery"
      type="text"
      placeholder="Search for a city"
      :style="{ borderColor }"
      :aria-expanded="showAutocomplete && weatherStore.searchResults.length > 0"
      :aria-controls="autocompleteId"
      :aria-autocomplete="'list'"
      :aria-activedescendant="activeDescendantId"
      aria-label="Search for a city"
      role="combobox"
      autocomplete="off"
      @keydown="handleKeyDown"
      @focus="
        showAutocomplete = searchQuery.trim().length > 0 && weatherStore.searchResults.length > 0
      "
    />
    <div
      v-if="showAutocomplete && weatherStore.searchResults.length > 0"
      :id="autocompleteId"
      ref="autocompleteRef"
      class="autocomplete-dropdown"
      role="listbox"
      :aria-label="`${weatherStore.searchResults.length} location suggestions`"
    >
      <button
        v-for="(result, index) in weatherStore.searchResults"
        :key="result.id"
        :id="`${autocompleteId}-option-${index}`"
        :data-index="index"
        type="button"
        class="autocomplete-item"
        :class="{ 'autocomplete-item--focused': focusedIndex === index }"
        role="option"
        :aria-selected="focusedIndex === index"
        @click="handleSelectLocation(result)"
        @mouseenter="focusedIndex = index"
      >
        <span class="autocomplete-item__name">{{ result.name }}</span>
        <span class="autocomplete-item__location">{{ result.region }}, {{ result.country }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.search-container {
  position: relative;
  width: 100%;
  margin-bottom: 2.4rem;

  @media (min-width: 1024px) {
    flex-shrink: 0;
    max-width: 250px;
    margin-bottom: 0;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    height: 4.8rem;
    padding-inline: 1rem;
    border: 2px solid #f5f5f5;
    border-radius: 10px;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 120%;
    text-align: left;
    color: var(--color-text-primary);
    background-color: white;
    transition: border-color 0.3s ease;

    &::placeholder {
      color: var(--color-text-secondary);
    }

    &:focus-visible {
      outline: 2px solid var(--color-text-primary);
      outline-offset: -2px;
    }
  }

  .autocomplete-dropdown {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 20rem;
    margin-bottom: 2.4rem;
    overflow-y: auto;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .autocomplete-item {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 0.4rem;
      width: 100%;
      padding: 1.2rem 1.6rem;
      border: none;
      text-align: left;
      background: none;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover,
      &:focus {
        background-color: #f5f5f5;
      }

      &--focused {
        background-color: #f5f5f5;
      }

      &:first-child {
        border-radius: 10px 10px 0 0;
      }

      &:last-child {
        border-radius: 0 0 10px 10px;
      }

      &__name {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      &__location {
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
