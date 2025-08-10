<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="trip-info-skeleton">
    <!-- Divider "о дне" -->
    <div class="divider-skeleton">
      <Skeleton width="80px" height="12px" border-radius="4px" type="wave" />
    </div>

    <!-- Day Header Skeleton (this was okay) -->
    <div class="day-header-skeleton">
      <Skeleton width="60%" height="32px" border-radius="6px" type="wave" style="margin-bottom: 16px;" />
      <Skeleton width="85%" height="18px" border-radius="6px" type="wave" />
    </div>

    <!-- Divider "маршрут" -->
    <div class="divider-skeleton">
      <Skeleton width="120px" height="12px" border-radius="4px" type="wave" />
    </div>

    <!-- Corrected Activities List Skeleton -->
    <div class="activities-list-skeleton">
      <div v-for="i in 4" :key="i" class="activity-item-skeleton">
        <!-- Diamond marker is handled by pseudo-element in styles -->
        <div class="activity-header-skeleton">
          <Skeleton width="40%" height="20px" border-radius="4px" type="wave" />
        </div>
        <div class="activity-body-skeleton">
          <Skeleton width="65%" height="24px" border-radius="6px" type="wave" />
          <!-- Conditionally add the description block to match the image -->
          <div v-if="i === 3" class="description-block-skeleton">
            <Skeleton width="90%" height="18px" border-radius="4px" type="wave" />
          </div>
          <!-- Skeleton for "Добавить блок" -->
          <div class="add-block-skeleton-wrapper">
            <Skeleton width="120px" height="17px" border-radius="4px" type="wave" />
          </div>
        </div>
      </div>
    </div>

    <!-- Corrected Add Activity Button Skeleton -->
    <div class="add-activity-skeleton">
      <Skeleton width="180px" height="20px" border-radius="4px" type="wave" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.trip-info-skeleton {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.controls-skeleton {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;

  .left-controls-skeleton {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .day-info-skeleton {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .spacer {
    flex-grow: 1;
  }
}

.divider-skeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--fg-secondary-color);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  height: 24px;
}

.day-header-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-2xs) var(--r-2xs) var(--r-l) var(--r-l);
  margin-bottom: 32px;
  margin-top: 16px;
}

.activities-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 16px;
  padding-left: 4px;
}

.activity-item-skeleton {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::before {
    content: '✦';
    position: absolute;
    left: -19px;
    top: 0px;
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    opacity: 0.5;
  }
}

.activity-header-skeleton {
  color: var(--fg-accent-color);
  font-weight: 600;
}

.activity-body-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 8px;

  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 24px;
    bottom: 10px;
    width: 2px;
    background-color: var(--border-secondary-color);
  }

  .description-block-skeleton {
    padding: 10px;
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-2xs);
  }

  .add-block-skeleton-wrapper {
    width: -moz-fit-content;
    width: fit-content;
    padding: 10px 12px;
    border: 2px dashed var(--border-secondary-color);
    border-radius: var(--r-s);
  }
}

.add-activity-skeleton {
  margin: 32px 0;
  display: flex;
  justify-content: center;

  :deep(.skeleton) {
    border: 2px dashed var(--border-secondary-color) !important;
    background: transparent !important;
  }
}
</style>
