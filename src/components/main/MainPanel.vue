<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import CurrentWeatherCard from './CurrentWeatherCard.vue'
import HourlyForecastList from './HourlyForecastList.vue'
import DailyForecastList from './DailyForecastList.vue'

const weatherStore = useWeatherStore()

const showError = computed(() => weatherStore.error && !weatherStore.loading)

onMounted(() => {
  // Set initial location if none is selected
  if (!weatherStore.selectedLocation) {
    weatherStore.selectLocation('Denver')
  } else if (!weatherStore.selectedLocationWeatherData) {
    // If location is selected but no data, fetch it
    weatherStore.fetchWeather()
  }
})
</script>

<template>
  <section>
    <!-- Error State -->
    <div v-if="showError" class="error-container">
      <p class="error-message">{{ weatherStore.error }}</p>
    </div>

    <!-- Content State (includes loading skeletons) -->
    <template v-else>
      <CurrentWeatherCard />
      <HourlyForecastList />
      <DailyForecastList />
    </template>
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

.error-container {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
  padding: 3.2rem;

  @media (min-width: 1024px) {
    min-height: 40rem;
  }
}

.error-message {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  line-height: 1.5;

  @media (min-width: 1024px) {
    font-size: 2.4rem;
  }
}
</style>
