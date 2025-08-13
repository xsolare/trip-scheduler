<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { SyncIndicator } from '~/components/02.shared/sync-indicator'
import { AppRoutePaths } from '~/shared/constants/routes'
import { useThemeStore } from '~/shared/store/theme.store'

const headerEl = ref<HTMLElement>()
const router = useRouter()
const themeStore = useThemeStore()
</script>

<template>
  <header
    ref="headerEl"
    class="header glass"
  >
    <div class="header-content">
      <div class="header-nav" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <Icon class="logo-icon" icon="mdi:map-marker-path" style="font-size: 24px;" />
          <span class="logo-text">Trip Scheduler</span>
        </div>
      </div>

      <div class="header-center" />

      <div class="header-utils">
        <button class="util-btn" title="Настроить тему" @click="themeStore.openCreator()">
          <Icon icon="mdi:palette-outline" />
        </button>

        <SyncIndicator />
        <div class="vr" />

        <div class="profile">
          <div class="profile-img" @click="router.push(AppRoutePaths.Auth.SignIn)">
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 32px;"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
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
  background-color: var(--color-glass3d);
  background-image: var(--noise-glass3d);
  background-size: 100px;
  background-repeat: repeat;
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
  border-bottom: 1px solid var(--border-primary-color);
  height: 44px;
  width: 100%;
  z-index: 7;
  transition:
    background-color 0.3s ease,
    backdrop-filter 0.3s ease;
  background-color: rgb(var(--bg-header-color));

  &.glass {
    background-color: transparent;
  }

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

    .util-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--r-xs);
      border: none;
      background: transparent;
      color: var(--fg-secondary-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.2rem;
      overflow: hidden;

      &:hover {
        background-color: var(--bg-hover-color);
        color: var(--fg-accent-color);
      }
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

      &:hover {
        border-color: var(--border-accent-color);
      }
    }
  }

  .vr {
    margin: 0;
    height: 20px;
    width: 1px;
    background-color: var(--border-primary-color);
  }
}
</style>
