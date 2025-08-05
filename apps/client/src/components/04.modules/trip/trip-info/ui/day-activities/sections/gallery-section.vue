<script setup lang="ts">
import type { ImageViewerImage } from '~/components/01.kit/image-viewer'
import type { ActivitySectionGallery } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { ImageViewer, useImageViewer } from '~/components/01.kit/image-viewer'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useTripStore } from '~/components/04.modules/trip/trip-info/store/trip-store'

interface Props {
  section: ActivitySectionGallery
}

const props = defineProps<Props>()
const emit = defineEmits(['updateSection'])

const tripStore = useTripStore()
const { isViewMode, tripImages, isUploadingImage, isFetchingImages } = storeToRefs(tripStore)
const { uploadImage, fetchTripImages } = tripStore

const fileInput = ref<HTMLInputElement | null>(null)
const isImagePickerOpen = ref(false)
const selectedImagesFromTrip = ref<string[]>([])

const images = computed(() => props.section.imageUrls || [])

const imageViewer = useImageViewer({
  enableKeyboard: true,
  enableThumbnails: true,
  showCounter: true,
  closeOnOverlayClick: true,
})

const viewerImages = computed<ImageViewerImage[]>(() =>
  images.value.map((url, index) => ({
    url,
    alt: `Изображение ${index + 1}`,
  })),
)

function deleteImage(index: number) {
  const updatedUrls = images.value.filter((_, i) => i !== index)
  emit('updateSection', { ...props.section, imageUrls: updatedUrls })
}

function triggerFileUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file)
    return

  // TODO
  const newImageRecord = await uploadImage(file) as any

  if (newImageRecord) {
    const updatedUrls = [...images.value, newImageRecord.url]
    emit('updateSection', { ...props.section, imageUrls: updatedUrls })
  }

  target.value = ''
}

async function openTripImagePicker() {
  isImagePickerOpen.value = true
  if (tripStore.imageFetchStatus === 'idle' || tripStore.imageFetchStatus === 'error')
    await fetchTripImages()
}

function closeImagePicker() {
  isImagePickerOpen.value = false
  selectedImagesFromTrip.value = []
}

function toggleImageSelection(url: string) {
  if (images.value.includes(url))
    return

  const index = selectedImagesFromTrip.value.indexOf(url)
  if (index > -1)
    selectedImagesFromTrip.value.splice(index, 1)
  else
    selectedImagesFromTrip.value.push(url)
}

function confirmImageSelection() {
  const newImages = selectedImagesFromTrip.value.filter(url => !images.value.includes(url))
  if (newImages.length > 0) {
    const updatedUrls = [...images.value, ...newImages]
    emit('updateSection', { ...props.section, imageUrls: updatedUrls })
  }
  closeImagePicker()
}

function openViewer(index: number) {
  imageViewer.open(viewerImages.value, index)
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/images/smth-wrong.png'
    target.onerror = null
    target.classList.add('image-error')
  }
}

const galleryClass = computed(() => {
  const count = images.value.length
  if (count <= 3)
    return 'gallery-small'
  if (count <= 6)
    return 'gallery-medium'
  return 'gallery-large'
})
const maxVisibleImages = computed(() => {
  const count = images.value.length
  return count <= 4 ? count : 4
})
const remainingImagesCount = computed(() =>
  Math.max(0, images.value.length - maxVisibleImages.value),
)
const visibleImages = computed(() =>
  images.value.slice(0, maxVisibleImages.value),
)
</script>

