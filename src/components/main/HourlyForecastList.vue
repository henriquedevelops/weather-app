<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import HourlyForecastItem from './HourlyForecastItem.vue'

const weatherStore = useWeatherStore()

// Always show 5 items - either from data or placeholders when loading
const itemsToRender = computed(() => {
  if (weatherStore.loading || weatherStore.hourlyForecast.length === 0) {
    return Array(5).fill(null)
  }
  return weatherStore.hourlyForecast
})
</script>

<template>
  <ul class="hourly-list" aria-label="Hourly Forecast">
    <li v-for="(hour, index) in itemsToRender" :key="hour?.time || index">
      <HourlyForecastItem v-if="hour" v-bind="hour" />
      <HourlyForecastItem v-else />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.hourly-list {
  display: flex;
  gap: 0.8rem;

  /* Stretch the tabs to be full-width, ignoring the header's side padding */
  margin-inline: calc(-1 * var(--padding-horizontal-main));
  overflow-x: auto;
  list-style: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  padding-inline: var(--padding-horizontal-main);

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    margin: 0;
  }

  @media (min-width: 1024px) {
    padding-top: 3.7rem;
    margin-inline: 0;
    gap: 2.4rem;
  }
}
</style>
