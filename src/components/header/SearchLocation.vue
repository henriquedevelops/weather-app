<script setup lang="ts">
// No functionality yet – this is just the UI shell for now.
</script>

<template>
  <input type="text" placeholder="Search for a city" />
</template>

<style scoped lang="scss">
input {
  height: 4.8rem;
  padding-inline: 1rem;
  border-radius: 10px;
  border: 2px solid var(--color-weather-light-blue);
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 1.4rem;
  outline: none;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  margin-bottom: 2.4rem;

  &:focus {
    border-color: var(--color-weather-blue);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}
</style>
