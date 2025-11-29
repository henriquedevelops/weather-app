<script setup lang="ts">
import CurrentWeatherCard from './CurrentWeatherCard.vue'
</script>

<template>
  <section>
    <CurrentWeatherCard />
  </section>
</template>

<style scoped lang="scss">
section {
  padding-inline: var(--padding-horizontal-main);
}
</style>
