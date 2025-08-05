<script setup lang="ts">
interface Props {
  type?: 'wave'
  width?: string | number
  height?: string | number
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  width: '100%',
  height: '1.2em',
  borderRadius: '4px',
})

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div
    class="p-skeleton"
    :class="{ 'p-skeleton--wave': props.type === 'wave' }"
    :style="style"
  >
    <!-- Невидимый контент для сохранения высоты строки -->
    ‌
  </div>
</template>

<style scoped>
.p-skeleton {
  color: transparent;
  display: block;
  user-select: none;
  background: var(--bg-disabled-color, #e0e0e0);
}

.p-skeleton * {
  visibility: hidden;
}

.p-skeleton--wave {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
}

.p-skeleton--wave::after {
  animation: wave 1.5s linear 0s infinite;
  background: linear-gradient(90deg, transparent, var(--bg-overlay-dark-color, rgba(0, 0, 0, 0.08)), transparent);
  content: '';
  position: absolute;
  transform: translate3d(-100%, 0, 0);
  will-change: transform;
  inset: 0;
}

@keyframes wave {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  60% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
