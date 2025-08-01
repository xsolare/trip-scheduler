<script setup lang="ts">
import type { ITrip } from '../../models/types'
import { Icon } from '@iconify/vue'

type Props = ITrip

const props = withDefaults(defineProps<Props>(), {
  participants: () => [],
  tags: () => [],
  visibility: 'private',
})

const router = useRouter()

function goTo() {
  router.push(AppRoutePaths.Trip.Info(`${props.id}`))
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const avatarColorNames = ['blue', 'orange', 'green', 'red', 'purple', 'cyan']

function getAvatarClass(name: string): string {
  const index = name.length % avatarColorNames.length
  return `avatar--${avatarColorNames[index]}`
}
// --- КОНЕЦ ИЗМЕНЕНИЯ 1 ---

// Форматирование дат
const formattedDates = computed(() => {
  const start = new Date(props.startDate)
  const end = new Date(props.endDate)

  const formatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
  })

  if (start.getFullYear() === end.getFullYear()) {
    return `${formatter.format(start)} - ${formatter.format(end)} ${start.getFullYear()}`
  }
  else {
    return `${formatter.format(start)} ${start.getFullYear()} - ${formatter.format(end)} ${end.getFullYear()}`
  }
})

// Информация о статусе
const statusInfo = computed(() => {
  switch (props.status) {
    case 'completed':
      return { text: 'Завершено', class: 'completed', icon: 'mdi:check-circle-outline' }
    case 'in-progress':
      return { text: 'В процессе', class: 'in-progress', icon: 'mdi:airplane-takeoff' }
    case 'planned':
      return { text: 'Запланировано', class: 'planned', icon: 'mdi:calendar-check-outline' }
    default:
      return { text: 'Черновик', class: 'draft', icon: 'mdi:pencil-circle-outline' }
  }
})

// Форматирование бюджета
const formattedBudget = computed(() => {
  if (!props.budget || !props.currency)
    return null
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
  }).format(props.budget)
})

// Иконка для приватности
const visibilityIcon = computed(() => {
  switch (props.visibility) {
    case 'public':
      return { icon: 'mdi:earth', title: 'Публичное путешествие' }
    case 'shared':
      return { icon: 'mdi:account-multiple-outline', title: 'Доступно по ссылке' }
    default:
      return { icon: 'mdi:lock-outline', title: 'Приватное путешествие' }
  }
})
</script>

<template>
  <div class="travel-card-wrapper">
    <div class="travel-card" @click="goTo">
      <div class="card-image-container">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          class="card-image"
        >
        <div v-else class="card-no-image">
          <Icon icon="mdi:map-legend" />
        </div>
        <div class="image-overlay" />
        <div class="card-header">
          <span class="card-status" :class="[statusInfo.class]">
            <Icon :icon="statusInfo.icon" />
            {{ statusInfo.text }}
          </span>
        </div>

        <h3 class="card-title">
          {{ title }}
        </h3>

        <span class="card-visibility" :title="visibilityIcon.title">
          <Icon :icon="visibilityIcon.icon" />
        </span>

        <div class="card-actions">
          <button class="action-btn" title="Редактировать" @click.stop>
            <Icon icon="mdi:pencil-outline" />
          </button>
          <button class="action-btn" title="Поделиться" @click.stop>
            <Icon icon="mdi:share-variant-outline" />
          </button>
          <button class="action-btn" title="Еще" @click.stop>
            <Icon icon="mdi:dots-vertical" />
          </button>
        </div>
      </div>

      <div class="card-content">
        <div class="card-meta">
          <div class="meta-item">
            <Icon icon="mdi:calendar-month-outline" />
            <span>{{ formattedDates }}</span>
          </div>
          <div class="meta-item">
            <Icon icon="mdi:map-marker-outline" />
            <span>{{ cities.join(', ') }}</span>
          </div>
          <div v-if="formattedBudget" class="meta-item">
            <Icon icon="mdi:wallet-outline" />
            <span>{{ formattedBudget }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="participants.length" class="card-participants">
            <div
              v-for="participant in participants.slice(0, 3)"
              :key="participant"
              class="avatar"
              :class="getAvatarClass(participant)"
            >
              <span>{{ getInitials(participant) }}</span>
            </div>
            <div v-if="participants.length > 3" class="avatar avatar--more">
              <span>+{{ participants.length - 3 }}</span>
            </div>
          </div>
          <div v-if="tags?.length" class="card-tags">
            <span v-for="tag in tags.slice(0, 2)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color'; // Импортируем модуль color для использования color.mix

$avatar-base-colors: (
  'blue': #096dd9,
  'orange': #d48806,
  'green': #389e0d,
  'red': #d9363e,
  'purple': #722ed1,
  'cyan': #08979c,
);

// Миксин для генерации стилей аватара
@mixin generate-avatar-colors($base-color) {
  color: $base-color;
  // Используем современный синтаксис color.mix для устранения предупреждения
  background-color: color.mix(white, $base-color, 90%);
}

.travel-card-wrapper {
  padding: 8px;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--bg-secondary-color);
  }
}

.travel-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--bg-secondary-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid transparent;

  .travel-card-wrapper:hover & {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    border-color: var(--border-secondary-color);
  }
}

.card-image-container {
  position: relative;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 16px;
  box-sizing: border-box;

  .card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .travel-card-wrapper:hover .card-image {
    transform: scale(1.05);
  }

  .card-no-image {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    font-size: 56px;
    opacity: 0.5;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 1;
  }
}

.card-header {
  position: relative;
  display: flex;
  z-index: 2;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);

  &.completed {
    background-color: rgba(27, 131, 89, 0.7);
  }
  &.in-progress {
    background-color: rgba(5, 122, 255, 0.7);
  }
  &.planned {
    background-color: rgba(224, 117, 0, 0.7);
  }
  &.draft {
    background-color: rgba(108, 117, 125, 0.7);
  }
}

.card-visibility {
  position: absolute;
  bottom: 12px;
  right: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.card-title {
  position: relative;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 40px 0 0;
  z-index: 2;
  line-height: 1.2;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  z-index: 3;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  .travel-card-wrapper:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.85);
    color: var(--fg-primary-color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      background-color: #fff;
      transform: scale(1.1);
      color: var(--fg-accent-color);
    }
  }
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--fg-secondary-color);
    font-size: 0.9rem;

    .iconify {
      font-size: 1.25rem;
      color: var(--fg-tertiary-color);
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary-color);
}

.card-participants {
  display: flex;
  align-items: center;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    border: 2px solid var(--bg-secondary-color);
    margin-left: -8px;

    // Генерируем классы-модификаторы для каждого цвета
    @each $name, $color in $avatar-base-colors {
      &--#{$name} {
        @include generate-avatar-colors($color);
      }
    }

    &:first-child {
      margin-left: 0;
    }

    &--more {
      color: var(--fg-secondary-color);
      background-color: var(--bg-tertiary-color);
    }
  }
}

.card-tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;

  .tag {
    background-color: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
