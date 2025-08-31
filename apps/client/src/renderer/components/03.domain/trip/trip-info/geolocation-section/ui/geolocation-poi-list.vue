<script setup lang="ts">
import type { MapPoint } from '../models/types'
import { Icon } from '@iconify/vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitInput } from '~/components/01.kit/kit-input'

interface Props {
  points: MapPoint[]
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'focusOnPoint', point: MapPoint): void
  (e: 'updatePoint', point: MapPoint): void
  (e: 'updatePointCoords', point: MapPoint): void
  (e: 'deletePoint', pointId: string): void
  (e: 'startMovePoint', pointId: string): void
}>()
</script>

<template>
  <div class="poi-list">
    <div
      v-for="(point, index) in points"
      :key="point.id"
      class="poi-item"
      :class="{ 'is-readonly': readonly }"
      @click="props.readonly && emit('focusOnPoint', point)"
    >
      <div class="poi-marker-visual">
        <span class="poi-number" :style="{ backgroundColor: point.style?.color }">
          {{ index + 1 }}
        </span>
      </div>

      <div class="poi-info">
        <div class="poi-field">
          <Icon icon="mdi:map-marker-outline" class="field-icon" />
          <KitInlineMdEditorWrapper
            v-if="!readonly"
            :model-value="point.address!"
            class="poi-editor poi-address"
            :features="{
              'block-edit': false,
              'code-mirror': false,
              'cursor': false,
              'image-block': false,
              'latex': false,
              'link-tooltip': false,
              'table': false,
              'toolbar': false,
            }"
            placeholder="Адрес не найден"
            @update:model-value="point.address = $event"
            @blur="emit('updatePoint', point)"
          />
          <span v-else class="poi-text">{{ point.address || 'Адрес не найден' }}</span>
        </div>
        <div class="poi-field">
          <Icon icon="mdi:comment-text-outline" class="field-icon" />
          <KitInlineMdEditorWrapper
            v-if="!readonly"
            :model-value="point.comment!"
            class="poi-editor poi-comment"
            :features="{
              'block-edit': false,
              'code-mirror': false,
              'cursor': false,
              'image-block': false,
              'latex': false,
              'link-tooltip': false,
              'table': false,
              'toolbar': false,
            }"
            placeholder="Добавить комментарий"
            @update:model-value="point.comment = $event"
            @blur="emit('updatePoint', point)"
          />
          <span v-else class="poi-text poi-text-comment">{{ point.comment || 'Нет комментария' }}</span>
        </div>

        <div v-if="!readonly" class="poi-controls">
          <div class="poi-coords">
            <KitInput
              :model-value="point.coordinates[1]"
              size="sm"
              type="text"
              @update:model-value="point.coordinates[1] = Number($event)"
              @keydown.enter="emit('updatePointCoords', point)"
              @blur="emit('updatePointCoords', point)"
            />
            <KitInput
              :model-value="point.coordinates[0]"
              size="sm"
              type="text"
              @update:model-value="point.coordinates[0] = Number($event)"
              @keydown.enter="emit('updatePointCoords', point)"
              @blur="emit('updatePointCoords', point)"
            />
          </div>
          <div class="poi-actions">
            <KitBtn icon="mdi:arrow-all" variant="outlined" size="sm" aria-label="Переместить точку" @click="emit('startMovePoint', point.id)" />
            <KitBtn icon="mdi:delete-outline" variant="solid" size="sm" aria-label="Удалить точку" @click="emit('deletePoint', point.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.poi-list {
  display: flex;
  flex-direction: column;
}

.poi-item {
  position: relative;
  display: flex;
  padding: 12px;
  background-color: var(--bg-tertiary-color);
  border-radius: var(--r-xs);
  transition: background-color 0.2s ease;
  margin: 4px;

  &.is-readonly {
    cursor: pointer;

    &:hover {
      background-color: var(--bg-hover-color);
    }
  }
}

.poi-marker-visual {
  position: absolute;
  left: -4px;
  top: -4px;
  opacity: 0.6;

  .poi-number {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sansation';
    width: 20px;
    height: 20px;
    border-radius: var(--r-xs);
    color: white;
    font-size: 0.65rem;
    line-height: 20px;
    font-weight: 600;
    flex-shrink: 0;
  }
}

.poi-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.poi-field {
  display: flex;
  align-items: center;
  gap: 8px;

  .field-icon {
    font-size: 1.1rem;
    color: var(--fg-secondary-color);
    flex-shrink: 0;
  }
}

.poi-text {
  font-weight: 500;
  font-size: 0.9rem;
  padding: 4px 0;
  line-height: 1.4;
  white-space: normal;
  word-break: break-word;

  &-comment {
    font-size: 0.85rem;
    color: var(--fg-secondary-color);
    font-style: italic;
  }
}

.poi-editor {
  width: 100%;
  padding: 4px 0;
  line-height: 1.4;
  min-height: 25px;
}

.poi-address {
  :deep() {
    .milkdown .ProseMirror p {
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--fg-primary-color);
    }
  }
}

.poi-comment {
  :deep() {
    .milkdown .ProseMirror p {
      font-size: 0.85rem;
      color: var(--fg-secondary-color);
    }
  }
}

.poi-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.poi-coords {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  min-width: 0;

  .kit-input-group {
    max-width: 150px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }
}

.poi-actions {
  display: flex;
  gap: 4px;
}
</style>
