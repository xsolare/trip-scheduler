<script lang="ts" setup>
import type { KitDropdownItem } from '~/components/01.kit/kit-dropdown'
import type { ViewSwitcherItem } from '~/components/01.kit/kit-view-switcher'
import { Icon } from '@iconify/vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, provide, ref, watch } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { KitDrawer } from '~/components/01.kit/kit-drawer'
import { KitDropdown } from '~/components/01.kit/kit-dropdown'
import { KitInput } from '~/components/01.kit/kit-input'
import { AppHeader } from '~/components/02.shared/app-header'
import { BackgroundEffects } from '~/components/02.shared/background-effects'
import { ProfileDrawer } from '~/components/02.shared/profile-drawer'
import { ThemeManager } from '~/components/02.shared/theme-manager'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-module'
import Footer from './footer.vue'

const store = useModuleStore(['sections'])
const { sortedSections } = storeToRefs(store.sections)
const confirm = useConfirm()
const router = useRouter()
const isMobile = useMediaQuery('(max-width: 768px)')

const headerCenterRef = ref<HTMLElement>()
const isHeaderDropdownOpen = ref(false)
const isProfileDrawerOpen = ref(false)
const activeTabId = ref<string>('daily-route')
const isDrawerOpen = ref(false)
const isDropdownOpen = ref(false)
const navigationWrapperRef = ref(null)
const mainNavigationRef = ref<HTMLElement>()
const isNavigationVisible = ref(true)
const isAddSectionDialogOpen = ref(false)
const newSectionTitle = ref('')
const newSectionIcon = ref('mdi:file-document-outline')
const iconSearchQuery = ref('')
const isEditSectionDialogOpen = ref(false)
const sectionToEdit = ref<{ id: string, title: string, icon: string } | null>(null)
const iconSearchQueryEdit = ref('')

// --- СПИСКИ И КОНСТАНТЫ ---
const iconList = [
  'mdi:walk',
  'mdi:car',
  'mdi:train',
  'mdi:airplane',
  'mdi:bus',
  'mdi:taxi',
  'mdi:ferry',
  'mdi:bike',
  'mdi:bed',
  'mdi:food-fork-drink',
  'mdi:coffee-outline',
  'mdi:store-outline',
  'mdi:tent',
  'mdi:camera-outline',
  'mdi:map-marker-outline',
  'mdi:hiking',
  'mdi:swim',
  'mdi:beach',
  'mdi:shopping-outline',
  'mdi:music-note-outline',
  'mdi:party-popper',
  'mdi:currency-usd',
  'mdi:ticket-confirmation-outline',
  'mdi:weather-sunny',
  'mdi:weather-night',
  'mdi:flag-variant-outline',
  'mdi:information-outline',
  'mdi:run-fast',
  'mdi:bank-outline',
  'mdi:gas-station-outline',
  'mdi:fire',
  'mdi:heart-outline',
  'mdi:star-outline',
  'mdi:check-circle-outline',
  'mdi:alert-circle-outline',
  'mdi:help-circle-outline',
  'mdi:account-group-outline',
  'mdi:phone-outline',
  'mdi:link-variant',
  'mdi:calendar-blank-outline',
  'mdi:file-document-outline',
]

// --- ВЫЧИСЛЯЕМЫЕ СВОЙСТВА (COMPUTED) ---
const filteredIcons = computed(() => {
  if (!iconSearchQuery.value)
    return iconList
  return iconList.filter(icon => icon.toLowerCase().includes(iconSearchQuery.value.toLowerCase()))
})

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

const activeTab = computed(() => tabItems.value.find(item => item.id === activeTabId.value))

const navigationState = computed(() => ({
  isNavigationVisible: isNavigationVisible.value,
  activeTab: activeTab.value,
  tabItems: tabItems.value,
  isDropdownOpen: isDropdownOpen.value,
  isMobile: isMobile.value,
  navigate,
  handleCurrentSectionClick,
  selectSection,
  isAddSectionDialogOpen,
}))

const shouldShowCurrentSection = computed(() => {
  return navigationState?.value
    && !navigationState.value.isNavigationVisible
    && router.currentRoute.value.name === 'trip-info'
})

const isCurrentTabEditable = computed(() => {
  if (!activeTab.value || activeTab.value.id === 'daily-route')
    return false
  const section = sortedSections.value.find(s => s.id === activeTab.value!.id)
  if (!section)
    return false
  const nonEditableLabels = ['Бронирования', 'Финансы']
  return !nonEditableLabels.includes(section.title)
})

