<script setup lang="ts">
import GreetingHeader from './GreetingHeader.vue'
import SearchLocation from './SearchLocation.vue'
</script>

<template>
  <header>
    <GreetingHeader />
    <SearchLocation />
  </header>

  <main>
    <slot />
  </main>
</template>

<style scoped lang="scss">
header {
  padding-inline: var(--padding-horizontal-main);
  padding-top: 24px;
  padding-bottom: 59px;
}
</style>
