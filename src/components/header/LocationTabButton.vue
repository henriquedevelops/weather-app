<script setup lang="ts">
import { computed } from 'vue'
import { getTemperatureColor } from '@/utils/temperatureColors'

interface Props {
  label: string
  isActive: boolean
  temperature: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [label: string]
}>()

const backgroundColor = computed(() => {
  if (props.isActive && props.temperature !== null) {
    return getTemperatureColor(props.temperature)
  }
  return undefined
})

const handleClick = () => {
  emit('click', props.label)
}
</script>

<template>
  <button type="button" :style="{ backgroundColor }" :data-active="isActive" @click="handleClick">
    {{ label }}
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

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
