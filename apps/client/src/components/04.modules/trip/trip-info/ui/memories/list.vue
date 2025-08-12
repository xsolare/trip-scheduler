<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/image-viewer'
import type { Activity } from '~/shared/types/models/activity'
import type { Memory } from '~/shared/types/models/memory'
import { Icon } from '@iconify/vue'
import { useFileDialog } from '@vueuse/core'
import { KitDropdown } from '~/components/01.kit/kit-dropdown'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import { timeToMinutes } from '~/components/04.modules/trip/trip-info/lib/helpers'
import { EActivityStatus } from '~/shared/types/models/activity'
import { TripImagePlacement } from '~/shared/types/models/trip'
import MemoriesItem from './item.vue'

const { memories, gallery, data: tripData, ui } = useModuleStore(['memories', 'gallery', 'data', 'ui'])
const { memoriesForSelectedDay, unsortedMemories, isLoading } = storeToRefs(memories)
const { getActivitiesForSelectedDay, getSelectedDay } = storeToRefs(tripData)
const { isViewMode } = storeToRefs(ui)

const { open, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: true,
})

const galleryImages = computed<ImageViewerImage[]>(() => {
  const allMemories: Memory[] = [...memoriesForSelectedDay.value, ...unsortedMemories.value]
  const uniqueMemories = [...new Map(allMemories.map(item => [item.id, item])).values()]

  return uniqueMemories
    .filter(memory => memory.imageId && memory.imageUrl)
    .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime())
    .map(memory => ({
      url: memory.imageUrl!,
      alt: memory.comment || 'Memory Image',
      meta: { memory },
    }))
})

const isUploading = ref(false)

function handleAddTextNote() {
  const tripId = tripData.currentTripId
  if (!tripId)
    return

  // eslint-disable-next-line no-alert
  const newComment = prompt('Введите текст заметки:')
  if (newComment?.trim()) {
    memories.createMemory({
      tripId,
      comment: newComment.trim(),
      timestamp: new Date().toISOString(),
    })
  }
}

onChange(async (files) => {
  if (!files)
    return
  isUploading.value = true
  const tripId = tripData.currentTripId
  if (!tripId)
    return

  for (const file of Array.from(files)) {
    const newImage = await gallery.uploadImage(file, TripImagePlacement.MEMORIES)
    if (newImage) {
      await memories.createMemory({ tripId, imageId: newImage.id })
    }
  }

  isUploading.value = false
})

