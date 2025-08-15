<script setup lang="ts">
import { useDebounce } from '@vueuse/core'
import KitBtn from '~/components/01.kit/kit-btn/ui/kit-btn.vue'
import { KitInput } from '~/components/01.kit/kit-input'

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const debouncedSearchQuery = useDebounce(searchQuery, 300)
</script>

<template>
  <div class="trips-filters">
    <KitInput
      v-model="debouncedSearchQuery"
      icon="mdi:magnify"
      placeholder="Поиск по названию..."
      class="search-input"
      aria-label="Поиск по названию"
    />
    <KitBtn
      icon="mdi:filter-multiple-outline"
      variant="outlined"
      aria-label="Фильтры"
      class="search-filter-btn"
    />
  </div>
</template>

<style lang="scss" scoped>
.trips-filters {
  display: flex;
  gap: 16px;
  height: 46px;

  .search-input {
    max-width: 300px;
    width: 100%;

    :deep(input) {
      border: 1px solid var(--border-secondary-color);
    }
  }

  .search-filter-btn {
    background-color: var(--bg-secondary-color);
    border-radius: var(--r-s);
    border: 1px solid var(--border-secondary-color);
  }
}
</style>
