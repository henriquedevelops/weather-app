export interface CurrentWeather {
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

export interface ForecastDay {
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

export interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    localtime: string
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

