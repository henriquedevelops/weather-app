<script setup lang="ts">
import { ref } from 'vue'
import { useWeatherStore } from '@/stores/weather'
const locations = ref<
  {
    id: number
    label: string
  }[]
>([
  { id: 1, label: 'Denver 🏔' },
  { id: 2, label: 'Rio de Janeiro ⛱' },
  { id: 3, label: 'Madrid 💃' },
  { id: 4, label: 'Japan 🍣' },
  { id: 5, label: 'Australia 🐨' },
])

const weatherStore = useWeatherStore()

const handleSelect = (newLocation: string) => {
  weatherStore.selectLocation(newLocation)
}
</script>

<template>
  <nav aria-label="Saved locations">
    <ul>
      <li v-for="location in locations" :key="location.id">
        <button
          type="button"
          :data-active="
            weatherStore.currentLocationName &&
            location.label.includes(weatherStore.currentLocationName)
          "
          @click="handleSelect(location.label)"
        >
          {{ location.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
nav {
  /* Stretch the tabs to be full-width, ignoring the header's side padding */
  margin-inline: calc(-1 * var(--padding-horizontal-main));
}

ul {
  display: flex;
  gap: 0.8rem;
  padding-inline: var(--padding-horizontal-main);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

button {
  height: 3.8rem;
  padding-inline: 2.4rem;
  border-radius: 10px;
  font-size: 1.2rem;
  white-space: nowrap;
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 1.8rem;
  line-height: 120%;
  letter-spacing: 0%;
  text-align: center;
  transition: background-color 0.3s ease;
  color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-weather-light-blue);
  }
}

button[data-active='true'] {
  background-color: var(--color-weather-blue);
}
</style>
