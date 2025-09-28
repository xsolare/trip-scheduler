<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { KitAnimatedTooltip } from '~/components/01.kit/kit-animated-tooltip'
import { KitAvatar } from '~/components/01.kit/kit-avatar'
import { KitImage } from '~/components/01.kit/kit-image'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-trip-info-module'
import { TripStatus } from '~/shared/types/models/trip'
import CountdownWidget from './content/countdown-widget.vue'
import StatsWidget from './content/stats-widget.vue'
import WeatherWidget from './content/weather-widget.vue'

const { plan, sections } = useModuleStore(['plan', 'sections'])
const router = useRouter()

const trip = computed(() => plan.trip)

const isTripUpcoming = computed(() => {
  if (!trip.value)
    return false

  return trip.value.status === TripStatus.PLANNED && new Date(trip.value.startDate) > new Date()
})

const formattedDates = computed(() => {
  if (!trip.value)
    return ''
  const start = new Date(trip.value.startDate)
  const end = new Date(trip.value.endDate)

  const formatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
  })

  if (start.getFullYear() === end.getFullYear())
    return `${formatter.format(start)} - ${formatter.format(end)} ${start.getFullYear()}`
  else
    return `${formatter.format(start)} ${start.getFullYear()} - ${formatter.format(end)} ${end.getFullYear()}`
})

