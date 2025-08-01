<script setup lang="ts">
import { Root } from '~/components/04.modules/root'
</script>

<template>
  <section class="root-wrapper">
    <Root />
  </section>
</template>

<style lang="scss" scoped>
.root-wrapper {
  @include default-font();

  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 1000px;
  min-height: 100%;
  width: 100%;
  margin: 0 auto;

  @include mobile {
    padding: 4px;
  }
}
</style>
