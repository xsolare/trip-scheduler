<script setup lang="ts" generic="T">
import type { Ref } from 'vue'
import { SkeletonWrapper } from '~/components/01.kit/skeleton'
import { ErrorPlaceholder } from '~/components/02.shared/error-placeholder'

export interface AsyncStateWrapperProps<T = unknown> {
  loading?: boolean
  error?: unknown | null | Ref<unknown | null>
  data?: T | null
  retryHandler?: () => void | Promise<void> | Promise<unknown>
  transition?: string
}

defineProps<AsyncStateWrapperProps<T>>()
</script>

<template>
  <SkeletonWrapper
    :loading="loading ?? false"
    class="async-state-wrapper"
    :name="transition"
  >
    <template #skeleton>
      <slot v-if="loading" name="loading">
        <div>Загрузка...</div>
      </slot>
    </template>
    <template #default>
      <slot
        v-if="error"
        name="error"
        :error="error"
        :retry="retryHandler"
      >
        <ErrorPlaceholder
          image-src="/images/smth-wrong.png"
          title="Что-то пошло не так"
          message="Произошла ошибка при загрузке данных"
          action-text="Попробовать снова"
          @action="retryHandler"
        />
      </slot>

      <slot
        v-else-if="data"
        name="success"
        :data="data"
        :retry="retryHandler"
      />

      <slot v-else name="empty" />
    </template>
  </SkeletonWrapper>
</template>
