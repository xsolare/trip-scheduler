<script lang="ts" setup>
import { BackgroundEffects } from '~/components/02.shared/background-effects'
import Footer from './footer.vue'
import Header from './header.vue'
</script>

<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <Header />

  <main class="main">
    <div class="main-content">
      <slot />
    </div>

    <BackgroundEffects />

    <Footer />
  </main>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.main-content {
  height: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
