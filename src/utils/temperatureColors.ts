/**
 * Maps temperature values to colors
 * Temperature ranges:
 * - Very cold (< 0°C): light-blue
 * - Cold (0-10°C): blue
 * - Cool (10-20°C): green
 * - Warm (20-30°C): yellow
 * - Hot (≥ 30°C): red
 */
export function getTemperatureColor(temperature: number | undefined) {
  if (temperature === undefined) return
  if (temperature < 0) return '#e4f0fe'
  if (temperature < 10) return '#c3e0fb'
  if (temperature < 20) return '#cdf0eb'
  if (temperature < 30) return '#fff4da'
  if (temperature >= 30) return '#fdd4d7'
}

export function getDarkenedTemperatureColor(temperature: number | undefined) {
  if (temperature === undefined) return
  if (temperature < 0) return '#d9e8fc'
  if (temperature < 10) return '#b8d7f8'
  if (temperature < 20) return '#c0e8e0'
  if (temperature < 30) return '#f8ead0'
  if (temperature >= 30) return '#f8c8cc'
}
