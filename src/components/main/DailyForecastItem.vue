<script setup lang="ts">
import WeatherIcon from '@/components/WeatherIcon.vue'

interface DailyForecastItem {
  day: string
  condition: string
  temperature: number
  conditionCode: number | null
}

defineProps<DailyForecastItem>()
</script>

<template>
  <article class="day-item" :style="{ backgroundColor: '#c3e0fb' }">
    <figure class="day-item__icon" aria-label="Weather condition icon">
      <WeatherIcon :condition-code="conditionCode" />
    </figure>
    <div class="day-item__info">
      <h3 class="day-item__day">{{ day }}</h3>
      <p class="day-item__condition">{{ condition }}</p>
    </div>
    <data class="day-item__temp" :value="temperature" aria-label="Temperature"
      >{{ temperature }}°C</data
    >
  </article>
</template>

<style scoped lang="scss">
.day-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.6rem;
  padding-left: 1.6rem;
  padding-right: 2.4rem;
  padding-block: 1.5rem;
  border-radius: 1rem;
  min-height: 7.2rem;
  flex: 1;

  @media (min-width: 1024px) {
    flex-direction: column;
    width: 24.5rem;
    height: 18.8rem;
    gap: 0;
    border-radius: 3rem;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex: 1;

    @media (min-width: 1024px) {
      align-items: center;
      justify-content: center;
    }
  }

  &__day {
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.8rem;
    line-height: 120%;
    letter-spacing: 0%;
    margin: 0;
  }

  &__condition {
    color: var(--color-text-secondary);
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 130%;
    letter-spacing: 0%;
    text-align: center;
    margin: 0;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    margin: 0;
  }

  &__temp {
    font-weight: 600;
    font-size: 2rem;
    line-height: 130%;
    letter-spacing: 0%;
    text-align: center;
    color: var(--color-text-primary);
    display: block;
  }
}
</style>
