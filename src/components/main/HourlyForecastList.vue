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
  <ul class="hourly-row" aria-label="Hourly Forecast">
    <li v-for="(hour, i) in hours" :key="i">
      <HourlyForecastItem :time="hour.time" :temperature="hour.temperature" :icon="hour.icon" />
    </li>
  </ul>
</template>

<style scoped>
.hourly-row {
  display: flex;
  padding-inline: 1.2rem;
  padding-top: 3.7rem;
  overflow-x: auto;
  list-style: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    margin: 0;
  }
}
</style>
