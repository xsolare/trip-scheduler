<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="travel-card-wrapper">
    <div class="travel-card">
      <div class="card-image-container">
        <Skeleton height="200px" width="100%" border-radius="0" />
      </div>
      <div class="card-content">
        <div class="card-meta">
          <Skeleton width="70%" height="24px" class="mb-4" />
          <Skeleton width="50%" height="18px" />
          <Skeleton width="60%" height="18px" />
          <Skeleton width="40%" height="18px" />
        </div>
        <div class="card-footer">
          <div class="card-participants-skeleton">
            <Skeleton width="32px" height="32px" border-radius="50%" />
            <Skeleton width="32px" height="32px" border-radius="50%" style="margin-left: -12px" />
          </div>
          <div class="card-tags-skeleton">
            <Skeleton width="70px" height="26px" border-radius="16px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.travel-card-wrapper {
  padding: 8px;
  border-radius: 20px;
}

.travel-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--bg-secondary-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid var(--border-primary-color);
}

.card-image-container {
  height: 200px;
  width: 100%;
  background-color: var(--bg-tertiary-color);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-secondary-color);
}

.card-participants-skeleton,
.card-tags-skeleton {
  display: flex;
  align-items: center;
}

.mb-4 {
  margin-bottom: 4px;
}
</style>
