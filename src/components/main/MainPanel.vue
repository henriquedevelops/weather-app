<script setup lang="ts">
import CurrentWeatherCard from './CurrentWeatherCard.vue'
import HourlyForecastList from './HourlyForecastList.vue'
import DailyForecastList from './DailyForecastList.vue'
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
