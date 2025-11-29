<script setup lang="ts">
import SnowIcon from '~icons/local/snow'
</script>

<template>
  <article class="container">
    <figure class="icon-weather-container">
      <SnowIcon class="icon-weather" />
    </figure>

    <div class="weather-card__city">
      <h2 class="city-name">Denver</h2>
      <p class="weather-condition">Snowing</p>
    </div>

    <div class="weather-card__temperature">
      <data class="temperature-value" value="--">2</data>
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
  background: var(--color-weather-blue);
  border-radius: 2rem;

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
    background-color: #aed3f4;
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
</style>
