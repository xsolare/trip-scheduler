<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMouse } from '@vueuse/core'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { InteractiveGridPattern } from '~/components/02.shared/interactive-grid-pattern'

const router = useRouter()

const cardRef = ref<HTMLElement | null>(null)
const transformStyle = ref('')
const isHovering = ref(false)

const { x, y } = useMouse({ touch: false })

function goToTrips() {
  router.push('/trips')
}

function onMouseMove() {
  if (!cardRef.value)
    return

  const rect = cardRef.value.getBoundingClientRect()
  const mouseX = x.value - rect.left
  const mouseY = y.value - rect.top
  const xPercent = mouseX / rect.width
  const yPercent = mouseY / rect.height
  const rotateXFactor = (yPercent - 0.5) * 2
  const rotateYFactor = (xPercent - 0.5) * 2

  const maxRotate = 8
  const perspective = 1000
  const rotateX = rotateXFactor * maxRotate * -1
  const rotateY = rotateYFactor * maxRotate

  transformStyle.value = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
}

function onMouseEnter() {
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
  transformStyle.value = ''
}
</script>

<template>
  <div class="root-page">
    <div
      ref="cardRef"
      class="glass-card"
      :class="{ 'is-transitioning': !isHovering }"
      :style="{ transform: transformStyle }"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
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
        <KitBtn class="btn" @click="goToTrips">
          <Icon icon="mdi:compass-rose" />
          <span>К моим путешествиям</span>
        </KitBtn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.root-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 16px;
  animation: fadeIn 0.8s ease-out forwards;
}

.glass-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-xl);
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--s-xl);
  max-width: 600px;
  will-change: transform;
}

// Класс, который отвечает за плавное возвращение в исходное состояние
.glass-card.is-transitioning {
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
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

  .btn {
    border-radius: var(--r-xl);
  }
}

.logo-accent {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-accent-color);
  font-size: 4rem;
  margin-bottom: 24px;
  animation: float 4s ease-in-out infinite;
  text-shadow: 0 0 20px var(--fg-accent-color);
}

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
</style>