const tripDurationDays = computed(() => {
  if (!trip.value)
    return 0
  const start = new Date(trip.value.startDate)
  const end = new Date(trip.value.endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
})

const visibleParticipants = computed(() => trip.value?.participants.slice(0, 5) || [])
const hiddenParticipantsCount = computed(() => Math.max(0, (trip.value?.participants.length || 0) - 5))

function navigateToDay(dayId: string) {
  router.push({ query: { day: dayId } })
}

function navigateToSection(sectionId: string) {
  router.push({ query: { section: sectionId } })
}
</script>

<template>
  <div v-if="trip" class="trip-overview">
    <!-- Блок-обложка в стиле travel-card -->
    <div class="overview-banner">
      <KitImage
        v-if="trip.imageUrl"
        :src="trip.imageUrl"
        :alt="trip.title"
        class="banner-image"
      />
      <div v-else class="cover-placeholder">
        <Icon icon="mdi:map-legend" />
      </div>
      <div class="banner-overlay" />
      <div class="banner-content">
        <h1 class="trip-title">
          {{ trip.title }}
        </h1>
        <div class="trip-meta">
          <div class="meta-item">
            <Icon icon="mdi:calendar-month-outline" />
            <span>{{ formattedDates }}</span>
          </div>
          <div v-if="trip.cities.length" class="meta-item">
            <Icon icon="mdi:map-marker-outline" />
            <span>{{ trip.cities.join(', ') }}</span>
          </div>
        </div>

        <div class="trip-participants">
          <KitAnimatedTooltip
            v-for="participant in visibleParticipants"
            :key="participant.id"
            :name="participant.name"
            :offset="10"
          >
            <KitAvatar
              :name="participant.name"
              :src="participant.avatarUrl"
              :size="36"
            />
          </KitAnimatedTooltip>
          <KitAvatar
            v-if="hiddenParticipantsCount > 0"
            is-more
            :size="36"
          >
            +{{ hiddenParticipantsCount }}
          </KitAvatar>
        </div>
      </div>
    </div>

    <!-- Описание путешествия -->
    <div v-if="trip.description" class="trip-description-summary">
      <p>{{ trip.description }}</p>
    </div>

    <!-- Виджеты -->
    <div class="info-widgets">
      <StatsWidget
        :duration-days="tripDurationDays"
        :city-count="trip.cities.length"
      />
      <WeatherWidget
        :city="trip.cities[0] || '...'"
      />
    </div>

    <!-- Сетки с днями и разделами -->
    <div class="overview-grid">
      <div class="overview-section">
        <h2 class="section-title">
          <Icon icon="mdi:calendar-month-outline" />
          <span>Дни путешествия</span>
        </h2>
        <ul v-if="plan.days.length" class="items-list">
          <li
            v-for="(day, index) in plan.days"
            :key="day.id"
            class="list-item day-item"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="navigateToDay(day.id)"
          >
            <div class="item-main-info">
              <span class="day-number">{{ index + 1 }}</span>
              <span class="item-title">{{ day.title || `День ${index + 1}` }}</span>
            </div>
            <span class="item-meta">{{ new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}</span>
            <Icon icon="mdi:chevron-right" class="chevron-icon" />
          </li>
        </ul>
        <div v-else class="empty-list-placeholder">
          <p>Дни еще не добавлены в это путешествие.</p>
        </div>
      </div>

      <div class="overview-section">
        <h2 class="section-title">
          <Icon icon="mdi:file-document-multiple-outline" />
          <span>Разделы</span>
        </h2>
        <ul v-if="sections.sortedSections.length" class="items-list">
          <li
            v-for="(section, index) in sections.sortedSections"
            :key="section.id"
            class="list-item section-item"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="navigateToSection(section.id)"
          >
            <div class="item-main-info">
              <Icon :icon="section.icon || 'mdi:file-outline'" class="section-icon" />
              <span class="item-title">{{ section.title }}</span>
            </div>
            <Icon icon="mdi:chevron-right" class="chevron-icon" />
          </li>
        </ul>
        <div v-else class="empty-list-placeholder">
          <p>Дополнительные разделы еще не созданы.</p>
        </div>
      </div>
    </div>

    <CountdownWidget
      v-if="isTripUpcoming"
      :target-date="trip.startDate"
      class="countdown"
    />
  </div>
</template>

<style lang="scss">
.info-widget-card {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  padding: 1rem;
}
</style>

<style scoped lang="scss">
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trip-overview {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.overview-banner,
.trip-description-summary,
.info-widgets,
.overview-grid,
.countdown {
  animation: fadeInUp 0.5s 0.1s ease-out forwards;
  opacity: 0;
}

.trip-description-summary {
  animation-delay: 0.2s;
}
.info-widgets {
  animation-delay: 0.3s;
}
.overview-grid {
  animation-delay: 0.4s;
}
.countdown {
  animation-delay: 0.5s;
}

.overview-banner {
  position: relative;
  height: 300px;
  border-radius: var(--r-l);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  box-sizing: border-box;

  .banner-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .banner-image :deep(.image) {
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover .banner-image :deep(.image) {
    transform: scale(1.05);
  }

  .cover-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    font-size: 64px;
    opacity: 0.5;
  }

  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 60%);
    z-index: 1;
  }

  .banner-content {
    position: relative;
    z-index: 2;
    color: white;

    & > * {
      animation: fadeInUp 0.6s 0.2s ease-out forwards;
      opacity: 0;
    }
  }

  .trip-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .trip-meta {
    animation-delay: 0.3s;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      backdrop-filter: blur(2px);
    }
  }

  .trip-participants {
    animation-delay: 0.4s;
    display: flex;

    :deep(.kit-avatar) {
      margin-left: -12px;
      transition: transform 0.2s ease;

      &:first-child {
        margin-left: 0;
      }

      &:hover {
        transform: translateY(-4px);
        z-index: 10;
      }
    }
  }
}

.trip-description-summary {
  padding: 1rem;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-m);
  color: var(--fg-secondary-color);
  font-size: 0.95rem;
  line-height: 1.6;
}

.info-widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: start;
}

.overview-section {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  padding: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-secondary-color);
  color: var(--fg-primary-color);

  .iconify {
    color: var(--fg-accent-color);
  }
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--r-m);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;

  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;

  &:hover {
    background-color: var(--bg-hover-color);
    border-color: var(--border-primary-color);
    transform: translateX(4px);
  }
}

.item-main-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  min-width: 0;
}

.item-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.day-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-s);
  background-color: var(--bg-tertiary-color);
  color: var(--fg-secondary-color);
  font-weight: 600;
  flex-shrink: 0;
}

.item-meta {
  font-size: 0.85rem;
  color: var(--fg-secondary-color);
  white-space: nowrap;
}

.section-icon {
  font-size: 1.25rem;
  color: var(--fg-secondary-color);
}

.chevron-icon {
  color: var(--fg-tertiary-color);
  flex-shrink: 0;
}

.empty-list-placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--fg-secondary-color);
  font-size: 0.9rem;
}

.countdown {
  margin: 0 auto;
}
</style>
