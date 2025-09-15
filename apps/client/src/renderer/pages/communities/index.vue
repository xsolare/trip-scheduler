<script setup lang="ts">
import { NavigationBack } from '~/components/02.shared/navigation-back/index'
import { CommunitiesHub } from '~/components/05.modules/communities-hub'
</script>

<template>
  <section class="content-wrapper">
    <NavigationBack />
    <CommunitiesHub />
  </section>
</template>

<style lang="scss" scoped>
.content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
