import type { Ref } from 'vue'

export function useScrollLock(isOpen: Ref<boolean>) {
  const enableScrollLock = () => {
    document.body.style.overflow = 'hidden'
  }

  const disableScrollLock = () => {
    document.body.style.overflow = ''
  }

  const cleanup = () => {
    document.body.style.overflow = ''
  }

  watch(isOpen, (value) => {
    if (value) {
      enableScrollLock()
    }
    else {
      disableScrollLock()
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    enableScrollLock,
    disableScrollLock,
    cleanup,
  }
}