const menuItems = computed((): KitDropdownItem[] => {
  const items: KitDropdownItem[] = [
    { value: 'share', label: 'Поделиться', icon: 'mdi:share-variant-outline' },
  ]
  if (isCurrentTabEditable.value) {
    items.push(
      { value: 'edit', label: 'Редактировать', icon: 'mdi:pencil-outline' },
      { value: 'delete', label: 'Удалить', icon: 'mdi:trash-can-outline' },
    )
  }
  return items
})

const filteredIconsEdit = computed(() => {
  if (!iconSearchQueryEdit.value)
    return iconList
  return iconList.filter(icon => icon.toLowerCase().includes(iconSearchQueryEdit.value.toLowerCase()))
})

// --- ФУНКЦИИ (METHODS) ---
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

async function handleAddSection() {
  if (!newSectionTitle.value.trim())
    return

  // @ts-expect-error Сделать позже
  await store.sections.createSection({
    title: newSectionTitle.value,
    icon: newSectionIcon.value,
  })
  isAddSectionDialogOpen.value = false
}

function navigate(direction: 'prev' | 'next') {
  const currentIndex = tabItems.value.findIndex(item => item.id === activeTabId.value)
  if (currentIndex === -1)
    return
  const totalItems = tabItems.value.length
  let nextIndex
  if (direction === 'next')
    nextIndex = (currentIndex + 1) % totalItems
  else
    nextIndex = (currentIndex - 1 + totalItems) % totalItems
  activeTabId.value = tabItems.value[nextIndex].id
}

function handleCurrentSectionClick() {
  if (isMobile.value)
    isDrawerOpen.value = true
  else
    isDropdownOpen.value = !isDropdownOpen.value
}

function selectSection(id: string) {
  activeTabId.value = id
  isDrawerOpen.value = false
  isDropdownOpen.value = false
}

function openEditDialog() {
  if (!activeTab.value || !isCurrentTabEditable.value)
    return
  const section = sortedSections.value.find(s => s.id === activeTab.value!.id)
  if (!section)
    return
  sectionToEdit.value = {
    id: section.id,
    title: section.title,
    icon: section.icon || 'mdi:file-document-outline',
  }
  iconSearchQueryEdit.value = ''
  isEditSectionDialogOpen.value = true
}

async function handleUpdateSection() {
  if (!sectionToEdit.value || !sectionToEdit.value.title.trim())
    return
  const section = sortedSections.value.find(s => s.id === sectionToEdit.value!.id)
  if (section) {
    await store.sections.updateSection({
      ...section,
      title: sectionToEdit.value.title,
      icon: sectionToEdit.value.icon,
    })
  }
  isEditSectionDialogOpen.value = false
}

async function handleDeleteSection() {
  if (!activeTab.value || !isCurrentTabEditable.value)
    return
  const isConfirmed = await confirm({
    title: `Удалить раздел "${activeTab.value.label}"?`,
    description: 'Это действие нельзя отменить.',
    confirmText: 'Удалить',
    type: 'danger',
  })
  if (isConfirmed) {
    const sectionIdToDelete = activeTab.value.id
    selectSection('daily-route')
    await store.sections.deleteSection(sectionIdToDelete)
  }
}

function handleMenuAction(item: KitDropdownItem) {
  if (!item.value)
    return
  switch (item.value) {
    case 'share':
      // eslint-disable-next-line no-console
      console.log('Share action triggered for:', activeTab.value?.label)
      break
    case 'edit':
      openEditDialog()
      break
    case 'delete':
      handleDeleteSection()
      break
  }
}

// --- НАБЛЮДАТЕЛИ И ХУКИ ЖИЗНЕННОГО ЦИКЛА ---
provide('navigationState', navigationState)

watch(isAddSectionDialogOpen, (isOpen) => {
  if (!isOpen) {
    newSectionTitle.value = ''
    newSectionIcon.value = 'mdi:file-document-outline'
    iconSearchQuery.value = ''
  }
})

watch(isNavigationVisible, (isVisible) => {
  if (!isVisible)
    isDropdownOpen.value = false
})

watch(isEditSectionDialogOpen, (isOpen) => {
  if (!isOpen)
    sectionToEdit.value = null
})

onClickOutside(headerCenterRef, () => {
  isHeaderDropdownOpen.value = false
})

onClickOutside(navigationWrapperRef, () => {
  isDropdownOpen.value = false
})

