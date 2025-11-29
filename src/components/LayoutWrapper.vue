<script setup lang="ts">
import GreetingHeader from './header/GreetingHeader.vue'
import SearchLocation from './header/SearchLocation.vue'
import LocationTabs from './header/LocationTabs.vue'
</script>

<template>
  <header>
    <GreetingHeader />
    <SearchLocation />
    <LocationTabs />
  </header>

  <main>
    <slot />
  </main>
</template>

<style scoped lang="scss">
header {
  padding-inline: var(--padding-horizontal-main);
  padding-block: 24px;

  @media (min-width: 1024px) {
    padding-top: 5.6rem;
    padding-bottom: 4.8rem;
  }
}
</style>
