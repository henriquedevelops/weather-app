<script setup lang="ts">
import GreetingHeader from './header/GreetingHeader.vue'
import SearchLocation from './header/SearchLocation.vue'
import LocationTabs from './header/LocationTabs.vue'
</script>

<template>
  <div class="layout-wrapper">
    <header>
      <div class="header-top">
        <GreetingHeader />
        <SearchLocation />
      </div>
      <LocationTabs />
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout-wrapper {
  @media (min-width: 1024px) {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    max-width: 100%;
    max-width: 1100px;
  }
}

header {
  width: 100%;
  padding-inline: var(--padding-horizontal-main);
  padding-block: 24px;

  @media (min-width: 1024px) {
    padding-top: 5.6rem;
    padding-bottom: 3.7rem;
    padding-inline: 0;
  }
}

.header-top {
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 4.8rem;
  }
}
</style>
