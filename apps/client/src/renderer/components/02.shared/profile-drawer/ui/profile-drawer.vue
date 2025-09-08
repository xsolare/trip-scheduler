<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { KitAvatar } from '~/components/01.kit/kit-avatar'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { KitDrawer } from '~/components/01.kit/kit-drawer'
import { UserQuotaWidget } from '~/components/02.shared/user-quota-widget'

const open = defineModel<boolean>('open', { required: true })

const store = useAppStore(['auth'])
const user = computed(() => store.auth.user)

const menuItems = [
  { label: 'Указать статус', icon: 'mdi:emoticon-happy-outline' },
]

const mainMenuItems = [
  { label: 'Мой профиль', icon: 'mdi:account-circle-outline' },
  { label: 'Мои путешествия', icon: 'mdi:briefcase-outline' },
  { label: 'Мои друзья', icon: 'mdi:account-multiple-outline' },
  { label: 'Сообщества', icon: 'mdi:star-outline' },
]

const secondaryMenuItems = [
  { label: 'Возможности', icon: 'mdi:flask-outline' },
  { label: 'Настройки', icon: 'mdi:cog-outline' },
]

const logoutItem = { label: 'Выйти', icon: 'mdi:logout' }
</script>

<template>
  <KitDrawer v-model:open="open" side="right">
    <div class="profile-drawer">
      <div v-if="user" class="profile-header">
        <KitAvatar :src="user.avatarUrl" :name="user.name" :size="40" />
        <div class="user-info">
          <span class="user-nickname">injurka</span>
          <span class="user-name">Иван Тайпскриптович</span>
        </div>
      </div>

      <div v-if="user && user.plan" class="quota-section">
        <UserQuotaWidget
          title="Путешествия"
          icon="mdi:briefcase-outline"
          :current="user.currentTripsCount"
          :limit="user.plan.maxTrips"
          unit="items"
        />
        <UserQuotaWidget
          title="Хранилище"
          icon="mdi:database-outline"
          :current="user.currentStorageBytes"
          :limit="user.plan.maxStorageBytes"
          unit="bytes"
        />
      </div>

      <nav class="drawer-nav">
        <ul>
          <li v-for="item in menuItems" :key="item.label" class="nav-item">
            <button class="nav-button">
              <Icon :icon="item.icon" class="nav-icon" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>

        <KitDivider />

        <ul>
          <li v-for="item in mainMenuItems" :key="item.label" class="nav-item">
            <button class="nav-button">
              <Icon :icon="item.icon" class="nav-icon" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>

        <KitDivider />

        <ul>
          <li v-for="item in secondaryMenuItems" :key="item.label" class="nav-item">
            <button class="nav-button">
              <Icon :icon="item.icon" class="nav-icon" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>

        <KitDivider />

        <ul>
          <li class="nav-item">
            <button class="nav-button">
              <Icon :icon="logoutItem.icon" class="nav-icon" />
              <span>{{ logoutItem.label }}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </KitDrawer>
</template>

<style lang="scss" scoped>
.profile-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 0 8px;

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-nickname {
    font-weight: 600;
    font-size: 1rem;
    color: var(--fg-primary-color);
  }

  .user-name {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
  }
}

.quota-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .nav-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    border-radius: var(--r-s);
    background: transparent;
    border: none;
    color: var(--fg-primary-color);
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--bg-hover-color);
    }

    .nav-icon {
      font-size: 1.1rem;
      margin-right: 12px;
      color: var(--fg-secondary-color);
    }
  }

  .kit-divider {
    margin: 4px 0;
  }
}
</style>
