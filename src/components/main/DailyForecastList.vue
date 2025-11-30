<script setup lang="ts">
import { useWeatherStore } from '@/stores/weather'
import DailyForecastItem from './DailyForecastItem.vue'

const weatherStore = useWeatherStore()
</script>

<template>
  <ul class="daily-row" aria-label="Daily Forecast">
    <li v-for="item in weatherStore.dailyForecast" :key="item.day">
      <DailyForecastItem v-bind="item" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.daily-row {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  align-self: end;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
}
</style>
