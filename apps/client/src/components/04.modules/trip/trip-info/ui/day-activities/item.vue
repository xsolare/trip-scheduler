<script setup lang="ts">
import type { Activity, ActivitySection, ActivitySectionGallery, ActivitySectionGeolocation, ActivitySections, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import { EActivitySectionType } from '~/shared/types/models/activity'
import AddSectionMenu from '../controls/add-section-menu.vue'
import { ActivitySectionRenderer } from './sections'

interface ActivityItemProps {
  activity: Activity
  isFirst: boolean
  isLast: boolean
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['update', 'delete', 'moveUp', 'moveDown'])

const store = useModuleStore(['ui'])
const { isViewMode } = storeToRefs(store.ui)

const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)

const activityTitle = ref(props.activity.title)

const editingStartTime = shallowRef<Time | null>(null)
const editingEndTime = shallowRef<Time | null>(null)

const expandedSections = ref<Record<string, Record<string, boolean>>>({})

const sectionTypeIcons: Record<EActivitySectionType, string> = {
  [EActivitySectionType.DESCRIPTION]: 'mdi:text-box-outline',
  [EActivitySectionType.GALLERY]: 'mdi:image-multiple-outline',
  [EActivitySectionType.GEOLOCATION]: 'mdi:map-marker-outline',
}

function toggleSection(groupId: string, sectionId: string) {
  if (!expandedSections.value[groupId])
    expandedSections.value[groupId] = {}

  expandedSections.value[groupId][sectionId] = !isSectionExpanded(groupId, sectionId)
}

function toggleAllInSection(group: { parent: ActivitySection, children: ActivitySection[] }) {
  const groupId = group.parent.id
  const shouldExpand = !isAnyChildExpanded(group)

  if (!expandedSections.value[groupId])
    expandedSections.value[groupId] = {}

  for (const child of group.children)
    expandedSections.value[groupId][child.id] = shouldExpand
}

function updateActivity(newActivityData: Partial<Activity>) {
  emit('update', { ...props.activity, ...newActivityData })
}

function parseTime(timeStr: string): Time {
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Time(hour, minute)
}

function editTime() {
  if (isViewMode.value)
    return

  isTimeEditing.value = true
  editingStartTime.value = parseTime(props.activity.startTime)
  editingEndTime.value = parseTime(props.activity.endTime)
}

function saveTimeChanges() {
  if (!isTimeEditing.value)
    return

  const newStartTime = `${editingStartTime.value?.hour.toString().padStart(2, '0')}:${editingStartTime.value?.minute.toString().padStart(2, '0')}`
  const newEndTime = `${editingEndTime.value?.hour.toString().padStart(2, '0')}:${editingEndTime.value?.minute.toString().padStart(2, '0')}`
  updateActivity({ startTime: newStartTime, endTime: newEndTime })
  isTimeEditing.value = false
}

function cancelTimeEditing() {
  isTimeEditing.value = false
}

function updateSection(sectionId: string, newSectionData: ActivitySection) {
  const newSections = [...(props.activity.sections || [])]
  const sectionIndex = newSections.findIndex(s => s.id === sectionId)

  if (sectionIndex !== -1) {
    (newSections[sectionIndex] as ActivitySection) = newSectionData
    updateActivity({ sections: newSections })
  }
}

function addSection(type: EActivitySectionType) {
  let newSection: ActivitySection

  switch (type) {
    case EActivitySectionType.DESCRIPTION:
      newSection = {
        id: uuidv4(),
        type: EActivitySectionType.DESCRIPTION,
        text: '',
      } as ActivitySectionText
      break
    case EActivitySectionType.GALLERY:
      newSection = {
        id: uuidv4(),
        type: EActivitySectionType.GALLERY,
        imageUrls: [],
      } as ActivitySectionGallery
      break
    case EActivitySectionType.GEOLOCATION:
      newSection = {
        id: uuidv4(),
        type: EActivitySectionType.GEOLOCATION,
        latitude: 0,
        longitude: 0,
        address: '',
      } as ActivitySectionGeolocation
      break
    default:
      return
  }
  const newSections = [...(props.activity.sections || []), newSection]
  updateActivity({ sections: newSections as ActivitySections })
}

function deleteSection(sectionId: string) {
  const newSections = (props.activity.sections || []).filter(s => s.id !== sectionId)
  updateActivity({ sections: newSections })
}

