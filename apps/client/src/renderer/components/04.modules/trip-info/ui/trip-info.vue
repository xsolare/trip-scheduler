<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDropZone } from '@vueuse/core'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useModuleStore } from '../composables/use-module'
import DayNavigation from './controls/day-navigation.vue'
import DaysControls from './controls/days-controls.vue'
import DayHeader from './day-header.vue'
import Memories from './memories/memories.vue'
import Proposal from './proposal/proposal.vue'
import TripInfoEmpty from './states/trip-info-empty.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const emit = defineEmits(['update:hasError'])
const route = useRoute()
const router = useRouter()

const store = useModuleStore(['data', 'ui', 'routeGallery', 'memories'])
const { days, isLoading, fetchError } = storeToRefs(store.data)
const { activeView, isViewMode } = storeToRefs(store.ui)

const tripId = computed(() => route.params.id as string)
const dayId = computed(() => route.query.day as string)

const dropZoneRef = ref<HTMLDivElement | null>(null)

function onDrop(files: File[] | null) {
  if (!files || activeView.value !== 'memories' || isViewMode.value)
    return

  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (imageFiles.length > 0)
    imageFiles.forEach(file => store.memories.uploadMemoryImage(file))
}

const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop })

// --- Жизненный цикл ---

if (tripId.value) {
  store.data.fetchTripDetails(tripId.value, dayId.value)
  store.routeGallery.setTripId(tripId.value)
  store.routeGallery.fetchTripImages()
  store.memories.fetchMemories(tripId.value)
}

watch(fetchError, (newError) => {
  emit('update:hasError', !!newError)
})

watch(
  () => store.data.currentDayId,
  (newDayId, oldDayId) => {
    if (newDayId && newDayId !== oldDayId)
      store.ui.clearCollapsedState()

    if (newDayId && newDayId !== route.query.day)
      router.replace({ query: { ...route.query, day: newDayId } })
  },
)

onBeforeUnmount(() => {
  store.data.reset()
  store.routeGallery.reset()
  store.ui.reset()
})
</script>

<template>
  <template v-if="!fetchError">
    <DaysControls />
  </template>

  <AsyncStateWrapper
    ref="dropZoneRef"
    :loading="isLoading || store.data.isLoadingNewDay"
    :error="fetchError"
    :data="days"
    :retry-handler="() => store.data.fetchTripDetails(tripId)"
    transition="slide-up"
    class="trip-info-wrapper"
  >
    <template #loading>
      <TripInfoSkeleton />
    </template>

    <template #success>
      <div :key="store.data.currentDayId!" class="trip-info">
        <KitDivider :is-loading="store.data.isLoadingUpdateDay">
          о дне
        </KitDivider>
        <DayHeader />

        <div class="view-content" :class="`view-mode-${activeView}`">
          <Proposal v-if="activeView === 'plan' || activeView === 'split'" />
          <Memories v-if="activeView === 'memories' || activeView === 'split'" />
        </div>

        <DayNavigation v-if="!isLoading && days.length > 1" />
      </div>
    </template>

    <template #empty>
      <TripInfoEmpty />
    </template>
  </AsyncStateWrapper>

  <div v-if="isOverDropZone && activeView === 'memories' && !isViewMode" class="drop-overlay">
    <div class="drop-overlay-content">
      <Icon icon="mdi:upload-multiple" />
      <span>Перетащите файлы сюда для загрузки</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trip-info {
  display: flex;
  flex-direction: column;
  height: 100%;

  .view-content.view-mode-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }

  .view-mode-split .plan-view::after {
    content: '';
    position: absolute;
    top: 0;
    right: -16px;
    bottom: 0;
    width: 1px;
    background-color: var(--border-secondary-color);
  }

  &-wrapper {
    height: 100%;
    position: relative;

    @include media-down(sm) {
      padding: 0 4px;
    }
  }
}

.drop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--fg-accent-color-rgb), 0.1);
  border: 2px dashed var(--fg-accent-color);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  backdrop-filter: blur(4px);

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--fg-accent-color);
    font-size: 1.2rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    .iconify {
      font-size: 3rem;
    }
  }
}
</style>
