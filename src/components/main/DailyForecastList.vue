<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import DailyForecastItem from './DailyForecastItem.vue'

const weatherStore = useWeatherStore()

// Always show 3 items - either from data or placeholders when loading
const itemsToRender = computed(() => {
  if (weatherStore.loading || weatherStore.dailyForecast.length === 0) {
    return Array(3).fill(null)
  }
  return weatherStore.dailyForecast
})
</script>

<template>
  <ul class="daily-row" aria-label="Daily Forecast">
    <li v-for="(item, index) in itemsToRender" :key="item?.day || index">
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
  list-style: none;
  padding: 0;
  margin: 0;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
}
</style>
