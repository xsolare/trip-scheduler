<script setup lang="ts">
import { NavigationBack } from '~/components/02.shared/navigation-back'
import { ExploreHub } from '~/components/05.modules/explore-hub';
</script>

<template>
  <section class="content-wrapper">
    <NavigationBack />
    <ExploreHub />
  </section>
</template>

<style scoped lang="scss">
.content-wrapper {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
