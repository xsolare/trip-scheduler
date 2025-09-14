<script setup lang="ts">
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { KitImage } from '~/components/01.kit/kit-image'
import { KitInput } from '~/components/01.kit/kit-input'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useStorageStore } from '~/components/05.modules/account'

const storageStore = useStorageStore()
const {
  filteredAndSortedFiles,
  isLoading,
  error,
  viewMode,
  filters,
  totalStorageUsed,
} = storeToRefs(storageStore)

const confirm = useConfirm()

function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(dateString))
}

const viewModeItems: ViewSwitcherItem[] = [
  { id: 'grid', label: '', icon: 'mdi:view-grid-outline' },
  { id: 'list', label: '', icon: 'mdi:view-list-outline' },
]

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return '0 Байт'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

async function handleDeleteFile(fileId: string, fileName: string) {
  const isConfirmed = await confirm({
    title: `Удалить файл "${fileName}"?`,
    description: 'Файл будет удален навсегда. Это действие нельзя отменить.',
    type: 'danger',
  })
  if (isConfirmed) {
    storageStore.deleteFile(fileId)
  }
}

onMounted(() => {
  storageStore.fetchFiles()
})
</script>

<template>
  <div class="storage-page">
    <header class="storage-header">
      <h1>Управление хранилищем</h1>
      <p>Общий размер файлов: <strong>{{ formatBytes(totalStorageUsed) }}</strong></p>
    </header>

    <div class="controls-panel">
      <KitInput v-model="filters.search" placeholder="Поиск по названию..." icon="mdi:magnify" />
      <div class="filters">
        <!-- Фильтр по путешествиям будет здесь -->
      </div>
      <KitViewSwitcher v-model="viewMode" :items="viewModeItems" />
    </div>

    <AsyncStateWrapper :loading="isLoading" :error="error" :data="filteredAndSortedFiles">
      <template #loading>
        <div class="loading-state">
          Загрузка файлов...
        </div>
      </template>

      <template #success="{ data }">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="files-grid">
          <div v-for="file in data" :key="file.id" class="file-card">
            <div class="file-card-image">
              <KitImage :src="file.variants?.small || file.url" :alt="file.originalName" />
            </div>
            <div class="file-card-info">
              <span class="file-name" :title="file.originalName">{{ file.originalName }}</span>
              <span class="file-size">{{ formatBytes(file.sizeBytes) }}</span>
            </div>
            <button class="delete-btn" title="Удалить" @click="handleDeleteFile(file.id, file.originalName)">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="files-list">
          <div class="list-header-row">
            <span>Файл</span>
            <span>Путешествие</span>
            <span>Дата</span>
            <span>Размер</span>
            <span />
          </div>
          <div v-for="file in data" :key="file.id" class="list-item-row">
            <div class="file-info-cell">
              <KitImage :src="file.variants?.small || file.url" :alt="file.originalName" class="file-thumbnail" />
              <span>{{ file.originalName }}</span>
            </div>
            <td>{{ file.trip?.title || 'Без путешествия' }}</td>
            <td>{{ formatDate(file.createdAt, { dateStyle: 'short' }) }}</td>
            <td>{{ formatBytes(file.sizeBytes) }}</td>
            <td class="actions-cell">
              <button class="delete-btn" title="Удалить" @click="handleDeleteFile(file.id, file.originalName)">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </td>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="empty-state">
          <Icon icon="mdi:cloud-off-outline" />
          <p>Ваше хранилище пусто.</p>
        </div>
      </template>
    </AsyncStateWrapper>
  </div>
</template>

<style scoped lang="scss">
.storage-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.storage-header {
  h1 {
    font-size: 2rem;
    font-weight: 700;
  }
  p {
    color: var(--fg-secondary-color);
  }
}

.controls-panel {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.file-card {
  position: relative;
  border-radius: var(--r-xs);
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  overflow: hidden;

  &:hover .delete-btn {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-card-image {
  height: 150px;
}

.file-card-info {
  padding: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-size {
  font-size: 0.8rem;
  color: var(--fg-secondary-color);
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  background-color: rgba(var(--bg-primary-color-rgb), 0.7);
  color: var(--fg-error-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.files-list {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-m);
  border: 1px solid var(--border-secondary-color);
  overflow: hidden;
}

.list-header-row,
.list-item-row {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 1fr 60px;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1.5rem;
}

.list-header-row {
  font-weight: 600;
  color: var(--fg-secondary-color);
  font-size: 0.8rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-secondary-color);
  background-color: var(--bg-tertiary-color);
}

.list-item-row {
  border-bottom: 1px solid var(--border-secondary-color);
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: var(--bg-hover-color);
    .delete-btn {
      opacity: 1;
    }
  }
}

.file-info-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: var(--r-s);
  flex-shrink: 0;
}

.actions-cell {
  text-align: right;
  .delete-btn {
    position: static;
    transform: none;
    background: none;
  }
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 4rem;
  color: var(--fg-secondary-color);
  .iconify {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
}
</style>