<template>
  <div class="gallery-section">
    <!-- Панель управления (режим редактирования) -->
    <div v-if="!isViewMode" class="edit-controls">
      <KitBtn
        appearance="outline"
        :loading="isUploadingImage"
        @click="triggerFileUpload"
      >
        <Icon icon="mdi:upload" />
        {{ isUploadingImage ? 'Загрузка...' : 'Загрузить новое' }}
      </KitBtn>
      <KitBtn @click="openTripImagePicker">
        <Icon icon="mdi:image-multiple-outline" />
        Выбрать из галереи
      </KitBtn>
    </div>

    <!-- Скрытый инпут для загрузки файлов -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden-file-input"
      @change="handleFileUpload"
    >

    <!-- Галерея -->
    <div v-if="images.length > 0" class="gallery-container" :class="galleryClass">
      <div
        v-for="(image, index) in visibleImages"
        :key="`${image}-${index}`"
        class="image-wrapper"
        @click="openViewer(index)"
      >
        <img
          class="image-item"
          :src="image"
          :alt="`Image ${index + 1}`"
          loading="lazy"
          @error="handleImageError"
        >
        <div class="image-overlay">
          <button
            v-if="!isViewMode"
            class="delete-btn"
            title="Удалить изображение"
            @click.stop="deleteImage(index)"
          >
            <Icon icon="mdi:trash-can-outline" />
          </button>
        </div>
      </div>
      <div
        v-if="remainingImagesCount > 0"
        class="more-images-wrapper"
        @click="openViewer(maxVisibleImages)"
      >
        <img
          class="image-item"
          :src="images[maxVisibleImages]"
          alt="More images"
          loading="lazy"
          @error="handleImageError"
        >
        <div class="more-images-overlay">
          <Icon icon="mdi:plus" class="more-icon" />
          <span class="more-text">+{{ remainingImagesCount }}</span>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else class="empty-state">
      <Icon icon="mdi:image-multiple-outline" class="empty-icon" />
      <p>В этой галерее пока нет изображений.</p>
      <span v-if="!isViewMode" class="empty-hint">
        Загрузите новые или выберите из общей галереи путешествия.
      </span>
      <span v-else class="empty-hint">
        Владелец может добавить их в режиме редактирования.
      </span>
    </div>

    <!-- Image Viewer -->
    <ImageViewer
      v-model:visible="imageViewer.isOpen.value"
      v-model:current-index="imageViewer.currentIndex.value"
      :images="viewerImages"
      :show-counter="true"
      :enable-thumbnails="images.length > 1"
      :close-on-overlay-click="true"
    />

    <!-- Модальное окно для выбора изображений из путешествия -->
    <Teleport to="body">
      <div v-if="isImagePickerOpen" class="image-picker-modal">
        <div class="modal-overlay" @click="closeImagePicker" />
        <div class="modal-content">
          <div class="modal-header">
            <h3>Галерея путешествия</h3>
            <button class="close-btn" title="Закрыть" @click="closeImagePicker">
              <Icon icon="mdi:close" />
            </button>
          </div>
          <div class="modal-body">
            <div v-if="isFetchingImages" class="loading-state">
              <Icon icon="mdi:loading" class="spinner" />
              <p>Загружаем изображения...</p>
            </div>
            <div v-else-if="tripImages.length > 0" class="image-grid">
              <div
                v-for="tripImg in tripImages"
                :key="tripImg.id"
                class="grid-item"
                :class="{
                  selected: selectedImagesFromTrip.includes(tripImg.url),
                  disabled: images.includes(tripImg.url),
                }"
                @click="toggleImageSelection(tripImg.url)"
              >
                <img :src="tripImg.url" loading="lazy">
                <div class="overlay">
                  <Icon v-if="images.includes(tripImg.url)" icon="mdi:check-circle" class="check-icon added" title="Уже в галерее" />
                  <Icon v-else-if="selectedImagesFromTrip.includes(tripImg.url)" icon="mdi:check-circle" class="check-icon selected" />
                  <Icon v-else icon="mdi:circle-outline" class="check-icon" />
                </div>
              </div>
            </div>
            <div v-else class="empty-trip-gallery">
              <Icon icon="mdi:image-off-outline" />
              <p>В галерее путешествия еще нет загруженных изображений.</p>
            </div>
          </div>
          <div v-if="!isFetchingImages && tripImages.length > 0" class="modal-footer">
            <KitBtn appearance="secondary" @click="closeImagePicker">
              Отмена
            </KitBtn>
            <KitBtn
              :disabled="selectedImagesFromTrip.length === 0"
              @click="confirmImageSelection"
            >
              Добавить выбранные ({{ selectedImagesFromTrip.length }})
            </KitBtn>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.edit-controls {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-secondary-color);
  margin-bottom: 8px;
}

