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

export interface LocationSearchResult {
  id: number
  name: string
  region: string
  country: string
  url: string
}

export const useWeatherStore = defineStore('weather', () => {
  const selectedLocation = ref<string>('Denver')
  const selectedLocationWeatherData = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const savedLocations = ref<LocationSearchResult[]>([
    {
      id: 1,
      name: 'Denver',
      region: 'Colorado',
      country: 'United States',
      url: 'https://www.google.com/maps/place/Denver,+CO,+USA',
    },
    {
      id: 2,
      name: 'Rio de Janeiro',
      region: 'Rio de Janeiro',
      country: 'Brazil',
      url: 'https://www.google.com/maps/place/Rio+de+Janeiro,+Brazil',
    },
    {
      id: 3,
      name: 'Madrid',
      region: 'Madrid',
      country: 'Spain',
      url: 'https://www.google.com/maps/place/Madrid,+Spain',
    },
    {
      id: 4,
      name: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      url: 'https://www.google.com/maps/place/Tokyo,+Japan',
    },
    {
      id: 5,
      name: 'Sydney',
      region: 'Sydney',
      country: 'Australia',
      url: 'https://www.google.com/maps/place/Sydney,+Australia',
    },
  ])
  const searchResults = ref<LocationSearchResult[]>([])
  const isSearching = ref(false)

  const currentTemperature = computed(() =>
    selectedLocationWeatherData.value?.current.temp_c != null
      ? Math.round(selectedLocationWeatherData.value.current.temp_c)
      : null,
  )
  const currentCondition = computed(() => selectedLocationWeatherData.value?.current.condition.text)
  const currentConditionCode = computed(
    () => selectedLocationWeatherData.value?.current.condition.code ?? null,
  )

  // Get hourly forecast for the next 5 hours
  const hourlyForecast = computed(() => {
    if (!selectedLocationWeatherData.value?.forecast.forecastday[0]) return []
    const today = selectedLocationWeatherData.value.forecast.forecastday[0]
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
    const forecastDays = selectedLocationWeatherData.value.forecast.forecastday
    if (upcomingHours.length < 5 && forecastDays.length > 1 && forecastDays[1]) {
      const tomorrow = forecastDays[1]
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
    if (!selectedLocationWeatherData.value?.forecast.forecastday.length) return []

    return selectedLocationWeatherData.value.forecast.forecastday.slice(0, 3).map((day, index) => {
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

  async function fetchWeather(locationQuery?: string) {
    const query = locationQuery || selectedLocation.value || 'Denver'
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
      // Set the weather data for the selected location
      selectedLocationWeatherData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch weather data'
      console.error('Error fetching weather data:', err)
    } finally {
      loading.value = false
    }
  }

  async function searchLocations(query: string) {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`,
      )

      if (!response.ok) {
        throw new Error(`Failed to search locations: ${response.statusText}`)
      }

      const data: LocationSearchResult[] = await response.json()
      searchResults.value = data.slice(0, 5) // Limit to 5 results
    } catch (err) {
      console.error('Error searching locations:', err)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  function selectLocation(newLocation: string) {
    // Immediately update selected location
    selectedLocation.value = newLocation
    // Reset weather data to empty
    selectedLocationWeatherData.value = null
    // Fetch weather data
    fetchWeather(newLocation)
  }

  function addSavedLocation(newLocation: LocationSearchResult) {
    const locationAlreadyExists = savedLocations.value.some(
      (loc) => loc.name.toLowerCase() === newLocation.name.toLowerCase(),
    )
    if (locationAlreadyExists) return

    savedLocations.value.push(newLocation)
    selectLocation(newLocation.name)
  }

  function clearSearchResults() {
    searchResults.value = []
  }

  function removeSavedLocation(id: number) {
    const index = savedLocations.value.findIndex((loc) => loc.id === id)
    if (index > -1) savedLocations.value.splice(index, 1)
  }

  return {
    selectedLocation,
    selectedLocationWeatherData,
    loading,
    error,
    savedLocations,
    searchResults,
    isSearching,
    fetchWeather,
    selectLocation,
    searchLocations,
    clearSearchResults,
    addSavedLocation,
    removeSavedLocation,
    currentTemperature,
    currentCondition,
    currentConditionCode,
    hourlyForecast,
    dailyForecast,
  }
})
