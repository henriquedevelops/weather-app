import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWeatherStore } from '@/stores/weather'

describe('Weather Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct defaults', () => {
    const store = useWeatherStore()

    expect(store.selectedLocation).toBe('Denver')
    expect(store.loading).toBe(false)
    expect(store.savedLocations).toHaveLength(5)
  })

  it('computes current temperature as rounded value', () => {
    const store = useWeatherStore()

    expect(store.currentTemperature).toBeUndefined()

    store.selectedLocationWeatherData = {
      location: { name: 'Test', region: '', country: '', localtime: '' },
      current: { temp_c: 22.7, condition: { text: 'Sunny', code: 1000 } },
      forecast: { forecastday: [] },
    }

    expect(store.currentTemperature).toBe(23)
  })

  it('adds and removes saved locations', () => {
    const store = useWeatherStore()

    // Mock fetch for selectLocation call
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })

    store.addSavedLocation({ id: 99, name: 'Paris', region: '', country: '', url: '' })
    expect(store.savedLocations[0]?.name).toBe('Paris')

    store.removeSavedLocation(99)
    expect(store.savedLocations.find((l) => l.id === 99)).toBeUndefined()
  })
})
