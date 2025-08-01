<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { SyncIndicator } from '~/components/02.shared/sync-indicator'
import { AppRoutePaths } from '~/shared/types/routes'

const headerEl = ref<HTMLElement>()
const router = useRouter()
</script>

<template>
  <header
    ref="headerEl"
    class="header glass"
  >
    <div class="header-content">
      <div class="header-nav" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <Icon class="logo-icon" icon="mdi:map-marker-path" style="font-size: 32px;" />
          Trip Scheduler
        </div>
      </div>

      <div class="header-center" />

      <div class="header-utils">
        <SyncIndicator />
        <div class="vr" />

        <div class="profile">
          <div class="profile-img">
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 64px;"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.glass {
  --filter-glass3d: blur(16px) brightness(1) saturate(2);
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

  box-shadow:
    inset 2px 2px 1px -3px hsl(205 20% 90% / 0.8),
    inset 4px 4px 2px -6px hsl(205 20% 90% / 0.3),
    inset 1.5px 1.5px 1.5px -0.75px hsl(205 20% 90% / 0.15),
    inset 1.5px 1.5px 0.25px hsl(205 20% 90% / 0.03),
    inset 0 0 0.25px 0.5px hsl(205 20% 90% / 0.03);
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
  height: 48px;
  width: 100%;
  z-index: 100;
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
    padding: 0 8px;
  }

  &-nav {
    display: flex;
    align-items: center;

    .logo {
      display: inline-flex;
      align-items: center;
      margin: 0 8px;
      gap: 8px;
      cursor: pointer;
    }
  }

  &-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &-utils {
    display: flex;
    align-items: center;
  }

  .profile {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;

    &-img {
      border-radius: 50%;
      border: 2px solid var(--border-primary-color);
      overflow: hidden;
      cursor: pointer;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border 0.2s ease-in-out;

      &:hover {
        border: 2px solid var(--border-accent-color);
      }
    }
  }

  .vr {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    letter-spacing: normal;
    font-weight: 400;
    color: var(--fg-muted-color);
  }
}
</style>