.hidden-file-input {
  display: none;
}

.image-picker-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
  }

  .modal-content {
    position: relative;
    z-index: 1001;
    background-color: var(--bg-secondary-color);
    border-radius: 12px;
    width: 90vw;
    max-width: 900px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-primary-color);
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--fg-secondary-color);
      font-size: 1.5rem;
      &:hover {
        color: var(--fg-primary-color);
      }
    }
  }

  .modal-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 24px;

    .loading-state,
    .empty-trip-gallery {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--fg-secondary-color);
      text-align: center;
      .spinner {
        font-size: 3rem;
        animation: spin 1.5s linear infinite;
      }
      p {
        margin-top: 16px;
        font-size: 1.1rem;
      }
      & > .iconify {
        font-size: 4rem;
        opacity: 0.5;
        margin-bottom: 1rem;
      }
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .grid-item {
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    aspect-ratio: 1 / 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s ease;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .check-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 1.8rem;
      color: white;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      &.selected {
        color: var(--fg-accent-color);
      }
    }

    &.selected {
      border-color: var(--fg-accent-color);
      transform: scale(1.03);
      .overlay {
        opacity: 1;
      }
    }

    &:hover:not(.disabled) {
      transform: scale(1.03);
      img {
        transform: scale(1.05);
      }
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.6;
      img {
        filter: grayscale(80%);
      }
      .overlay {
        background: rgba(0, 0, 0, 0.3);
      }
      .check-icon.added {
        color: #4ade80;
      }
    }
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border-primary-color);
    background-color: var(--bg-tertiary-color);
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--border-primary-color);
  }
}

.gallery-container {
  display: grid;
  gap: 8px;
  height: 250px;
  align-self: center;
  width: 100%;

  &.gallery-small {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  &.gallery-medium {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  &.gallery-large {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 768px) {
    &.gallery-large {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 480px) {
    height: 200px;

    &.gallery-medium,
    &.gallery-large {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.image-wrapper,
.more-images-wrapper {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-primary-color);
  max-width: 400px;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--fg-accent-color);

    .image-overlay {
      opacity: 1;
    }
  }

  .image-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 8px;
  }

  .delete-btn {
    background: rgba(220, 38, 38, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.2s;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(220, 38, 38, 1);
      transform: scale(1.1);
    }
  }
}

.more-images-wrapper {
  position: relative;

  .more-images-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    backdrop-filter: blur(2px);
    transition: all 0.3s ease;

    .more-icon {
      font-size: 2rem;
      margin-bottom: 4px;
    }

    .more-text {
      font-size: 1.1rem;
    }
  }

  &:hover .more-images-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 32px 24px;
  color: var(--fg-secondary-color);
  min-height: 180px;
  border: 2px dashed var(--border-secondary-color);
  border-radius: 12px;
  background: var(--bg-tertiary-color);

  .empty-icon {
    font-size: 3.5rem;
    opacity: 0.4;
    margin-bottom: 16px;
    color: var(--fg-secondary-color);
  }

  p {
    font-weight: 500;
    color: var(--fg-primary-color);
    margin-bottom: 8px;
  }

  .empty-hint {
    font-size: 0.85rem;
    opacity: 0.7;
  }
}

.image-item {
  opacity: 0;
  animation: fadeInImage 0.3s ease-out forwards;
}

.image-item.image-error {
  object-fit: contain;
  padding: 8px;
}

@keyframes fadeInImage {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
