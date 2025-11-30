import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL

interface CurrentWeather {
  temp_c: number
  condition: {
    text: string
    code: number
  }
  location?: {
    name: string
    region: string
    country: string
  }
}

interface ForecastDay {
  date: string
  day: {
    maxtemp_c: number
    mintemp_c: number
    condition: {
      text: string
      code: number
    }
  }
  hour: Array<{
    time: string
    temp_c: number
    condition: {
      text: string
      code: number
    }
  }>
}

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
  }
  current: CurrentWeather
  forecast: {
    forecastday: ForecastDay[]
  }
}

export const useWeatherStore = defineStore('weather', () => {
  const currentWeather = ref<CurrentWeather | null>(null)
  const forecast = ref<ForecastDay[]>([])
  const location = ref<{ name: string; region: string; country: string } | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function selectLocation(newLocation: string) {
    fetchWeather(newLocation)
  }

  async function fetchWeather(locationQuery?: string) {
    const query = locationQuery || 'Denver'
    if (!query) return

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=7&aqi=no&alerts=no`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`)
      }

      const data: WeatherData = await response.json()

      location.value = data.location
      currentWeather.value = data.current
      forecast.value = data.forecast.forecastday
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather data'
      console.error('Error fetching weather data:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed properties for easier access
  const currentLocationName = computed(() => location.value?.name)
  const currentTemperature = computed(() =>
    currentWeather.value?.temp_c != null ? Math.round(currentWeather.value.temp_c) : null,
  )
  const currentCondition = computed(() => currentWeather.value?.condition.text || '')
  const currentConditionCode = computed(() => currentWeather.value?.condition.code ?? null)

  // Get hourly forecast for the next 5 hours
  const hourlyForecast = computed(() => {
    if (!forecast.value[0]) return []
    const today = forecast.value[0]
    const now = new Date()
    const currentTime = now.getTime()

    // Get hours from now onwards
    const upcomingHours = today.hour
      .filter((hour) => {
        const hourDate = new Date(hour.time)
        return hourDate.getTime() >= currentTime
      })
      .slice(0, 5)

    // If we don't have enough hours for today, include hours from tomorrow
    if (upcomingHours.length < 5 && forecast.value.length > 1 && forecast.value[1]) {
      const tomorrow = forecast.value[1]
      const remainingHours = 5 - upcomingHours.length
      const tomorrowHours = tomorrow.hour.slice(0, remainingHours)
      upcomingHours.push(...tomorrowHours)
    }

    return upcomingHours.map((hour, index) => {
      const hourDate = new Date(hour.time)
      const timeDiff = hourDate.getTime() - currentTime
      const isNow = index === 0 && timeDiff < 3600000 // Within 1 hour
      return {
        time: isNow
          ? 'Now'
          : hourDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true,
            }),
        temperature: Math.round(hour.temp_c),
        conditionCode: hour.condition.code,
        conditionText: hour.condition.text,
      }
    })
  })

  // Get daily forecast (today, tomorrow, day after tomorrow)
  const dailyForecast = computed(() => {
    if (forecast.value.length === 0) return []

    return forecast.value.slice(0, 3).map((day, index) => {
      const date = new Date(day.date)
      let dayName: string

      if (index === 0) {
        dayName = 'Today'
      } else if (index === 1) {
        dayName = 'Tomorrow'
      } else {
        dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      }

      return {
        day: dayName,
        condition: day.day.condition.text,
        temperature: Math.round(day.day.maxtemp_c),
        conditionCode: day.day.condition.code,
        date: day.date,
      }
    })
  })

  return {
    currentWeather,
    forecast,
    location,
    loading,
    error,
    fetchWeather,
    selectLocation,
    currentLocationName,
    currentTemperature,
    currentCondition,
    currentConditionCode,
    hourlyForecast,
    dailyForecast,
  }
})
