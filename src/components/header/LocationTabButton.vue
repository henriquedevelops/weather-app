<script setup lang="ts">
import { computed } from 'vue'
import { getTemperatureColor } from '@/utils/temperatureColors'
import { useWeatherStore } from '@/stores/weather'

interface Props {
  name: string
  temperature: number | null
}

const props = defineProps<Props>()
const weatherStore = useWeatherStore()

const isActive = computed(() => {
  return props.name === weatherStore.selectedLocation
})

const backgroundColor = computed(() => {
  if (isActive.value) {
    return props.temperature ? getTemperatureColor(props.temperature) : '#f5f5f5'
  }
  return undefined
})

const handleClick = () => {
  if (isActive.value) return
  weatherStore.selectLocation(props.name)
}
</script>

<template>
  <button type="button" :style="{ backgroundColor }" :data-active="isActive" @click="handleClick">
    {{ name }}
  </button>
</template>

<style scoped lang="scss">
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

  &:hover,
  &[data-active='true'] {
    background-color: #f5f5f5;
  }
}
</style>
