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
    transition="none"
  >
    <template #skeleton>
      <slot v-if="loading" name="loading">
        <div>Загрузка...</div>
      </slot>
    </template>
    <template #default>
      <div v-if="error" key="error">
        <slot
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
      </div>

      <div v-else-if="data" key="success">
        <slot
          name="success"
          :data="data"
          :retry="retryHandler"
        />
      </div>

      <div v-else key="empty">
        <slot name="empty" />
      </div>
    </template>
  </SkeletonWrapper>
</template>
