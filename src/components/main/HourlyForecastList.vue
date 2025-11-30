<script setup lang="ts">
import HourlyForecastItem from './HourlyForecastItem.vue'

const hours = [
  { time: 'Now', temperature: 2, icon: 'snow' },
  { time: '2 PM', temperature: 4, icon: 'snow' },
  { time: '3 PM', temperature: 8, icon: 'cloud' },
  { time: '4 PM', temperature: 10, icon: 'cloud' },
  { time: '5 PM', temperature: 15, icon: 'sun' },
]
</script>

<template>
  <ul class="hourly-list" aria-label="Hourly Forecast">
    <li v-for="(hour, i) in hours" :key="i">
      <HourlyForecastItem :time="hour.time" :temperature="hour.temperature" :icon="hour.icon" />
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