const mappedMemories = computed(() => {
  const activities = getActivitiesForSelectedDay.value
  const dayMemories = memoriesForSelectedDay.value
  const mapping: { [activityId: string]: any[] } = {}
  const unmappedMemories: any[] = []

  activities.forEach(act => (mapping[act.id] = []))

  for (const memory of dayMemories) {
    if (!memory.timestamp)
      continue

    const memoryTime = new Date(memory.timestamp)
    const memoryMinutes = memoryTime.getHours() * 60 + memoryTime.getMinutes()

    const correspondingActivity = activities.find((activity) => {
      const startMinutes = timeToMinutes(activity.startTime)
      const endMinutes = timeToMinutes(activity.endTime)
      return memoryMinutes >= startMinutes && memoryMinutes <= endMinutes
    })

    if (correspondingActivity) {
      mapping[correspondingActivity.id].push(memory)
    }
    else {
      unmappedMemories.push(memory)
    }
  }

  for (const key in mapping) {
    mapping[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  unmappedMemories.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return { ...mapping, unmapped: unmappedMemories }
})

const statusOptions: { value: EActivityStatus, label: string, icon: string }[] = [
  { value: EActivityStatus.COMPLETED, label: 'Пройден', icon: 'mdi:check-circle-outline' },
  { value: EActivityStatus.SKIPPED, label: 'Пропущен', icon: 'mdi:close-circle-outline' },
  { value: EActivityStatus.NONE, label: 'Не указан', icon: 'mdi:circle-outline' },
]

const statusInfo = computed(() => {
  return (status: EActivityStatus) => {
    return statusOptions.find(o => o.value === status) || statusOptions.find(o => o.value === EActivityStatus.NONE)!
  }
})

function updateActivityDetails(activity: Activity, data: Partial<Activity>) {
  tripData.updateActivity(activity.dayId, { ...activity, ...data })
}

function addMemoryToAction(activity: Activity) {
  // eslint-disable-next-line no-alert
  const comment = prompt('Добавьте текстовое воспоминание для этого события:')
  if (comment) {
    const tripId = tripData.currentTripId
    if (!tripId)
      return

    const dayDate = new Date(getSelectedDay.value!.date)
    const [startHours, startMinutes] = activity.startTime.split(':').map(Number)

    const memoryTimestamp = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      startHours,
      startMinutes,
    ).toISOString()

    memories.createMemory({ tripId, comment, timestamp: memoryTimestamp })
  }
}
</script>

<template>
  <div class="memories-list">
    <div v-if="!isViewMode" class="upload-section">
      <button class="upload-button" :disabled="isUploading" @click="() => open()">
        <Icon :icon="isUploading ? 'mdi:loading' : 'mdi:upload'" :class="{ spin: isUploading }" />
        <span>{{ isUploading ? 'Загрузка...' : 'Загрузить фотографии' }}</span>
      </button>
      <button class="add-note-button" @click="handleAddTextNote">
        <Icon icon="mdi:note-plus-outline" />
        <span>Добавить общую заметку</span>
      </button>
    </div>

    <div v-if="unsortedMemories.length > 0 && !isViewMode" class="unsorted-section">
      <h4>Фотографии для сортировки</h4>
      <p>Добавьте время, чтобы эти фото появились в вашей ленте за выбранный день.</p>
      <div class="unsorted-grid">
        <MemoriesItem
          v-for="memory in unsortedMemories"
          :key="memory.id"
          :memory="memory"
          :is-view-mode="isViewMode"
          :gallery-images="galleryImages"
          is-unsorted
        />
      </div>
    </div>

    <div v-if="getActivitiesForSelectedDay.length > 0" class="timeline-section">
      <div v-for="activity in getActivitiesForSelectedDay" :key="activity.id" class="activity-timeline-node">
        <div class="activity-header">
          <div class="activity-time">
            <span>{{ activity.startTime }}</span>
          </div>
          <div class="header-spacer" />
          <div class="activity-header-controls">
            <template v-if="!isViewMode">
              <KitDropdown
                :items="statusOptions"
                :model-value="activity.status"
                @update:model-value="(status: EActivityStatus) => updateActivityDetails(activity, { status })"
              >
                <template #trigger>
                  <div
                    class="status-badge"
                    :class="`status-${activity.status}`"
                    :title="statusInfo(activity.status).label"
                  >
                    <Icon :icon="statusInfo(activity.status).icon" class="status-icon" />
                    <span class="status-text">{{ statusInfo(activity.status).label }}</span>
                  </div>
                </template>
              </KitDropdown>

              <KitDropdown>
                <template #trigger>
                  <div class="rating-control" :class="{ 'has-rating': activity.rating }">
                    <div class="rating-stars">
                      <template v-if="!!activity.rating">
                        <Icon
                          v-for="i in 5"
                          :key="i"
                          :icon="activity.rating && activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'"
                          class="star"
                          height="14"
                          width="14"
                          :class="{ filled: activity.rating && activity.rating >= i }"
                        />
                      </template>
                    </div>
                    <span v-if="!activity.rating" class="rating-placeholder">Оценить</span>
                  </div>
                </template>

                <div class="rating-picker">
                  <div class="rating-picker-header">
                    Оценка события
                  </div>
                  <div class="rating-options">
                    <button
                      v-for="i in 5"
                      :key="i"
                      class="star-btn"
                      :class="{ active: activity.rating && activity.rating >= i }"
                      @click="updateActivityDetails(activity, { rating: i === activity.rating ? undefined : i })"
                    >
                      <Icon :icon="activity.rating && activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'" />
                    </button>
                  </div>
                  <button
                    v-if="activity.rating"
                    class="clear-rating-btn"
                    @click="updateActivityDetails(activity, { rating: undefined })"
                  >
                    Очистить оценку
                  </button>
                </div>
              </KitDropdown>
            </template>

            <template v-else>
              <div
                v-if="activity.status !== EActivityStatus.NONE"
                class="status-badge"
                :class="`status-${activity.status}`"
                :title="statusInfo(activity.status).label"
                style="cursor: default;"
              >
                <Icon :icon="statusInfo(activity.status).icon" class="status-icon" />
                <span class="status-text">{{ statusInfo(activity.status).label }}</span>
              </div>
              <div v-if="activity.rating" class="rating-control has-rating" style="cursor: default;">
                <div class="rating-stars">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    :icon="activity.rating && activity.rating >= i ? 'mdi:star' : 'mdi:star-outline'"
                    class="star"
                    height="14"
                    width="14"
                    :class="{ filled: activity.rating && activity.rating >= i }"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>

        <h5 class="activity-title">
          {{ activity.title }}
        </h5>

        <div class="memories-for-activity">
          <!-- @vue-ignore -->
          <MemoriesItem
            v-for="memory in mappedMemories[activity.id]"
            :key="memory.id"
            :memory="memory"
            :is-view-mode="isViewMode"
            :gallery-images="galleryImages"
          />
        </div>
      </div>

      <div v-if="mappedMemories.unmapped && mappedMemories.unmapped.length > 0" class="activity-timeline-node">
        <div class="activity-header" />

        <h5 class="activity-title">
          Прочие воспоминания за этот день
        </h5>

        <div class="memories-for-activity">
          <MemoriesItem
            v-for="memory in mappedMemories.unmapped"
            :key="memory.id"
            :memory="memory"
            :is-view-mode="isViewMode"
            :gallery-images="galleryImages"
          />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="state-info">
      Загрузка воспоминаний...
    </div>
    <div v-else-if="memories.memories.length === 0 && getActivitiesForSelectedDay.length === 0" class="state-info">
      <p>Здесь пока пусто.</p>
      <p>Добавьте свои первые фотографии или заметки, чтобы создать ленту воспоминаний!</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.memories-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.upload-section {
  display: flex;
  gap: 16px;
  padding: 24px;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-l);
  border: 1px solid var(--border-secondary-color);
}

