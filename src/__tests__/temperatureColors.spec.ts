import { describe, it, expect } from 'vitest'
import { getTemperatureColor, getDarkenedTemperatureColor } from '@/utils/temperatureColors'

describe('temperatureColors', () => {
  it('returns correct colors for temperature ranges', () => {
    expect(getTemperatureColor(undefined)).toBeUndefined()
    expect(getTemperatureColor(-5)).toBe('#e4f0fe') // very cold
    expect(getTemperatureColor(5)).toBe('#c3e0fb') // cold
    expect(getTemperatureColor(15)).toBe('#cdf0eb') // cool
    expect(getTemperatureColor(25)).toBe('#fff4da') // warm
    expect(getTemperatureColor(35)).toBe('#fdd4d7') // hot
  })

  it('returns darker variants for icon backgrounds', () => {
    expect(getDarkenedTemperatureColor(undefined)).toBeUndefined()
    expect(getDarkenedTemperatureColor(25)).toBe('#f8ead0')
  })
})
