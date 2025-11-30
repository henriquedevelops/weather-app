<script setup lang="ts">
import { useWeatherStore } from '@/stores/weather'
import LocationTabButton from './LocationTabButton.vue'

const weatherStore = useWeatherStore()
</script>

<template>
  <nav aria-label="Saved locations">
    <ul>
      <li v-for="location in weatherStore.savedLocations" :key="location.id">
        <LocationTabButton :name="location.name" :temperature="weatherStore.currentTemperature" />
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
