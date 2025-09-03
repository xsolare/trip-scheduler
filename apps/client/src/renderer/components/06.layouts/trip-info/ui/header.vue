<script lang="ts" setup>
import type { ComputedRef, Ref } from 'vue'
import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'
import { KitAvatar } from '~/components/01.kit/kit-avatar'
import { ProfileDrawer } from '~/components/02.shared/profile-drawer'
import { AppRoutePaths } from '~/shared/constants/routes'

interface ViewSwitcherItem<T> {
  id: T
  label: string
  icon?: string
}

interface NavigationState {
  isNavigationVisible: boolean
  activeTab: ViewSwitcherItem<string> | undefined
  tabItems: ViewSwitcherItem<string>[]
  isMobile: boolean
  navigate: (direction: 'prev' | 'next') => void
  handleCurrentSectionClick: () => void
  selectSection: (id: string) => void
  isAddSectionDialogOpen: Ref<boolean>
}

const headerEl = ref<HTMLElement>()
const headerCenterRef = ref<HTMLElement>()
const router = useRouter()
const store = useAppStore(['auth', 'theme'])

const isProfileDrawerOpen = ref(false)
const isScrolled = ref(false)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
const isSmallScreen = ref(false)
const isHeaderDropdownOpen = ref(false)

const navigationState = inject<ComputedRef<NavigationState>>('navigationState')

function checkScreenSize() {
  isSmallScreen.value = window.innerWidth < 1400
}

const shouldShowCurrentSection = computed(() => {
  return navigationState?.value
    && !navigationState.value.isNavigationVisible
    && router.currentRoute.value.name === 'trip-info'
})

function handleHeaderCurrentSectionClick() {
  if (!navigationState?.value)
    return

  if (navigationState.value.isMobile) {
    navigationState.value.handleCurrentSectionClick()
  }
  else {
    isHeaderDropdownOpen.value = !isHeaderDropdownOpen.value
  }
}

function handleHeaderSelectSection(id: string) {
  if (!navigationState?.value)
    return
  navigationState.value.selectSection(id)
  isHeaderDropdownOpen.value = false
}

function handleHeaderAddSection() {
  if (!navigationState?.value)
    return
  navigationState.value.isAddSectionDialogOpen.value = true
  isHeaderDropdownOpen.value = false
}

onClickOutside(headerCenterRef, () => {
  isHeaderDropdownOpen.value = false
})

onMounted(() => {
  let ticking = false

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY

        if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
          isHeaderVisible.value = false
          isHeaderDropdownOpen.value = false
        }
        else {
          isHeaderVisible.value = true
        }

        isScrolled.value = currentScrollY > 10

        lastScrollY.value = currentScrollY
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })
})
</script>

