<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { getTemperatureColor } from '@/utils/temperatureColors'

const weatherStore = useWeatherStore()
const searchQuery = ref('')

async function handleSearch() {
  if (searchQuery.value.trim()) {
    await weatherStore.fetchWeather(searchQuery.value.trim())
    searchQuery.value = ''
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

const borderColor = computed(() => getTemperatureColor(weatherStore.currentTemperature))
</script>

<template>
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Search for a city"
    :style="{ borderColor, borderWidth: '2px', borderStyle: 'solid' }"
    @keypress="handleKeyPress"
  />
</template>

<style scoped lang="scss">
input {
  height: 4.8rem;
  padding-inline: 1rem;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 1.4rem;
  outline: none;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  margin-bottom: 2.4rem;

  &:focus {
    border-color: var(--color-weather-blue);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}
</style>
