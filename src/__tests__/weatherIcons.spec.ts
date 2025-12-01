import { describe, it, expect } from 'vitest'
import { getWeatherIconName } from '@/utils/weatherIcons'

describe('weatherIcons', () => {
  it('maps weather condition codes to icon names', () => {
    expect(getWeatherIconName(null)).toBe('sunny')
    expect(getWeatherIconName(1000)).toBe('sunny')
    expect(getWeatherIconName(1003)).toBe('partly-cloudy')
    expect(getWeatherIconName(1006)).toBe('cloudy')
    expect(getWeatherIconName(1183)).toBe('showers')
    expect(getWeatherIconName(1213)).toBe('snow')
    expect(getWeatherIconName(9999)).toBe('sunny') // unknown defaults to sunny
  })
})
