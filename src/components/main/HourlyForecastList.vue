<script setup lang="ts">
import { useWeatherStore } from '@/stores/weather'
import HourlyForecastItem from './HourlyForecastItem.vue'

const weatherStore = useWeatherStore()
</script>

<template>
  <ul class="hourly-list" aria-label="Hourly Forecast">
    <li v-for="hour in weatherStore.hourlyForecast" :key="hour.time">
      <HourlyForecastItem v-bind="hour" />
    </li>
  </ul>
</template>

<style scoped>
.hourly-list {
  display: flex;

  /* Stretch the tabs to be full-width, ignoring the header's side padding */
  margin-inline: calc(-1 * var(--padding-horizontal-main));
  overflow-x: auto;
  list-style: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
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
