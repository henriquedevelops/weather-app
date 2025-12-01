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
const autocompleteId = ref(`autocomplete-${Math.random().toString(36).substr(2, 9)}`)

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

const outlineColor = computed(() => getTemperatureColor(weatherStore.currentTemperature))
const activeDescendantId = computed(() =>
  focusedIndex.value >= 0 ? `${autocompleteId.value}-option-${focusedIndex.value}` : undefined,
)
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
      :style="{ outlineColor }"
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
  padding: 0;
  margin: -1px;
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
    max-width: 250px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
}

input {
  height: 4.8rem;
  padding-inline: 1rem;
  border-radius: 10px;
  background-color: white;
  font-size: 1.4rem;
  border: none;
  outline-color: #f5f5f5;
  outline-width: 2px;
  outline-style: solid;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  transition: outline-color 0.3s ease;
  color: var(--color-text-primary);
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 120%;
  letter-spacing: 0%;
  text-align: left;

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 20rem;
  overflow-y: auto;
  margin-bottom: 2.4rem;
}

.autocomplete-item {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 1.2rem 1.6rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 0.4rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: 2px solid var(--color-weather-blue);
    outline-offset: -2px;
    background-color: rgba(0, 0, 0, 0.05);
  }

  &--focused {
    background-color: rgba(0, 0, 0, 0.08);
  }

  &--focused:focus {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:first-child {
    border-radius: 10px 10px 0 0;
  }

  &:last-child {
    border-radius: 0 0 10px 10px;
  }

  &__name {
    font-weight: 600;
    font-size: 1.4rem;
    color: var(--color-text-primary);
  }

  &__location {
    font-weight: 400;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }
}
</style>
