<script setup lang="ts">
import DailyForecastItem from './DailyForecastItem.vue'

const days = [
  { day: 'Today', condition: 'Frozen', temperature: 2, icon: 'snow', backgroundColor: '#c3e0fb' },
  {
    day: 'Tomorrow',
    condition: 'Partly Cloudy',
    temperature: 15,
    icon: 'partly-cloudy',
    backgroundColor: '#c3e0fb',
  },
  {
    day: 'Wednesday',
    condition: 'Sunny',
    temperature: 32,
    icon: 'sunny',
    backgroundColor: '#c3e0fb',
  },
]
</script>

<template>
  <ul class="daily-row" aria-label="Daily Forecast">
    <li v-for="(day, i) in days" :key="i">
      <DailyForecastItem
        :day="day.day"
        :condition="day.condition"
        :temperature="day.temperature"
        :icon="day.icon"
        :backgroundColor="day.backgroundColor"
      />
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
