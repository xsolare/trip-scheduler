<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'

interface Props {
  visible: boolean
  cities: string[]
}
defineProps<Props>()
const emit = defineEmits< { (e: 'update:visible', value: boolean): void }>()
</script>

<template>
  <KitDialogWithClose
    :visible="visible"
    title="Города путешествия"
    icon="mdi:city-variant-outline"
    :max-width="400"
    @update:visible="emit('update:visible', $event)"
  >
    <ul class="simple-list">
      <li v-for="city in cities" :key="city">
        <Icon icon="mdi:map-marker-outline" />
        <span>{{ city }}</span>
      </li>
    </ul>
  </KitDialogWithClose>
</template>

<style scoped lang="scss">
.simple-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: var(--bg-tertiary-color);
    border-radius: var(--r-s);
  }
}
</style>
