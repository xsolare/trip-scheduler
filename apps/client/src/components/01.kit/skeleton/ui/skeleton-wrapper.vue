<script setup lang="ts">
interface Props {
  loading: boolean
  transition?: string
}

defineProps<Props>()
</script>

<template>
  <Transition :name="transition ?? 'skeleton-fade'" mode="out-in">
    <!-- Если загрузка, показываем слот для скелетонов -->
    <div v-if="loading" key="skeleton">
      <slot name="skeleton" />
    </div>

    <!-- Иначе показываем контент по умолчанию -->
    <div v-else key="content">
      <slot />
    </div>
  </Transition>
</template>

<style>
/*
  Стили для Transition должны быть глобальными или не-scoped,
  чтобы Vue мог их правильно применять к элементам, которые входят и выходят из DOM.
*/
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>
