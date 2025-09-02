<script lang="ts" setup>
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { Icon } from '@iconify/vue'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'
import { BackgroundEffects } from '~/components/02.shared/background-effects'
import { NavigationBack } from '~/components/02.shared/navigation-back/index'
import { ThemeManager } from '~/components/02.shared/theme-manager'

import { useModuleStore } from '~/components/04.modules/trip-info/composables/use-module'
import Footer from './footer.vue'
import Header from './header.vue'

const store = useModuleStore(['sections'])

const { sortedSections } = storeToRefs(store.sections)

const activeTabId = ref<string>('daily-route')

const tabItems = computed((): ViewSwitcherItem<string>[] => {
  const dailyRouteTab: ViewSwitcherItem<string> = {
    id: 'daily-route',
    label: 'Маршрут по дням',
    icon: 'mdi:calendar-month-outline',
  }
  const sectionTabs: ViewSwitcherItem<string>[] = sortedSections.value.map(section => ({
    id: section.id,
    label: section.title,
    icon: section.icon || 'mdi:file-document-outline',
  }))

  return [dailyRouteTab, ...sectionTabs]
})
</script>

<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <Header />

  <main class="main">
    <div class="main-content">
      <!-- <NavigationBack /> -->

      <div class="main-navigation">
        <button
          class="main-navigation-menu"
          title="Отобразить План и Воспоминания"
          :class="{ 'is-active': activeTabId === 'menu' }"
        >
          <Icon icon="mdi:view-split-vertical" />
        </button>
        <KitViewSwitcher v-model="activeTabId" :items="tabItems" />
        <!-- <AddTripSection v-if="!isViewMode" /> -->
      </div>
      <KitDivider class="trip-info-divider">
        <Icon icon="mdi-axis-arrow-info" />
      </KitDivider>

      <slot />
    </div>

    <BackgroundEffects />
    <Footer />
  </main>

  <ThemeManager />
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;

  .trip-info-divider {
    margin: 0 auto;
    display: flex;
    align-items: center;
    max-width: 1000px;
    width: 100%;
    padding: 0 8px;
    background: var(--bg-primary-color);
    padding-top: 32px;
  }

  &-navigation {
    margin: 0 auto;
    display: flex;
    align-items: center;
    max-width: 1000px;
    width: 100%;
    padding: 0 8px;
    background: var(--bg-primary-color);
    padding-top: 16px;

    &-menu {
      border: 1px solid var(--border-secondary-color);
      border-radius: var(--r-s);
      cursor: pointer;
      color: var(--fg-secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.2s ease;
      margin-right: 8px;
      width: 40px;
      height: 40px;

      &:hover {
        color: var(--fg-accent-color);
        border-color: var(--fg-accent-color);
      }
    }
  }
  &-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
}
</style>
