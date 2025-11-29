<script setup lang="ts">
import GreetingHeader from './GreetingHeader.vue'
</script>

<template>
  <div class="">
    <header class="">
      <GreetingHeader />
    </header>

    <main class="">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
header {
  padding-inline: var(--padding-horizontal-main);
  padding-top: 24px;
  padding-bottom: 59px;
}
</style>
