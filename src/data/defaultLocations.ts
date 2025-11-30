import type { LocationSearchResult } from '@/types/weather'

export const defaultLocations: LocationSearchResult[] = [
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
]
