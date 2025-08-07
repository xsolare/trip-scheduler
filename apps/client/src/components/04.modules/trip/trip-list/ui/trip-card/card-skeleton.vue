<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="travel-card-wrapper">
    <div class="travel-card">
      <div class="card-image-container">
        <!-- Скелетоны для элементов в шапке (статус и заголовок) -->
        <div class="card-header-skeleton">
          <!-- Эти скелетоны используют цвет по умолчанию -->
          <Skeleton width="110px" height="34px" border-radius="20px" />
        </div>

        <div class="card-title-skeleton">
          <Skeleton width="55%" height="28px" />
        </div>

        <!-- Скелетон для иконки приватности -->
        <div class="card-visibility-skeleton">
          <Skeleton width="32px" height="32px" border-radius="50%" />
        </div>
      </div>

      <div class="card-content">
        <div class="card-meta">
          <!-- Скелетоны для мета-данных (даты, города, бюджет) -->
          <div class="meta-item-skeleton">
            <Skeleton width="24px" height="24px" border-radius="50%" color="var(--bg-tertiary-color)" />
            <Skeleton width="60%" height="20px" color="var(--bg-tertiary-color)" />
          </div>
          <div class="meta-item-skeleton">
            <Skeleton width="24px" height="24px" border-radius="50%" color="var(--bg-tertiary-color)" />
            <Skeleton width="70%" height="20px" color="var(--bg-tertiary-color)" />
          </div>
          <div class="meta-item-skeleton">
            <Skeleton width="24px" height="24px" border-radius="50%" color="var(--bg-tertiary-color)" />
            <Skeleton width="40%" height="20px" color="var(--bg-tertiary-color)" />
          </div>
        </div>

        <div class="card-footer">
          <!-- Скелетоны для аватарок участников -->
          <div class="card-participants-skeleton">
            <Skeleton width="32px" height="32px" border-radius="50%" color="var(--bg-tertiary-color)" />
            <Skeleton width="32px" height="32px" border-radius="50%" class="avatar-overlap" color="var(--bg-tertiary-color)" />
          </div>
          <!-- Скелетоны для тегов -->
          <div class="card-tags-skeleton">
            <Skeleton width="80px" height="26px" border-radius="16px" color="var(--bg-tertiary-color)" />
            <Skeleton width="60px" height="26px" border-radius="16px" color="var(--bg-tertiary-color)" />
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
  border: 1px solid var(--border-secondary-color);
}

.card-image-container {
  position: relative;
  height: 200px;
  width: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--bg-tertiary-color);
}

.card-header-skeleton {
  display: flex;
  z-index: 2;
}

.card-title-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
  margin-right: 40px;
}

.card-visibility-skeleton {
  position: absolute;
  bottom: 12px;
  right: 16px;
  z-index: 2;
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
  gap: 10px;
}

.meta-item-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
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

.card-participants-skeleton {
  .avatar-overlap {
    margin-left: -8px;
  }
}

.card-tags-skeleton {
  gap: 6px;
}
</style>
