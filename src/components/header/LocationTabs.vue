<script setup lang="ts">
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import LocationTabButton from './LocationTabButton.vue'

const locations = ref<
  {
    id: number
    label: string
  }[]
>([
  { id: 1, label: 'Denver 🏔' },
  { id: 2, label: 'Rio de Janeiro ⛱' },
  { id: 3, label: 'Madrid 💃' },
  { id: 4, label: 'Tokyo 🍣' },
  { id: 5, label: 'Sydney 🐨' },
])

const weatherStore = useWeatherStore()

const handleSelect = (newLocation: string) => {
  weatherStore.selectLocation(newLocation)
}

const isLocationActive = (locationLabel: string) => {
  if (!weatherStore.currentLocationName) return false
  return locationLabel.toLowerCase().includes(weatherStore.currentLocationName.toLowerCase())
}
</script>

<template>
  <nav aria-label="Saved locations">
    <ul>
      <li v-for="location in locations" :key="location.id">
        <LocationTabButton
          :label="location.label"
          :is-active="isLocationActive(location.label)"
          :temperature="weatherStore.currentTemperature"
          @click="handleSelect"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  /* Stretch the tabs to be full-width, ignoring the header's side padding */
  margin-inline: calc(-1 * var(--padding-horizontal-main));
}

ul {
  display: flex;
  gap: 0.8rem;
  padding-inline: var(--padding-horizontal-main);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
