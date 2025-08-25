<script setup lang="ts">
import type { Activity, ActivitySection, ActivitySectionGallery, ActivitySectionGeolocation, ActivitySections, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { KitInlineMdEditorWrapper } from '~/components/01.kit/kit-inline-md-editor'
import { KitTimeField } from '~/components/01.kit/kit-time-field'
import { EActivitySectionType } from '~/shared/types/models/activity'
import { useModuleStore } from '../../composables/use-module'
import AddSectionMenu from '../controls/add-section-menu.vue'
import { ActivitySectionRenderer } from './sections'

interface ActivityItemProps {
  activity: Activity
  isFirst: boolean
  isLast: boolean
  isCollapsed: boolean
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['update', 'delete', 'moveUp', 'moveDown', 'toggleCollapse'])

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

function getGroupedChildren(children: ActivitySection[]) {
  const withTitle: ActivitySection[] = []
  const withoutTitle: ActivitySection[] = []
  children.forEach((child) => {
    if (child.title)
      withTitle.push(child)
    else
      withoutTitle.push(child)
  })
  return { withTitle, withoutTitle }
}

function toggleSection(groupId: string, sectionId: string) {
  if (!expandedSections.value[groupId])
    expandedSections.value[groupId] = {}

  expandedSections.value[groupId][sectionId] = !isSectionExpanded(groupId, sectionId)
}

function toggleAllInSection(group: { parent: ActivitySection, children: ActivitySection[] }) {
  const groupId = group.parent.id
  const shouldExpand = group.children.some(child => !isSectionExpanded(groupId, child.id))

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

function isAnyChildExpanded(group: { parent: ActivitySection, children: ActivitySection[] }): boolean {
  const groupId = group.parent.id
  if (!group.children.length || !expandedSections.value[groupId])
    return false

  return group.children.some(child => isSectionExpanded(groupId, child.id))
}

function handleInlineEditorBlur() {
  updateActivity({ title: activityTitle.value })
}

onClickOutside(timeEditorRef, saveTimeChanges)
</script>

<template>
  <div class="activity-item" :class="{ 'view-mode': isViewMode, 'is-collapsed': isCollapsed && isViewMode }">
    <div v-if="!isViewMode" class="drag-handle" />

    <div class="activity-header">
      <div class="activity-time-wrapper">
        <div class="activity-time">
          <div v-if="isTimeEditing" ref="timeEditorRef" class="time-editor" @keydown.esc.prevent="cancelTimeEditing">
            <KitTimeField v-model="editingStartTime" />
            <span class="time-separator">-</span>
            <KitTimeField v-model="editingEndTime" />
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

      <button v-if="isViewMode" class="collapse-toggle-btn" @click="$emit('toggleCollapse')">
        <Icon :icon="isCollapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'" />
      </button>

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

    <div v-show="!isCollapsed || !isViewMode">
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

            <div v-if="group.children.length > 0" class="attached-items-container">
              <!-- Сначала рендерим пины с заголовками, каждый на своей строке -->
              <div
                v-for="(child, index) in getGroupedChildren(group.children).withTitle"
                :key="child.id"
                class="titled-pin-block"
              >
                <div class="titled-pin-wrapper">
                  <div class="attachment-line-start" />
                  <button
                    class="attached-pill titled-pin"
                    :class="{ active: isSectionExpanded(group.parent.id, child.id) }"
                    @click="toggleSection(group.parent.id, child.id)"
                  >
                    <Icon width="20" height="20" :icon="child.icon || sectionTypeIcons[child.type]" class="pill-icon" />
                    <span class="pill-title">{{ child.title }}</span>
                    <Icon width="20" height="20" :icon="isSectionExpanded(group.parent.id, child.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="pill-chevron" />
                  </button>
                  <div v-if="index < getGroupedChildren(group.children).withTitle.length - 1 || getGroupedChildren(group.children).withoutTitle.length > 0" class="attachment-line-end" />
                </div>
                <!-- Раскрытый контент рендерится сразу после своего пина -->
                <div v-if="isSectionExpanded(group.parent.id, child.id)" class="expanded-pin-content">
                  <ActivitySectionRenderer
                    :section="child"
                    :is-first-attached="true"
                    @update-section="newSectionData => updateSection(child.id, newSectionData)"
                    @delete-section="deleteSection(child.id)"
                  />
                </div>
              </div>

              <!-- Затем рендерим пины без заголовков в одну строку -->
              <div v-if="getGroupedChildren(group.children).withoutTitle.length > 0">
                <div class="regular-pins-wrapper">
                  <div class="attachment-line-start" />
                  <div class="attached-pills">
                    <button
                      v-for="child in getGroupedChildren(group.children).withoutTitle"
                      :key="child.id"
                      class="attached-pill"
                      :class="{ active: isSectionExpanded(group.parent.id, child.id) }"
                      @click="toggleSection(group.parent.id, child.id)"
                    >
                      <Icon
                        width="20"
                        height="20"
                        :icon="child.icon || sectionTypeIcons[child.type]"
                        class="pill-icon"
                      />
                    </button>
                  </div>
                  <button class="expand-toggle-btn" @click="toggleAllInSection(group)">
                    <Icon :icon="isAnyChildExpanded(group) ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                  </button>
                </div>
                <!-- Раскрытый контент для обычных пинов рендерится после всей группы -->
                <div
                  v-for="child in getGroupedChildren(group.children).withoutTitle"
                  :key="child.id"
                >
                  <div v-if="isSectionExpanded(group.parent.id, child.id)" class="expanded-pin-content">
                    <ActivitySectionRenderer
                      :section="child"
                      :is-first-attached="true"
                      @update-section="newSectionData => updateSection(child.id, newSectionData)"
                      @delete-section="deleteSection(child.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isViewMode" class="add-section-controls">
          <AddSectionMenu @add-section="addSection" />
        </div>
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

  &.is-collapsed {
    margin-bottom: 0;

    &::before {
      display: none;
    }
  }

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

    .activity-time-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .collapse-toggle-btn {
      background: none;
      border: 1px solid transparent;
      cursor: pointer;
      color: var(--fg-secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
      font-size: 1.2rem;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      opacity: 0;

      &:hover {
        background-color: var(--bg-hover-color);
        color: var(--fg-primary-color);
        opacity: 1;
      }
    }

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

  .attached-items-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
    padding-left: 16px;
    position: relative;
  }

  .titled-pin-wrapper,
  .regular-pins-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  .attachment-line-start {
    position: absolute;
    left: -10px;
    top: -8px;
    width: 10px;
    height: 25px;
    border-left: 2px solid var(--border-secondary-color);
    border-bottom: 2px solid var(--border-secondary-color);
    border-bottom-left-radius: 6px;
  }
  .attachment-line-end {
    position: absolute;
    left: -10px;
    top: 12px;
    width: 10px;
    height: 100%;
    border-left: 2px solid var(--border-secondary-color);
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
    padding: 4px;

    &.active {
      background: var(--fg-accent-color);
      color: var(--fg-inverted-color);
    }
    &:hover {
      background: var(--bg-hover-color);
      color: var(--fg-accent-color);
    }
  }

  .expanded-pin-content {
    margin-top: 12px;
    position: relative;
  }

  .titled-pin {
    width: auto;
    height: auto;
    padding: 6px 12px;
    gap: 8px;
    border-radius: var(--r-l);

    .pill-title {
      font-size: 0.8rem;
      font-weight: 500;
    }
    .pill-chevron {
      font-size: 0.9rem;
      margin-left: 4px;
    }
    &-block {
      .expanded-pin-content {
        &::before {
          content: '';
          position: absolute;
          left: -10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--border-secondary-color);
        }

        .is-attached {
          padding-left: 0px;
          border-left: 0;
        }
      }
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

.activity-item:not(.view-mode):hover .activity-header .activity-controls {
  opacity: 1;
}

.activity-item.view-mode:hover .activity-header .collapse-toggle-btn {
  opacity: 1;
}

@include media-down(sm) {
  .activity-item .activity-header .activity-controls {
    opacity: 1;
  }
  .activity-item.view-mode .activity-header .collapse-toggle-btn {
    opacity: 1;
  }
  .activity-item {
    .activity-sections {
      padding-left: 0;
    }
    .expanded-pin-content {
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
