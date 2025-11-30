<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherIcon from '@/components/WeatherIcon.vue'
import { getTemperatureColor, getDarkenedTemperatureColor } from '@/utils/temperatureColors'

const weatherStore = useWeatherStore()

const backgroundColor = computed(() => getTemperatureColor(weatherStore.currentTemperature))

const iconContainerBackgroundColor = computed(() =>
  getDarkenedTemperatureColor(weatherStore.currentTemperature),
)
</script>

<template>
  <!-- Skeleton State -->
  <article v-if="weatherStore.loading" class="container skeleton">
    <figure class="icon-weather-container skeleton-element" />
    <div class="weather-card__city">
      <div class="skeleton-element skeleton-text-large" />
      <div class="skeleton-element skeleton-text-small" />
    </div>
    <div class="weather-card__temperature">
      <div class="skeleton-element skeleton-text-xlarge" />
    </div>
  </article>

  <!-- Content State -->
  <article v-else class="container" :style="{ background: backgroundColor }">
    <figure
      class="icon-weather-container"
      :style="{ backgroundColor: iconContainerBackgroundColor }"
    >
      <WeatherIcon :condition-code="weatherStore.currentConditionCode" class="icon-weather" />
    </figure>

    <div class="weather-card__city">
      <h2 class="city-name">{{ weatherStore.selectedLocation }}</h2>
      <p class="weather-condition">{{ weatherStore.currentCondition }}</p>
    </div>

    <div class="weather-card__temperature">
      <data class="temperature-value" :value="weatherStore.currentTemperature ?? undefined">{{
        weatherStore.currentTemperature
      }}</data>
      <span class="temperature-unit" aria-label="Temperature unit">°C</span>
    </div>
  </article>
</template>

<style scoped lang="scss">
// ============================================
// Container
// ============================================
.container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  height: 9.7rem;
  padding-inline: 1.6rem;
  border-radius: 2rem;
  grid-row: span 2;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    justify-items: center;
    width: 25.6rem;
    height: 46.9rem;
    border-radius: 4rem;
    gap: 1.6rem;
    padding-block: 4.8rem;
  }

  // ============================================
  // Weather Icon Section
  // ============================================
  .icon-weather-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6rem;
    height: 6rem;

    border-radius: 50%;

    @media (min-width: 1024px) {
      width: 10rem;
      height: 10rem;
    }

    .icon-weather {
      width: 3.6rem;
      height: 3.6rem;

      @media (min-width: 1024px) {
        width: 6rem;
        height: 6rem;
      }
    }
  }

  // ============================================
  // City Information Section
  // ============================================
  .weather-card__city {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    @media (min-width: 1024px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      text-align: center;
      height: 100%;
    }

    .city-name {
      font-weight: 600;
      font-size: 2rem;
      line-height: 120%;
      letter-spacing: 0%;
      color: var(--color-text-primary);

      @media (min-width: 1024px) {
        font-size: 3.2rem;
      }
    }

    .weather-condition {
      font-weight: 600;
      font-size: 1.2rem;
      line-height: 120%;
      letter-spacing: 0%;
      color: var(--color-text-secondary);
    }
  }

  // ============================================
  // Temperature Section
  // ============================================
  .weather-card__temperature {
    display: flex;
    align-items: start;
    gap: 0.4rem;
    font-weight: 500;
    font-size: 5.2rem;
    line-height: 90%;
    letter-spacing: -0.05em;
    color: var(--color-text-primary);

    @media (min-width: 1024px) {
      font-size: 12rem;
    }

    .temperature-unit {
      font-weight: 600;
      font-size: 1.9rem;
      line-height: 120%;
      letter-spacing: -0.02em;
      height: 1.9rem;
      color: var(--color-text-primary);

      @media (min-width: 1024px) {
        font-size: 3.2rem;
      }
    }
  }
}

// ============================================
// Skeleton Styles
// ============================================
.skeleton {
  background: #f0f0f0;
}

.skeleton-element {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.4rem;
}

.skeleton-text-large {
  width: 12rem;
  height: 2.4rem;

  @media (min-width: 1024px) {
    width: 18rem;
    height: 3.8rem;
  }
}

.skeleton-text-small {
  width: 10rem;
  height: 1.4rem;

  @media (min-width: 1024px) {
    width: 14rem;
    height: 1.6rem;
  }
}

.skeleton-text-xlarge {
  width: 8rem;
  height: 5.2rem;

  @media (min-width: 1024px) {
    width: 16rem;
    height: 12rem;
  }
}

.skeleton .icon-weather-container {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;

  @media (min-width: 1024px) {
    width: 10rem;
    height: 10rem;
  }
}
</style>
