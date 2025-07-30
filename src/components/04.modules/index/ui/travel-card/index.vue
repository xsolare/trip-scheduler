<script setup lang="ts">
import type { ITravelPlan } from '~/components/04.modules/index/models/plan'
import { Icon } from '@iconify/vue'

type Props = ITravelPlan

const props = defineProps<Props>()

const router = useRouter()

function goTo() {
  router.push(AppRoutePaths.Plan(props.id.toString()))
}
</script>

<template>
  <button class="travel-card" @click="goTo">
    <div class="travel-card-image-wrapper">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="travel-card-image"
      >
      <span v-else class="travel-card-no-image">
        <Icon icon="mdi-image-remove" height="50" width="50" />
      </span>
    </div>

    <div class="travel-card-content">
      <span class="travel-card-title">
        {{ title }}
      </span>
    </div>
  </button>
</template>

<style scoped lang="scss">
.travel-card {
  display: block;
  width: 100%;
  border: 1px solid var(--bg-inverted-color);
  border-radius: 15px;
  background-color: var(--bg-primary-color);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  margin-bottom: 15px;

  overflow: hidden;

  transition:
    transform 0.25s ease-in-out,
    box-shadow 0.25s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
  }

  &:focus-visible {
    outline: 2px solid var(--bg-accent-color, --bg-accent-overlay-color);
    outline-offset: 2px;
  }

  &-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    width: 100%;
    background-color: var(--bg-disabled-color);
  }

  &-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 30% 30%;
  }

  &-no-image {
    font-size: 14px;
  }

  &-content {
    padding: 16px;
  }

  &-title {
    font-weight: bold;
    font-size: 1.125rem;
  }
}
</style>
