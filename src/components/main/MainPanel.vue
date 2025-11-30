<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import CurrentWeatherCard from './CurrentWeatherCard.vue'
import HourlyForecastList from './HourlyForecastList.vue'
import DailyForecastList from './DailyForecastList.vue'

const weatherStore = useWeatherStore()

onMounted(() => {
  // Fetch initial weather data on component mount
  weatherStore.fetchWeather()
})
</script>

<template>
  <section>
    <CurrentWeatherCard />
    <HourlyForecastList />
    <DailyForecastList />
  </section>
</template>

<style scoped lang="scss">
section {
  padding-inline: var(--padding-horizontal-main);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.2rem;

  @media (min-width: 1024px) {
    padding-inline: 0;
    grid-template-columns: auto 1fr;
    gap: 2.8rem;
  }
}
</style>