onMounted(() => {
  if (!mainNavigationRef.value)
    return

  const observer = new IntersectionObserver(
    ([entry]) => {
      isNavigationVisible.value = entry.isIntersecting
    },
    {
      threshold: 0.1,
    },
  )

  observer.observe(mainNavigationRef.value)

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <AppHeader>
    <template #center>
      <div v-if="shouldShowCurrentSection" ref="headerCenterRef" class="header-navigation-wrapper">
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
    </template>
  </AppHeader>
  <ProfileDrawer v-model:open="isProfileDrawerOpen" />

  <main class="main">
    <div class="main-content">
      <div
        ref="mainNavigationRef"
        class="main-navigation"
      >
        <button class="nav-button" title="Назад" @click="router.back()">
          <Icon icon="mdi:arrow-left" />
        </button>

        <div ref="navigationWrapperRef" class="navigation-wrapper">
          <button class="nav-arrow left" title="Предыдущая секция" @click="navigate('prev')">
            <Icon icon="mdi:chevron-left" />
          </button>

          <div class="current-section" @click="handleCurrentSectionClick">
            <h1 class="current-section-title">
              {{ activeTab?.label }}
            </h1>
          </div>

          <button class="nav-arrow right" title="Следующая секция" @click="navigate('next')">
            <Icon icon="mdi:chevron-right" />
          </button>

          <Transition name="fade-dropdown">
            <div v-if="!isMobile && isDropdownOpen" class="sections-dropdown-panel">
              <ul class="sections-list">
                <li v-for="item in tabItems" :key="item.id" @click="selectSection(item.id)">
                  <Icon :icon="item.icon!" class="section-item-icon" />
                  <span>{{ item.label }}</span>
                </li>
                <li class="add-section-item" @click="isAddSectionDialogOpen = true">
                  <Icon icon="mdi:plus-circle-outline" class="section-item-icon" />
                  <span>Добавить раздел</span>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <KitDropdown :items="menuItems" @update:model-value="handleMenuAction">
          <template #trigger>
            <button class="nav-button" title="Меню">
              <Icon icon="mdi:dots-vertical" />
            </button>
          </template>
        </KitDropdown>
      </div>
      <KitDivider class="trip-info-divider">
        <Icon width="16" height="16" icon="mdi-axis-arrow-info" />
      </KitDivider>

      <slot />
    </div>

    <BackgroundEffects />
    <Footer />
  </main>

  <ThemeManager />

  <!-- Drawer для мобильных -->
  <KitDrawer
    v-model:open="isDrawerOpen"
    side="right"
    class="sections-drawer"
  >
    <div class="drawer-header">
      <h2>Разделы</h2>
    </div>
    <ul class="drawer-list">
      <li v-for="item in tabItems" :key="item.id" @click="selectSection(item.id)">
        <Icon :icon="item.icon!" class="drawer-item-icon" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <div class="drawer-footer">
      <KitBtn icon="mdi:plus" @click="isAddSectionDialogOpen = true">
        Добавить раздел
      </KitBtn>
    </div>
  </KitDrawer>

  <!-- Диалог добавления новой секции -->
  <KitDialogWithClose
    v-model:visible="isAddSectionDialogOpen"
    title="Новый раздел"
    icon="mdi:plus"
    :max-width="400"
  >
    <form class="add-section-form" @submit.prevent="handleAddSection">
      <KitInput
        v-model="newSectionTitle"
        label="Название раздела"
        placeholder="Например, 'Билеты' или 'Отели'"
        required
      />
      <div class="icon-picker">
        <label>Иконка</label>
        <KitInput v-model="iconSearchQuery" placeholder="Поиск иконки (напр. 'car')" icon="mdi:magnify" />
        <div class="icon-picker-grid">
          <button
            v-for="icon in filteredIcons"
            :key="icon"
            type="button"
            class="icon-option"
            :class="{ 'is-active': newSectionIcon === icon }"
            @click="newSectionIcon = icon"
          >
            <Icon :icon="icon" />
          </button>
        </div>
      </div>
      <KitBtn type="submit" :disabled="!newSectionTitle.trim()">
        Создать раздел
      </KitBtn>
    </form>
  </KitDialogWithClose>

  <!-- Диалог редактирования раздела -->
  <KitDialogWithClose
    v-if="sectionToEdit"
    v-model:visible="isEditSectionDialogOpen"
    title="Редактировать раздел"
    icon="mdi:pencil"
    :max-width="400"
  >
    <form class="add-section-form" @submit.prevent="handleUpdateSection">
      <KitInput
        v-model="sectionToEdit.title"
        label="Название раздела"
        placeholder="Например, 'Билеты' или 'Отели'"
        required
      />
      <div class="icon-picker">
        <label>Иконка</label>
        <KitInput v-model="iconSearchQueryEdit" placeholder="Поиск иконки (напр. 'car')" icon="mdi:magnify" />
        <div class="icon-picker-grid">
          <button
            v-for="icon in filteredIconsEdit"
            :key="icon"
            type="button"
            class="icon-option"
            :class="{ 'is-active': sectionToEdit.icon === icon }"
            @click="sectionToEdit.icon = icon"
          >
            <Icon :icon="icon" />
          </button>
        </div>
      </div>
      <KitBtn type="submit" :disabled="!sectionToEdit.title.trim()">
        Сохранить
      </KitBtn>
    </form>
  </KitDialogWithClose>
</template>

<style scoped lang="scss">
/* Стили для контента слота из trip-info/ui/header.vue */
.header-navigation-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
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

/* Оригинальные стили trip-info/ui/layout.vue */
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
    justify-content: space-between;
    align-items: center;
    max-width: 1000px;
    width: 100%;
    padding: 0 8px;
    background: var(--bg-primary-color);
    padding-top: 16px;

    .nav-button {
      width: 40px;
      height: 40px;
      border-radius: var(--r-full);
      border: 1px solid transparent;
      background-color: var(--bg-secondary-color);
      color: var(--fg-secondary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &:hover {
        color: var(--fg-accent-color);
        background-color: var(--bg-hover-color);
        border-color: var(--border-secondary-color);
      }
    }

    .navigation-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .nav-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: var(--r-full);
        border: 1px solid transparent;
        background-color: transparent;
        color: var(--fg-secondary-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1;

        &.left {
          left: -50px;
        }

        &.right {
          right: -50px;
        }

        &:hover {
          color: var(--fg-accent-color);
          background-color: var(--bg-hover-color);
          border-color: var(--border-secondary-color);
        }
      }

      &:hover .nav-arrow {
        opacity: 1;
        visibility: visible;
      }
    }

    .current-section {
      padding: 8px 24px;
      border-radius: var(--r-m);
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-align: center;

      &:hover {
        background-color: var(--bg-hover-color);
      }

      &-title {
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--fg-primary-color);
        margin: 0;
        line-height: 1.2;
        font-family: 'Sansation';
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

.sections-drawer {
  .drawer-header {
    padding: 24px;
    border-bottom: 1px solid var(--border-secondary-color);
    h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  .drawer-list {
    list-style: none;
    padding: 8px;
    margin: 0;
    flex: 1;
    overflow-y: auto;

    li {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: var(--r-m);
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 1rem;
      color: var(--fg-secondary-color);

      .drawer-item-icon {
        font-size: 1.2rem;
        color: var(--fg-secondary-color);
      }

      &:hover {
        background-color: var(--bg-hover-color);
        color: var(--fg-primary-color);
      }
    }
  }

  .drawer-footer {
    padding: 16px;
    border-top: 1px solid var(--border-secondary-color);
  }
}

.sections-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  box-shadow: var(--s-xl);
  z-index: 10;
  padding: 16px;
  max-height: 50vh;
  overflow-y: auto;
}

.sections-list {
  list-style: none;
  padding: 0;
  margin: 0;
  column-count: 3;
  column-gap: 24px;

  li {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-radius: var(--r-m);
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 1rem;
    color: var(--fg-secondary-color);
    break-inside: avoid;
    page-break-inside: avoid;

    .section-item-icon {
      font-size: 1.2rem;
      color: var(--fg-secondary-color);
      flex-shrink: 0;
    }

    &:hover {
      background-color: var(--bg-hover-color);
      color: var(--fg-primary-color);
    }

    &.add-section-item {
      color: var(--fg-accent-color);
      &:hover {
        color: var(--fg-accent-color);
        background-color: var(--bg-accent-overlay-color);
      }
    }
  }
}

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

.add-section-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
}

.icon-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
}
.icon-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
  gap: 8px;
  max-height: 142px;
  overflow-y: auto;
  background-color: var(--bg-secondary-color);
  padding: 8px;
  border-radius: var(--r-s);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-primary-color);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-s);
  border: 1px solid transparent;
  background-color: var(--bg-tertiary-color);
  color: var(--fg-secondary-color);
  cursor: pointer;
  font-size: 1.4rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
  &.is-active {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}

@include media-down(lg) {
  .sections-dropdown-panel {
    width: calc(100vw - 48px);
  }
  .sections-list {
    column-count: 2;
  }
  .header-sections-dropdown-panel {
    width: calc(100vw - 48px);
  }

  .header-sections-list {
    column-count: 1;
  }
}

@include media-down(sm) {
  .sections-list {
    column-count: 1;
  }
}
</style>
