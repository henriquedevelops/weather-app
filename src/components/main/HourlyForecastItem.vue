<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherIcon from '@/components/WeatherIcon.vue'
import { getTemperatureColor } from '@/utils/temperatureColors'

interface HourlyForecastItem {
  time?: string
  temperature?: number
  conditionCode?: number | null
}

const props = defineProps<HourlyForecastItem>()
const weatherStore = useWeatherStore()

const backgroundColor = computed(() => {
  if (!props.temperature) return undefined
  return getTemperatureColor(props.temperature)
})
</script>

<template>
  <!-- Skeleton State -->
  <article v-if="weatherStore.loading" class="hour-item skeleton">
    <div class="skeleton-element skeleton-time" />
    <figure class="hour-item__icon skeleton-element" />
    <div class="skeleton-element skeleton-temp" />
  </article>

  <!-- Content State -->
  <article v-else class="hour-item">
    <time class="hour-item__time" :datetime="time">{{ time }}</time>
    <figure
      class="hour-item__icon"
      :style="{ backgroundColor }"
      aria-label="Weather condition icon"
    >
      <WeatherIcon :condition-code="conditionCode ?? null" />
    </figure>
    <data class="hour-item__temp" :value="temperature" aria-label="Temperature"
      >{{ temperature }} °C</data
    >
  </article>
</template>

<style scoped lang="scss">
.hour-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  width: 14.4rem;
  height: 17.72rem;

  &__time {
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 2rem;
    line-height: 130%;
    letter-spacing: 0%;
    text-align: center;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 8rem;
    background-color: var(--color-weather-light-blue);
    border-radius: 50%;

    svg {
      width: 4.8rem;
      height: 4.8rem;
    }
  }

  &__temp {
    font-weight: 600;
    font-size: 2rem;
    line-height: 130%;
    letter-spacing: 0%;
    text-align: center;

    display: block;
  }
}

// Skeleton Styles
.skeleton-element {
  background: #f0f0f0;
  border-radius: 0.4rem;
}

.skeleton-time {
  width: 6rem;
  height: 2.4rem;
}

.skeleton .hour-item__icon {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: #f0f0f0;
}

.skeleton-temp {
  width: 4rem;
  height: 2.4rem;
}
</style>
