<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { InteractiveGridPattern } from '~/components/02.shared/interactive-grid-pattern'

const router = useRouter()

function goToTrips() {
  router.push(AppRoutePaths.Trip.List)
}

const cardRef = ref<HTMLElement | null>(null)
const transformStyle = ref('')
const { x, y } = useMouse({ touch: false })
const { width, height } = useWindowSize()

const cardTransform = computed(() => {
  if (!cardRef.value)
    return ''
  const maxRotate = 8
  const perspective = 1000
  const rotateX = ((y.value / height.value) * 2 - 1) * maxRotate * -1
  const rotateY = ((x.value / width.value) * 2 - 1) * maxRotate
  return `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
})

function onMouseLeave() {
  transformStyle.value = ''
}
function onMouseMove() {
  transformStyle.value = cardTransform.value
}
</script>

<template>
  <div class="root-page" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div ref="cardRef" class="glass-card" :style="{ transform: transformStyle }">
      <InteractiveGridPattern
        class="card-background-grid"
        :squares="[25, 25]"
        :width="35"
        :height="35"
      />

      <div class="card-content">
        <div class="logo-accent">
          <Icon icon="mdi:map-marker-path" />
        </div>
        <h1 class="title">
          Trip Scheduler
        </h1>
        <p class="subtitle">
          Ваш умный помощник для создания идеальных маршрутов, организации
          планов и незабываемых впечатлений.
        </p>
        <KitBtn class="cta-button" @click="goToTrips">
          <Icon icon="mdi:compass-rose" />
          <span>К моим путешествиям</span>
        </KitBtn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.root-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  padding: 16px;
  animation: fadeIn 0.8s ease-out forwards;
}

.glass-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  max-width: 600px;
}

.card-background-grid {
  position: absolute;
  inset: 0;
  z-index: 1;
  transform: skewY(-12deg);

  mask-image: radial-gradient(circle 250px at center, white, transparent);
  -webkit-mask-image: radial-gradient(circle 250px at center, white, transparent);
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
  user-select: none;
}

.logo-accent {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-accent-color);
  font-size: 4rem;
  margin-bottom: 24px;
  animation: float 4s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(var(--fg-accent-color-rgb), 0.5);
}

.title {
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--fg-primary-color);
  margin: 0 0 16px 0;
  line-height: 48px;
  letter-spacing: -1px;
  background: linear-gradient(90deg, var(--fg-accent-color), #5e72e4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--fg-secondary-color);
  max-width: 450px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(var(--fg-accent-color-rgb), 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: var(--bg-accent-color);
  color: var(--fg-on-accent-color);
  border: none;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--fg-accent-color-rgb), 0.3);
  }

  > svg {
    font-size: 1.25rem;
  }
}
</style>
