<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { SyncIndicator } from '~/components/02.shared/sync-indicator'

const sentinelEl = ref<HTMLElement>()
const headerEl = ref<HTMLElement>()
const isSticky = ref<boolean>(false)

onMounted(() => {
  if (sentinelEl.value) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isSticky.value = entry.isIntersecting
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    )

    observer.observe(sentinelEl.value)

    onBeforeUnmount(() => {
      observer.disconnect()
    })
  }
})
</script>

<template>
  <div ref="sentinelEl" class="sentinel" />
  <header
    ref="headerEl"
    class="header"
    :class="{ blurred: !isSticky }"
  >
    <div class="header-content">
      <div class="header-nav">
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
.sentinel {
  position: absolute;
  top: 0;
  height: 0;
  width: 100%;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  flex-direction: row;
  border-bottom: 1px solid var(--border-primary-color);
  height: 56px;
  background-color: rgb(var(--bg-header-color));
  width: 100%;
  overflow: hidden;
  z-index: 100;
  transition:
    background-color 0.3s ease,
    backdrop-filter 0.3s ease;

  &.blurred {
    background-color: rgba(var(--bg-header-color), 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
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
    z-index: 6;
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