const sectionGroups = computed(() => {
  const groups: { parent: ActivitySection, children: ActivitySection[] }[] = []
  const sections = props.activity.sections || []
  let i = 0

  while (i < sections.length) {
    const currentSection = sections[i]

    if (!currentSection.isAttached) {
      const attachedChildren = []
      let j = i + 1

      while (j < sections.length && sections[j].isAttached) {
        attachedChildren.push(sections[j])
        j++
      }
      groups.push({ parent: currentSection, children: attachedChildren })
      i = j
    }
    else {
      groups.push({ parent: currentSection, children: [] })
      i++
    }
  }
  return groups
})

function isSectionExpanded(groupId: string, sectionId: string): boolean {
  return expandedSections.value[groupId]?.[sectionId] ?? false
}

function isAnyChildExpanded(group: { children: ActivitySection[] }): boolean {
  if (!group.children.length)
    return false

  const groupId = sectionGroups.value.find(g => g.children === group.children)?.parent.id
  if (!groupId)
    return false

  return group.children.some(child => isSectionExpanded(groupId, child.id))
}

function handleInlineEditorBlur() {
  updateActivity({ title: activityTitle.value })
}

onClickOutside(timeEditorRef, saveTimeChanges)
</script>

<template>
  <div class="activity-item" :class="{ 'view-mode': isViewMode }">
    <div v-if="!isViewMode" class="drag-handle" />

    <div class="activity-header">
      <div class="activity-time">
        <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor" @keydown.esc.prevent="cancelTimeEditing">
          <KitTimeField v-if="editingStartTime" v-model="editingStartTime" />
          <span class="time-separator">-</span>
          <KitTimeField v-if="editingEndTime" v-model="editingEndTime" />
        </div>
        <div v-else class="time-display" @click="editTime">
          <div class="time-display-preview">
            {{ activity.startTime }}
            <span>-</span>
            {{ activity.endTime }}
          </div>
        </div>
      </div>
      <div class="activity-controls">
        <button
          class="control-btn"
          title="Поднять вверх"
          :disabled="isFirst"
          @click="$emit('moveUp')"
        >
          <Icon icon="mdi:arrow-up" />
        </button>
        <button
          class="control-btn"
          title="Опустить вниз"
          :disabled="isLast"
          @click="$emit('moveDown')"
        >
          <Icon icon="mdi:arrow-down" />
        </button>
        <button
          class="control-btn delete-btn"
          title="Удалить активность"
          @click="$emit('delete', activity.id)"
        >
          <Icon icon="mdi:trash-can-outline" />
        </button>
      </div>
    </div>

    <div class="activity-title">
      <Icon icon="mdi:chevron-right" />
      <KitInlineMdEditorWrapper
        v-model="activityTitle"
        placeholder="Описание активности"
        :readonly="isViewMode"
        class="activity-title-editor"
        :features="{ 'block-edit': false }"
        @blur="handleInlineEditorBlur"
      />
    </div>

    <div class="activity-sections">
      <div v-if="sectionGroups.length > 0" class="sections-list">
        <div
          v-for="group in sectionGroups"
          :key="group.parent.id"
          class="section-group"
          :class="{ 'has-children': group.children.length > 0 }"
        >
          <ActivitySectionRenderer
            :section="group.parent"
            :is-first-attached="false"
            @update-section="newSectionData => updateSection(group.parent.id, newSectionData)"
            @delete-section="deleteSection(group.parent.id)"
          />

          <div v-if="group.children.length > 0" class="attached-pills-container">
            <div class="attachment-line" />
            <div class="attached-pills">
              <button
                v-for="child in group.children"
                :key="child.id"
                class="attached-pill"
                :class="{ active: isSectionExpanded(group.parent.id, child.id) }"
                @click="toggleSection(group.parent.id, child.id)"
              >
                <Icon :icon="sectionTypeIcons[child.type]" class="pill-icon" />
              </button>
            </div>
            <button class="expand-toggle-btn" @click="toggleAllInSection(group)">
              <Icon :icon="isAnyChildExpanded(group) ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
            </button>
          </div>

          <div v-if="group.children.length > 0" class="attached-children">
            <template v-for="(child, childIndex) in group.children" :key="child.id">
              <div v-if="isSectionExpanded(group.parent.id, child.id)">
                <ActivitySectionRenderer
                  :section="child"
                  :is-first-attached="childIndex === 0"
                  @update-section="newSectionData => updateSection(child.id, newSectionData)"
                  @delete-section="deleteSection(child.id)"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="!isViewMode" class="add-section-controls">
        <AddSectionMenu @add-section="addSection" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
  margin: 32px 0;

  &:hover {
    &::before {
      background-color: var(--fg-accent-color);
    }
  }

  .drag-handle {
    position: absolute;
    left: -19px;
    width: 18px;
    top: 50%;
    height: 100%;
    transform: translateY(-50%);
    cursor: grab;
    padding: 8px;
    &:active {
      cursor: grabbing;
    }
  }

  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s ease;
    border-radius: var(--r-xs);

    &:hover {
      background-color: var(--bg-hover-color);
    }

    .activity-time {
      position: relative;
      font-weight: 600;
      color: var(--fg-accent-color);
      padding: 4px 0;

      &::before {
        position: absolute;
        left: -15px;
        top: 4px;
        content: '✦';
        font-size: 0.8rem;
        color: var(--fg-secondary-color);
        opacity: 0.5;
        transition:
          color 0.2s ease,
          opacity 0.2s ease;
      }
      .time-display {
        cursor: pointer;
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: var(--r-2xs);
        transition: background-color 0.2s ease;

        &-preview {
          padding: 0 4px;

          > span {
            margin: 0 5px;
          }
        }

        &:hover {
          background-color: var(--bg-hover-color);
        }
      }
      .time-editor {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .activity-controls {
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0;
      transition: all 0.2s ease-in-out;

      .control-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--r-full);
        background: transparent;
        border: 1px solid var(--border-secondary-color);
        color: var(--fg-secondary-color);
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background-color: var(--bg-hover-color);
          color: var(--fg-primary-color);
          border-color: var(--border-primary-color);
        }

        &.delete-btn:hover:not(:disabled) {
          background-color: var(--bg-error-color);
          color: var(--fg-error-color);
          border-color: var(--border-error-color);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }
  }

  .activity-title {
    display: flex;
    margin-top: 4px;
    gap: 4px;

    .iconify {
      height: 24px;
      opacity: 0.5;
      color: var(--fg-secondary-color);
    }

    &-editor {
      width: 100%;
      :deep(.milkdown) {
        * {
          font-weight: 500;
          font-size: 1.1rem;
        }
        > div {
          margin: 0;
          padding: 0;
        }
      }
    }
  }

  .activity-sections {
    margin-top: 12px;
    padding-left: 8px;
  }

  .sections-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .section-group {
    position: relative;
  }

  .attached-pills-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding-left: 16px;
    position: relative;

    .attachment-line {
      position: absolute;
      left: 6px;
      top: -8px;
      width: 10px;
      height: 25px;
      border-left: 2px solid var(--border-secondary-color);
      border-bottom: 2px solid var(--border-secondary-color);
      border-bottom-left-radius: 6px;
    }
  }

  .attached-pills {
    display: flex;
    gap: 4px;
    background: var(--bg-secondary-color);
    padding: 4px;
    border-radius: var(--r-l);
    border: 1px solid var(--border-secondary-color);
  }

  .attached-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--r-full);
    border: none;
    background: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    cursor: pointer;
    transition: all 0.2s ease;
    &.active {
      background: var(--fg-accent-color);
      color: var(--fg-inverted-color);
    }
    &:hover {
      background: var(--bg-hover-color);
      color: var(--fg-accent-color);
    }
    .pill-icon {
      font-size: 0.9rem;
    }
  }

  .expand-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--r-full);
    border: 1px solid var(--border-secondary-color);
    background: transparent;
    color: var(--fg-secondary-color);
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background: var(--bg-hover-color);
    }
  }

  .attached-children {
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    > div {
      margin-top: 12px;
    }
  }

  &.view-mode {
    .time-display {
      cursor: default !important;
      &:hover {
        background-color: transparent !important;
      }
    }

    &:hover {
      .activity-header .activity-time::before {
        color: var(--fg-secondary-color);
      }
    }
    .activity-header .activity-controls {
      display: none;
    }
    .sections-list {
      margin-bottom: 0;
    }
  }

  &::before {
    position: absolute;
    left: -10px;
    top: 30px;
    content: '';
    height: calc(100% - 30px);
    width: 2px;
    background-color: var(--border-secondary-color);
    transition: background-color 0.2s ease;
  }
}

.activity-item:hover .activity-header .activity-controls {
  opacity: 1;
}

@include media-down(sm) {
  .activity-item .activity-header .activity-controls {
    opacity: 1;
  }
  .activity-item {
    .activity-sections {
      padding-left: 0;
    }
    .attached-children {
      padding-left: 0;
    }
    .activity-section-renderer {
      &.is-attached {
        padding-left: 4px;
      }
    }
  }
}
</style>