<template>
  <header
    ref="headerEl"
    class="header"
    :class="{
      'header--scrolled': isScrolled,
      'header--hidden': !isHeaderVisible,
      'header--small-screen': isSmallScreen,
    }"
  >
    <div class="header-content">
      <div class="header-left" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <Icon width="20" height="20" class="logo-icon" icon="mdi:map-marker-path" />
          <span class="logo-text">Trip Scheduler</span>
        </div>
      </div>

      <div ref="headerCenterRef" class="header-center">
        <div v-if="shouldShowCurrentSection" class="header-navigation-wrapper">
          <div class="header-current-section" @click="handleHeaderCurrentSectionClick">
            <h2 class="header-current-section-title">
              {{ navigationState?.activeTab?.label }}
            </h2>
          </div>

          <Transition name="fade-dropdown">
            <div v-if="!navigationState?.isMobile && isHeaderDropdownOpen" class="header-sections-dropdown-panel">
              <ul class="header-sections-list">
                <li
                  v-for="item in navigationState?.tabItems"
                  :key="item.id"
                  @click="handleHeaderSelectSection(item.id)"
                >
                  <Icon :icon="item.icon!" class="header-section-item-icon" />
                  <span>{{ item.label }}</span>
                </li>
                <li class="header-add-section-item" @click="handleHeaderAddSection">
                  <Icon icon="mdi:plus-circle-outline" class="header-section-item-icon" />
                  <span>Добавить раздел</span>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>

      <div class="header-right">
        <button class="util-btn" title="Настроить тему" @click="store.theme.openCreator()">
          <Icon icon="mdi:palette-outline" />
        </button>

        <div class="vr" />

        <div class="profile" @click="isProfileDrawerOpen = true">
          <KitAvatar
            v-if="store.auth.isAuthenticated"
            :src="`${store.auth.user?.avatarUrl}`"
          />
          <div
            v-else
            class="profile-img"
            @click.stop="router.push(AppRoutePaths.Auth.SignIn)"
          >
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 32px;"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="header-border" />
  </header>
  <ProfileDrawer v-model:open="isProfileDrawerOpen" />
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index: 7;
  transition:
    top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.3s ease,
    background-color 0.3s ease,
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s ease;

  &--scrolled {
    backdrop-filter: blur(8px);
    background-color: var(--bg-primary-color-rgb);
    box-shadow: var(--s-s);

    .header-border {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &--small-screen {
    .header-content {
      grid-template-columns: auto 1fr auto;
      gap: 8px;
    }

    .header-center {
      display: none;
    }

    .header-left {
      justify-self: start;
    }

    .header-right {
      justify-self: end;
    }
  }

  &-content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    font-family: 'Rubik';
    padding: 0 12px;
    align-items: center;

    display: grid;
    grid-template-columns: 1fr minmax(auto, 1040px) 1fr;
    transition: grid-template-columns 0.3s ease;
  }

  &-left {
    justify-self: end;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 8px;
    padding: 0 16px;
    background-color: var(--bg-secondary-color);
    border-radius: 20px;
    transition:
      border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 40px;
    position: relative;
    overflow: hidden;

    &:hover {
      border-radius: 10px;
      transform: translateY(-1px);
      box-shadow: var(--s-l);

      .logo-icon {
        transform: rotate(10deg) scale(1.1);
      }
    }

    &:active {
      transform: translateY(0);
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &-icon {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &-text {
        font-family: 'Sansation';
        font-size: 1rem;
        font-weight: 600;
        position: relative;
      }
    }
  }

  &-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    position: relative;

    .title {
      color: var(--fg-secondary-color);
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 2px;
    }

    // Стили для навигации в header
    .header-navigation-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .header-nav-arrow {
      width: 32px;
      height: 32px;
      border-radius: var(--r-full);
      border: 1px solid transparent;
      background-color: var(--bg-secondary-color);
      color: var(--fg-secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s ease;
      opacity: 0.7;

      &:hover {
        color: var(--fg-accent-color);
        background-color: var(--bg-hover-color);
        border-color: var(--border-secondary-color);
        opacity: 1;
      }
    }

    .header-current-section {
      padding: 6px 16px;
      border-radius: var(--r-m);
      cursor: pointer;
      transition: background-color 0.2s ease;
      min-width: 200px;
      text-align: center;

      &:hover {
        background-color: var(--bg-hover-color);
      }

      &-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--fg-primary-color);
        margin: 0;
        line-height: 1.2;
        font-family: 'Sansation';
      }
    }

    .header-sections-dropdown-panel {
      position: absolute;
      top: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      max-width: 90vw;
      background-color: var(--bg-secondary-color);
      border: 1px solid var(--border-secondary-color);
      border-radius: var(--r-l);
      box-shadow: var(--s-xl);
      z-index: 20;
      padding: 16px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .header-sections-list {
      list-style: none;
      padding: 0;
      margin: 0;
      column-count: 2;
      column-gap: 24px;

      li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: var(--r-m);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        color: var(--fg-secondary-color);
        break-inside: avoid;
        page-break-inside: avoid;

        .header-section-item-icon {
          font-size: 1.1rem;
          color: var(--fg-secondary-color);
          flex-shrink: 0;
        }

        &:hover {
          background-color: var(--bg-hover-color);
          color: var(--fg-primary-color);
        }

        &.header-add-section-item {
          color: var(--fg-accent-color);

          &:hover {
            color: var(--fg-accent-color);
            background-color: var(--bg-accent-overlay-color);
          }
        }
      }
    }
  }

  &-right {
    justify-self: start;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 4px;
    margin: 8px;
    background-color: var(--bg-secondary-color);
    border-radius: 20px;
    transition:
      border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.2s ease,
      box-shadow 0.2s ease;
    height: 40px;

    &:hover {
      border-radius: 10px;
      transform: translateY(-1px);
      box-shadow: var(--s-l);
    }

    &:active {
      transform: translateY(0);
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
      transition:
        all 0.2s ease,
        transform 0.1s ease;
      font-size: 1.2rem;
      overflow: hidden;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background-color: var(--fg-accent-color);
        border-radius: 50%;
        transition: all 0.3s ease;
        transform: translate(-50%, -50%);
        opacity: 0.1;
        z-index: -1;
      }

      &:hover {
        color: var(--fg-accent-color);
        transform: scale(1.1);

        &::before {
          width: 100%;
          height: 100%;
        }
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .profile {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

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
        transition:
          border-color 0.2s ease-in-out,
          transform 0.2s ease,
          box-shadow 0.2s ease;

        &:hover {
          border-color: var(--border-accent-color);
          transform: scale(1.05);
          box-shadow: 0 2px 8px var(--border-accent-color);
        }
      }
    }
  }

  .vr {
    margin: 0;
    height: 20px;
    width: 1px;
    background-color: var(--border-secondary-color);
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  &-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-accent-color), transparent);
    opacity: 0;
    transform: scaleX(0);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
}

// Анимации для dropdown
.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

@include media-down(lg) {
  .header {
    &-center {
      .header-sections-dropdown-panel {
        width: calc(100vw - 48px);
      }

      .header-sections-list {
        column-count: 1;
      }
    }
  }
}

@include media-down(sm) {
  .header {
    &-content {
      padding: 0 8px;
      grid-template-columns: auto 1fr auto;
      gap: 4px;
    }

    &-center {
      display: none;
    }

    &-left {
      margin: 6px;
      width: 40px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo-text {
        display: none;
      }
    }

    &-right {
      margin: 4px;
      gap: 4px;
    }
  }
}
</style>
