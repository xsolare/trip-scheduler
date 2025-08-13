<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { SyncIndicator } from '~/components/02.shared/sync-indicator'
import { useDisplay } from '~/shared/composables/use-display'
import { AppRoutePaths } from '~/shared/constants/routes'
import { useThemeStore } from '~/shared/store/theme.store'
import Burger from './burger.vue'

const headerEl = ref<HTMLElement>()
const isBurgerOpen = ref<boolean>(false)
const router = useRouter()
const themeStore = useThemeStore()
const { smAndUp } = useDisplay()

function handleBurger() {
  isBurgerOpen.value = !isBurgerOpen.value
}
</script>

<template>
  <header
    ref="headerEl"
    class="header glass"
  >
    <div class="header-content">
      <!-- Навигационная часть с логотипом -->
      <div class="header-nav" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <Icon class="logo-icon" icon="mdi:map-marker-path" style="font-size: 24px;" />
          <span v-if="smAndUp" class="logo-text">Trip Scheduler</span>
        </div>
      </div>

      <!-- Центральный заполнитель -->
      <div class="header-center" />

      <!-- Утилиты: синхронизация и профиль -->
      <div v-if="smAndUp" class="header-utils">
        <button class="util-btn" title="Настроить тему" @click="themeStore.openCreator()">
          <Icon icon="mdi:palette-outline" />
        </button>

        <SyncIndicator />
        <div class="vr" />

        <div class="profile">
          <div class="profile-img">
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 32px;"
            />
          </div>
        </div>
      </div>
      <div v-else class="header-burger">
        <Icon class="header-burger-icon" icon="twemoji:hamburger" width="36" height="36" @click="handleBurger" />
      </div>
    </div>
  </header>
  <Burger v-model:is-burger-open="isBurgerOpen" />
</template>

<style lang="scss" scoped>
.glass {
  --filter-glass3d: blur(12px) brightness(1) saturate(1.5);
  --color-glass3d: hsla(180, 6%, 87%, 0.3);
  --noise-glass3d: url('../../../../assets/images/egg-shell.png');

  position: relative;
  z-index: 4;
}

.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 3;
  -webkit-backdrop-filter: var(--filter-glass3d);
  backdrop-filter: var(--filter-glass3d);
}

.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 5;
}

.glass > * {
  position: relative;
  z-index: 6;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  height: 100%;
  width: 100%;
  z-index: 7;
  transition: backdrop-filter 0.3s ease;

  &-content {
    max-width: 1200px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    font-family: 'Rubik';
    padding: 0 12px;
  }

  &-nav {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &-text {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1;
      }
    }
  }

  &-center {
    flex: 1;
  }

  &-utils {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px;
    background-color: white;
    border-radius: 20px;
    transition: border-radius 0.5s ease;

    &:hover {
      border-radius: 10px;
    }

    .util-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--r-xs);
      border: none;
      color: var(--fg-secondary-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.2rem;
      overflow: hidden;

      &:hover {
        color: var(--fg-accent-color);
      }
    }
  }

  &-burger {
    &-icon {
      cursor: pointer;
    }
  }

  .profile {
    display: flex;
    align-items: center;
    justify-content: center;

    &-img {
      border-radius: var(--r-full);
      border: 1px solid var(--border-primary-color);
      overflow: hidden;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s ease-in-out;
    }
  }

  .vr {
    margin: 0;
    height: 20px;
    width: 1px;
  }
}
</style>
