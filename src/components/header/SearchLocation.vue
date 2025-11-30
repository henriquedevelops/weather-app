<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { getTemperatureColor } from '@/utils/temperatureColors'
import type { LocationSearchResult } from '@/stores/weather'
const weatherStore = useWeatherStore()
const searchQuery = ref('')
const showAutocomplete = ref(false)
const autocompleteRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

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
    }, 300)
  } else {
    showAutocomplete.value = false
    weatherStore.clearSearchResults()
  }
})

async function handleSelectLocation(location: LocationSearchResult) {
  // Add location to saved locations and select it
  weatherStore.addSavedLocation(location)
  searchQuery.value = ''
  showAutocomplete.value = false
}

function handleKeyPress() {
  return
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
</script>

<template>
  <div class="search-container">
    <input
      ref="inputRef"
      v-model="searchQuery"
      type="text"
      placeholder="Search for a city"
      :style="{ outlineColor }"
      @keypress="handleKeyPress"
      @focus="
        showAutocomplete = searchQuery.trim().length > 0 && weatherStore.searchResults.length > 0
      "
    />
    <div
      v-if="showAutocomplete && weatherStore.searchResults.length > 0"
      ref="autocompleteRef"
      class="autocomplete-dropdown"
    >
      <button
        v-for="result in weatherStore.searchResults"
        :key="result.id"
        type="button"
        class="autocomplete-item"
        @click="handleSelectLocation(result)"
      >
        <span class="autocomplete-item__name">{{ result.name }}</span>
        <span class="autocomplete-item__location">{{ result.region }}, {{ result.country }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  background-color: rgba(255, 255, 255, 0.9);
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

  &:focus {
    outline-color: var(--color-weather-blue);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
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
