<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SyncModal from '~/components/02.shared/sync-modal/ui/sync-modal.vue'
import { useScrollLock } from '~/shared/composables/use-scroll-lock'
import { useThemeStore } from '~/shared/store/theme.store'

const isBurgerOpen = defineModel<boolean>('isBurgerOpen', { required: true })
const isSyncModalOpen = ref<boolean>(false)
const themeStore = useThemeStore()
const { enableScrollLock, disableScrollLock } = useScrollLock(isBurgerOpen)

function closeMenu() {
  isBurgerOpen.value = false
}

function handleOpenSyncModal() {
  isSyncModalOpen.value = !isSyncModalOpen.value
}

watch(() => isBurgerOpen.value, (newValue) => {
  newValue ? enableScrollLock() : disableScrollLock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isBurgerOpen" class="burger-overlay" @click.self="closeMenu">
        <Transition name="slide-in-right" appear>
          <div v-if="isBurgerOpen" class="burger-menu">
            <button class="close-btn" aria-label="Закрыть меню" @click="closeMenu">
              <Icon icon="mdi:close" width="32" height="32" />
            </button>

            <nav class="burger-nav">
              <button class="burger-nav-btn" @click="closeMenu">
                Профиль
              </button>
              <button class="burger-nav-btn" @click="handleOpenSyncModal">
                Синхронизировать
              </button>
              <button class="burger-nav-btn" @click="themeStore.openCreator()">
                Настроить тему
              </button>
            </nav>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
  <SyncModal v-model="isSyncModalOpen" />
</template>

<style lang="scss" scoped>
.burger {
  &-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
    display: flex;
    justify-content: flex-end;
  }

  &-menu {
    background: var(--bg-primary-color);
    width: 80%;
    max-width: 300px;
    height: 100vh;
    padding: 20px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;

    .close-btn {
      float: right;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-nav {
    margin-top: 40px;

    &-btn {
      display: block;
      text-align: left;
      width: 100%;
      padding: 12px 0;
      text-decoration: none;
      font-size: 18px;
      color: var(--fg-primary-color);
      border-bottom: 1px solid var(--bg-primary-color);

      &:last-child {
        border-bottom: none;
      }
      &:hover {
        color: var(--fg-accent-color);
      }
    }
  }
}
// Анимации
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-in-right-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-in-right-leave-active {
  transition: transform 0.3s ease-in;
}
.slide-in-right-enter-from {
  transform: translateX(100%);
}
.slide-in-right-enter-to,
.slide-in-right-leave-from {
  transform: translateX(0);
}
.slide-in-right-leave-to {
  transform: translateX(100%);
}
</style>