.upload-button,
.add-note-button {
  flex: 1;
  padding: 16px;
  border-radius: var(--r-s);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.upload-button {
  background-color: transparent;
  border: 2px dashed var(--border-primary-color);
  color: var(--fg-accent-color);

  &:hover:not(:disabled) {
    background-color: var(--bg-hover-color);
    border-color: var(--fg-accent-color);
  }
}

.add-note-button {
  background-color: var(--bg-tertiary-color);
  border: 2px solid var(--bg-tertiary-color);
  color: var(--fg-primary-color);

  &:hover:not(:disabled) {
    background-color: var(--bg-hover-color);
  }
}

.unsorted-section {
  padding: 16px;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  h4 {
    margin: 0 0 4px;
  }
  p {
    margin: 0 0 16px;
    color: var(--fg-secondary-color);
    font-size: 0.9rem;
  }
}

.unsorted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.timeline-section {
  display: flex;
  flex-direction: column;
}

.activity-timeline-node {
  position: relative;
  padding-left: 16px;
  border-left: 2px solid var(--border-secondary-color);
  padding-bottom: 16px;
  padding-top: 16px;

  &:last-child {
    border-left-color: transparent;
  }

  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 24px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--bg-secondary-color);
    border: 2px solid var(--fg-accent-color);
  }
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  transition: all 0.2s ease;
  border-radius: var(--r-xs) var(--r-l) var(--r-l) var(--r-xs);

  &:hover {
    background-color: var(--bg-hover-color);
  }
}

.header-spacer {
  flex-grow: 1;
}

.activity-header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 8px;
  border-radius: var(--r-full);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  height: 30px;

  .status-icon {
    font-size: 1rem;
  }

  .status-text {
    white-space: nowrap;
    font-family: 'Sansation';
    font-weight: 700;
    font-size: 0.7rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--bg-hover-color);
  }

  &.status-completed {
    background: linear-gradient(135deg, var(--bg-tertiary-color), var(--bg-success-color));
    color: var(--fg-success-color);
    border-color: var(--border-success-color);
  }

  &.status-skipped {
    background: linear-gradient(135deg, var(--bg-tertiary-color), var(--bg-error-color));
    color: var(--fg-error-color);
    border-color: var(--border-error-color);
  }

  &.status-none {
    background: linear-gradient(135deg, var(--bg-tertiary-color), var(--bg-secondary-color));
    color: var(--fg-primary-color);
    border-color: var(--border-secondary-color);
  }
}

.rating-control {
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-full);
  cursor: pointer;
  transition: all 0.2s ease;
  height: 30px;

  &:hover {
    border-color: var(--fg-accent-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--bg-hover-color);
  }

  &.has-rating {
    background: linear-gradient(135deg, var(--bg-tertiary-color), #f1c40f28);
    border-color: #f1c40f28;
  }

  .rating-stars {
    display: flex;
    gap: 2px;

    .star {
      font-size: 1rem;
      color: var(--fg-tertiary-color);
      transition: all 0.15s ease;

      &.filled {
        color: #f1bc0f;
        transform: scale(1.1);
      }
    }
  }

  .rating-placeholder {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    font-weight: 500;
  }
}

.activity-time {
  background-color: var(--bg-secondary-color);
  padding: 2px 8px;
  border-radius: var(--r-xs);
  font-size: 0.85rem;
  font-weight: 600;
  height: 30px;
  color: var(--fg-secondary-color);
  white-space: nowrap;
}

.activity-title {
  margin: 2px 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating-picker {
  padding: 2px;
  min-width: 200px;

  .rating-picker-header {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--fg-primary-color);
    margin-bottom: 12px;
    text-align: center;
  }

  .rating-options {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 12px;
  }

  .star-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    font-size: 1.5rem;
    color: var(--fg-tertiary-color);
    transition: all 0.2s ease;
    border-radius: var(--r-xs);

    &:hover {
      transform: scale(1.2);
      background-color: var(--bg-hover-color);
    }

    &.active {
      color: #f1c40f;
      transform: scale(1.1);
    }
  }

  .clear-rating-btn {
    width: 100%;
    padding: 8px;
    background: none;
    border: 1px solid var(--border-secondary-color);
    border-radius: var(--r-xs);
    color: var(--fg-secondary-color);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--bg-hover-color);
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);
    }
  }
}

.memories-for-activity {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.state-info {
  text-align: center;
  padding: 40px;
  color: var(--fg-secondary-color);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
