<script setup lang="ts">
import { computed, type Component } from 'vue'
import { getWeatherIconName } from '@/utils/weatherIcons'
import ClearCloudyIcon from '~icons/local/clear-cloudy'
import CloudyIcon from '~icons/local/cloudy'
import DrizzleIcon from '~icons/local/drizzle'
import HailIcon from '~icons/local/hail'
import IsolatedThunderstromsIcon from '~icons/local/isolated-thunderstroms'
import MostlyCloudyIcon from '~icons/local/mostly-cloudy'
import PartlyCloudyIcon from '~icons/local/partly-cloudy'
import ShowersIcon from '~icons/local/showers'
import SleetIcon from '~icons/local/sleet'
import SnowFlurriesIcon from '~icons/local/snow-flurries'
import SnowIcon from '~icons/local/snow'
import SunnyIcon from '~icons/local/sunny'
import ThunderstromsIcon from '~icons/local/thunderstroms'
import TornadoIcon from '~icons/local/tornado'
import WindyIcon from '~icons/local/windy'

interface Props {
  conditionCode: number | null
}

const props = defineProps<Props>()

const iconName = computed(() => getWeatherIconName(props.conditionCode))

const iconMap: Record<string, Component> = {
  'clear-cloudy': ClearCloudyIcon,
  cloudy: CloudyIcon,
  drizzle: DrizzleIcon,
  hail: HailIcon,
  'isolated-thunderstroms': IsolatedThunderstromsIcon,
  'mostly-cloudy': MostlyCloudyIcon,
  'partly-cloudy': PartlyCloudyIcon,
  showers: ShowersIcon,
  sleet: SleetIcon,
  'snow-flurries': SnowFlurriesIcon,
  snow: SnowIcon,
  sunny: SunnyIcon,
  thunderstroms: ThunderstromsIcon,
  tornado: TornadoIcon,
  windy: WindyIcon,
}

const IconComponent = computed(() => {
  return iconMap[iconName.value] || SunnyIcon
})
</script>

<template>
  <component :is="IconComponent" />
</template>
