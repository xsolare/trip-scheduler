<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useThrottleFn } from '@vueuse/core'
import { KitAvatar } from '~/components/01.kit/kit-avatar'
import { useDisplay } from '~/shared/composables/use-display'
import { AppRoutePaths } from '~/shared/constants/routes'
import Burger from './burger.vue'

const headerEl = ref<HTMLElement>()
const isBurgerOpen = ref<boolean>(false)
const router = useRouter()
const store = useAppStore(['auth', 'theme'])
const { smAndUp } = useDisplay()

const isHeaderHidden = ref(false)
let lastScrollY = 0
let headerHeight = 0

function handleBurger() {
  isBurgerOpen.value = !isBurgerOpen.value
}

const handleScroll = useThrottleFn(() => {
  if (smAndUp.value) {
    isHeaderHidden.value = false
    lastScrollY = window.scrollY
    return
  }

  const currentScrollY = window.scrollY

  if (!headerEl.value?.clientHeight) {
    return
  }

  if (headerHeight === 0) {
    headerHeight = headerEl.value.clientHeight
  }

  if (currentScrollY < lastScrollY || currentScrollY < headerHeight / 2) {
    isHeaderHidden.value = false
  }
  else if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
    isHeaderHidden.value = true
  }

  lastScrollY = currentScrollY
}, 100)

watch(smAndUp, () => {
  isHeaderHidden.value = false
  lastScrollY = window.scrollY
  if (headerEl.value) {
    headerHeight = headerEl.value.clientHeight
  }
}, { immediate: true })

onMounted(() => {
  nextTick(() => {
    if (headerEl.value) {
      headerHeight = headerEl.value.clientHeight
    }
  })
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    ref="headerEl"
    class="header glass"
    :class="{ 'header--hidden': isHeaderHidden && !smAndUp }"
    :style="{ top: isHeaderHidden && !smAndUp ? `-${headerHeight}px` : '0' }"
  >
    <div class="header-content">
      <div class="header-nav" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <Icon class="logo-icon" icon="mdi:map-marker-path" style="font-size: 24px;" />
          <span v-if="smAndUp" class="logo-text">Trip Scheduler</span>
        </div>
      </div>

      <div class="header-center" />

      <div v-if="smAndUp" class="header-utils">
        <button class="util-btn" title="Настроить тему" @click="store.theme.openCreator()">
          <Icon icon="mdi:palette-outline" />
        </button>

        <div class="vr" />

        <div class="profile">
          <KitAvatar
            v-if="store.auth.isAuthenticated"
            :src="`${store.auth.user?.avatarUrl}`"
          />
          <div
            v-else
            class="profile-img"
            @click="router.push(AppRoutePaths.Auth.SignIn)"
          >
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 32px;"
            />
          </div>
        </div>
      </div>
      <div v-else class="header-burger">
        <Icon class="header-burger-icon" icon="mdi:hamburger-menu" width="36" height="36" @click="handleBurger" />
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
  min-height: 56px;
  width: 100%;
  z-index: 7;
  transition:
    top 0.3s ease-out,
    backdrop-filter 0.3s ease;

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
    background-color: var(--bg-secondary-color);
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
