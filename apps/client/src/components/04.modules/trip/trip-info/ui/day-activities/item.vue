<script setup lang="ts">
import type { Activity, ActivitySection, ActivitySectionGallery, ActivitySectionGeolocation, ActivitySections, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { TimeField } from '~/components/01.kit/time-field'
import { useModuleStore } from '~/components/04.modules/trip/trip-info/composables/use-module'
import { ActivitySectionType } from '~/shared/types/models/activity'
import AddSectionMenu from '../controls/add-section-menu.vue'
import { ActivitySectionRenderer } from './sections'

interface ActivityItemProps {
  activity: Activity
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['update', 'delete'])

const store = useModuleStore(['ui'])
const { isViewMode } = storeToRefs(store.ui)

const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)

const editingStartTime = shallowRef<Time | null>(null)
const editingEndTime = shallowRef<Time | null>(null)

const expandedSections = ref<Record<string, Record<string, boolean>>>({})

const sectionTypeIcons: Record<ActivitySectionType, string> = {
  [ActivitySectionType.DESCRIPTION]: 'mdi:text-box-outline',
  [ActivitySectionType.GALLERY]: 'mdi:image-multiple-outline',
  [ActivitySectionType.GEOLOCATION]: 'mdi:map-marker-outline',
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

const activityTitle = computed({
  get: () => props.activity.title,
  set: newTitle => updateActivity({ title: newTitle }),
})

function updateSection(sectionId: string, newSectionData: ActivitySection) {
  const newSections = [...(props.activity.sections || [])]
  const sectionIndex = newSections.findIndex(s => s.id === sectionId)

  if (sectionIndex !== -1) {
    (newSections[sectionIndex] as ActivitySection) = newSectionData
    updateActivity({ sections: newSections })
  }
}

function addSection(type: ActivitySectionType) {
  let newSection: ActivitySection
  switch (type) {
    case ActivitySectionType.DESCRIPTION:
      newSection = {
        id: uuidv4(),
        type: ActivitySectionType.DESCRIPTION,
        text: '',
      } as ActivitySectionText
      break
    case ActivitySectionType.GALLERY:
      newSection = {
        id: uuidv4(),
        type: ActivitySectionType.GALLERY,
        imageUrls: [],
      } as ActivitySectionGallery
      break
    case ActivitySectionType.GEOLOCATION:
      newSection = {
        id: uuidv4(),
        type: ActivitySectionType.GEOLOCATION,
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

onClickOutside(timeEditorRef, saveTimeChanges)
</script>

<template>
  <div class="activity-item" :class="{ 'view-mode': isViewMode }">
    <div v-if="!isViewMode" class="drag-handle" />

    <div class="activity-header">
      <div class="activity-time">
        <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor" @keydown.esc.prevent="cancelTimeEditing">
          <TimeField v-if="editingStartTime" v-model="editingStartTime" />
          <span class="time-separator">-</span>
          <TimeField v-if="editingEndTime" v-model="editingEndTime" />
        </div>
        <div v-else class="time-display" @click="editTime">
          <div class="time-display-preview">
            {{ activity.startTime }}
            <span>-</span>
            {{ activity.endTime }}
          </div>
        </div>
      </div>
    </div>

    <div class="activity-title">
      <Icon icon="mdi:chevron-right" />
      <InlineEditorWrapper
        v-model="activityTitle"
        placeholder="Описание активности"
        :readonly="isViewMode"
        class="activity-title-editor"
        :features="{ 'block-edit': false }"
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
        border-radius: 4px;
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
    border-radius: 16px;
    border: 1px solid var(--border-secondary-color);
  }

  .attached-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    cursor: pointer;
    transition: all 0.2s ease;
    &.active {
      background: var(--fg-accent-color);
      color: white;
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
    border-radius: 50%;
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

@include media-down(sm) {
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
