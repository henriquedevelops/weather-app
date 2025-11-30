<script setup lang="ts">
const name = 'Samantha'
</script>

<template>
  <h1>Good afternoon, {{ name }} 🌞</h1>
</template>

<style scoped lang="scss">
h1 {
  font-size: 24px;
  font-weight: 600;
  line-height: 120%;
  letter-spacing: 0%;
  margin-bottom: 4.8rem;
  color: var(--color-text-primary);

  @media (min-width: 1024px) {
    padding-left: 1.2rem;
    font-size: 4.8rem;
    margin-bottom: 0;
    flex: 1;
  }
}
</style>
