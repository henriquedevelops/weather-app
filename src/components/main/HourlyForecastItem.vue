<script setup lang="ts">
import SnowIcon from '~icons/local/snow'

interface HourlyForecastItem {
  time: string
  temperature: number
  icon: string
}

defineProps<HourlyForecastItem>()
</script>

<template>
  <article class="hour-item">
    <time class="hour-item__time" :datetime="time">{{ time }}</time>
    <figure class="hour-item__icon" aria-label="Weather condition icon">
      <SnowIcon />
    </figure>
    <data class="hour-item__temp" :value="temperature" aria-label="Temperature"
      >{{ temperature }}°C</data
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
</style>
