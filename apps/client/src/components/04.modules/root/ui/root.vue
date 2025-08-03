<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import { KitBtn } from '~/components/01.kit/kit-btn'

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
      <div class="logo-accent">
        <Icon icon="mdi:map-marker-path" />
      </div>
      <h1 class="title">
        Trip Scheduler
      </h1>
      <p class="subtitle">
        Ваш умный помощник для создания идеальных маршрутов, организации планов и незабываемых впечатлений.
      </p>
      <KitBtn
        class="cta-button"
        @click="goToTrips"
      >
        <Icon icon="mdi:compass-rose" />
        К моим путешествиям
      </KitBtn>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
  border-radius: 24px;
  background-color: rgba(var(--bg-secondary-color-rgb), 0.5);
  border: 1px solid rgba(var(--border-secondary-color-rgb), 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  max-width: 600px;
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
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(var(--fg-accent-color-rgb), 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--fg-accent-color-rgb), 0.3);
  }

  :deep(.kit-btn__content) {
    font-size: 1.25rem;
    gap: 12px;
  }
}
</style>
