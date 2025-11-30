/**
 * Maps WeatherAPI condition codes to icon names
 * Based on WeatherAPI condition codes: https://www.weatherapi.com/docs/weather_conditions.json
 */
export function getWeatherIconName(conditionCode: number | null): string {
  if (conditionCode === null) return 'sunny'

  // Clear/Sunny
  if (conditionCode === 1000) return 'sunny'

  // Partly cloudy
  if (conditionCode === 1003) return 'partly-cloudy'

  // Cloudy
  if (conditionCode === 1006) return 'cloudy'

  // Overcast
  if (conditionCode === 1009) return 'mostly-cloudy'

  // Mist
  if (conditionCode === 1030) return 'clear-cloudy'

  // Patchy rain possible, Light rain, Moderate rain, Heavy rain
  if ([1063, 1066, 1069, 1072, 1087, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    return 'showers'
  }

  // Patchy snow possible, Light snow, Moderate snow, Heavy snow
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
    return 'snow'
  }

  // Patchy sleet possible, Light sleet, Moderate or heavy sleet
  if ([1069, 1204, 1207, 1249, 1252].includes(conditionCode)) {
    return 'sleet'
  }

  // Patchy freezing drizzle possible, Freezing drizzle, Heavy freezing drizzle
  if ([1072, 1150, 1153, 1168, 1171].includes(conditionCode)) {
    return 'drizzle'
  }

  // Thundery outbreaks possible, Patchy light rain with thunder, Moderate or heavy rain with thunder
  if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return 'thunderstroms'
  }

  // Patchy light snow with thunder, Moderate or heavy snow with thunder
  if ([1279, 1282].includes(conditionCode)) {
    return 'snow'
  }

  // Blowing snow, Blizzard
  if ([1114, 1117].includes(conditionCode)) {
    return 'snow-flurries'
  }

  // Fog, Freezing fog
  if ([1135, 1147].includes(conditionCode)) {
    return 'clear-cloudy'
  }

  // Patchy light drizzle, Moderate drizzle, Heavy drizzle
  if ([1150, 1153, 1168, 1171].includes(conditionCode)) {
    return 'drizzle'
  }

  // Ice pellets
  if ([1237, 1261, 1264].includes(conditionCode)) {
    return 'hail'
  }

  // Heavy rain at times
  if ([1192, 1195, 1201].includes(conditionCode)) {
    return 'showers'
  }

  // Light rain shower, Moderate or heavy rain shower, Torrential rain shower
  if ([1240, 1243, 1246].includes(conditionCode)) {
    return 'showers'
  }

  // Light sleet showers, Moderate or heavy sleet showers
  if ([1249, 1252].includes(conditionCode)) {
    return 'sleet'
  }

  // Light snow showers, Moderate or heavy snow showers
  if ([1255, 1258].includes(conditionCode)) {
    return 'snow'
  }

  // Light showers of ice pellets, Moderate or heavy showers of ice pellets
  if ([1261, 1264].includes(conditionCode)) {
    return 'hail'
  }

  // Patchy light rain with thunder, Moderate or heavy rain with thunder
  if ([1273, 1276].includes(conditionCode)) {
    return 'thunderstroms'
  }

  // Patchy light snow with thunder, Moderate or heavy snow with thunder
  if ([1279, 1282].includes(conditionCode)) {
    return 'snow'
  }

  // Tornado
  if (conditionCode === 0) return 'tornado'

  // Windy
  if ([1003, 1006, 1009].includes(conditionCode)) {
    return 'windy'
  }

  // Default to sunny if no match
  return 'sunny'
}

