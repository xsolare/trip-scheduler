import type { Ref } from 'vue'

export function useScrollLock(isOpen: Ref<boolean>) {
  let originalOverflow = ''

  const enableScrollLock = () => {
    originalOverflow = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
  }

  const disableScrollLock = () => {
    document.body.style.overflow = originalOverflow
  }

  const cleanup = () => {
    document.body.style.overflow = originalOverflow
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
