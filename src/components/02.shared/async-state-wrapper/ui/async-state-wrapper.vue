<script setup lang="ts" generic="T">
import { SkeletonWrapper } from '~/components/01.kit/skeleton'
import { ErrorPlaceholder } from '~/components/02.shared/error-placeholder'

interface Props {
  loading?: boolean
  error?: unknown | null | Ref<unknown | null>
  data?: T | null
  retryHandler?: () => void | Promise<void> | Promise<unknown>
  transition?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  data: null,
  transition: 'none',
})
</script>

<template>
  <SkeletonWrapper
    :loading="loading"
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
