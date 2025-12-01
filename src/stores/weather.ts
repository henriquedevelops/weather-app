import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WeatherData, LocationSearchResult } from '@/types/weather'
import { defaultLocations } from '@/data/defaultLocations'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL

export type { LocationSearchResult }

export const useWeatherStore = defineStore('weather', () => {
  const selectedLocation = ref<string>('Denver')
  const selectedLocationWeatherData = ref<WeatherData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const savedLocations = ref<LocationSearchResult[]>([...defaultLocations])
  const searchResults = ref<LocationSearchResult[]>([])
  const isSearching = ref(false)

  const currentTemperature = computed(() =>
    Math.round(selectedLocationWeatherData.value?.current.temp_c ?? 0),
  )
  const currentCondition = computed(() => selectedLocationWeatherData.value?.current.condition.text)
  const currentConditionCode = computed(
    () => selectedLocationWeatherData.value?.current.condition.code ?? null,
  )

  // Get hourly forecast for the next 5 hours based on the location's local time
  const hourlyForecast = computed(() => {
    const today = selectedLocationWeatherData.value?.forecast.forecastday[0]
    if (!today) return []
    if (!selectedLocationWeatherData.value?.location.localtime) return []

    const forecastDays = selectedLocationWeatherData.value.forecast.forecastday

    // Get the current hour at the location (not the user's local time)
    const locationLocalTime = new Date(selectedLocationWeatherData.value.location.localtime)
    const currentHour = locationLocalTime.getHours()

    // Collect all available hours from today and tomorrow
    const allHours: Array<{
      time: string
      temp_c: number
      condition: { text: string; code: number }
    }> = []

    // Add hours from today starting from the current hour
    today.hour.forEach((hour) => {
      const hourTime = new Date(hour.time)
      if (hourTime.getHours() >= currentHour) {
        allHours.push(hour)
      }
    })

    // Add hours from tomorrow if we need more
    if (allHours.length < 5 && forecastDays.length > 1 && forecastDays[1]) {
      const tomorrow = forecastDays[1]
      tomorrow.hour.forEach((hour) => {
        if (allHours.length < 5) {
          allHours.push(hour)
        }
      })
    }

    // Take only 5 hours
    const upcomingHours = allHours.slice(0, 5)

    return upcomingHours.map((hour, index) => {
      const hourDate = new Date(hour.time)
      // First item is always "Now"
      const isNow = index === 0
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
