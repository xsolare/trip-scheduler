<script setup lang="ts">
import { NavigationBack } from '~/components/02.shared/navigation-back'
import { UsefulLinks } from '~/components/05.modules/useful-links'
</script>

<template>
  <section class="content-wrapper">
    <NavigationBack />
    <UsefulLinks />
  </section>
</template>

<style scoped lang="scss">
.content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
