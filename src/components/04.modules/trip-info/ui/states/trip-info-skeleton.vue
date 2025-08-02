<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="trip-info-skeleton">
    <div class="days-controls-skeleton">
      <Skeleton v-for="i in 5" :key="i" width="36px" height="36px" border-radius="50%" type="wave" />
      <div class="spacer" />
      <Skeleton width="36px" height="36px" border-radius="8px" type="wave" />
    </div>

    <div class="divider-skeleton">
      <Skeleton width="80px" height="12px" border-radius="4px" type="wave" />
    </div>

    <div class="day-header-skeleton">
      <Skeleton width="60%" height="32px" border-radius="6px" type="wave" style="margin-bottom: 12px;" />
      <Skeleton width="85%" height="18px" border-radius="6px" type="wave" />
      <Skeleton width="75%" height="18px" border-radius="6px" type="wave" />
    </div>

    <div class="divider-skeleton">
      <Skeleton width="120px" height="12px" border-radius="4px" type="wave" />
    </div>

    <div class="activities-list-skeleton">
      <div v-for="i in 3" :key="i" class="activity-item-skeleton">
        <Skeleton width="120px" height="20px" border-radius="4px" type="wave" />
        <div class="activity-content-skeleton">
          <Skeleton width="90%" height="40px" border-radius="6px" type="wave" />
        </div>
      </div>
    </div>

    <Skeleton width="100%" height="52px" border-radius="8px" type="wave" style="margin-top: 16px;" />
  </div>
</template>

<style scoped lang="scss">
.trip-info-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
}

.days-controls-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;

  .spacer {
    flex-grow: 1;
  }
}

.divider-skeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.day-header-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-primary-color);
}

.activities-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.activity-item-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-content-skeleton {
  padding: 12px;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-primary-color);
  min-height: 60px;
}
</style>
