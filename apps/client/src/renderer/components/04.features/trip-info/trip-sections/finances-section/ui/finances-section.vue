<script setup lang="ts">
import type { FinancesSectionContent } from '../models/types'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { useFinancesSection } from '../composables'
import BudgetSettingsDialog from './components/budget-settings-dialog.vue'
import CategoryManagerDialog from './components/category-manager-dialog.vue'
import FinancesDashboard from './components/finances-dashboard.vue'
import TransactionFormDialog from './components/transaction-form-dialog.vue'
import TransactionsList from './components/transactions-list.vue'

interface Props {
  section: {
    id: string
    type: 'finances'
    content: FinancesSectionContent
  }
  readonly: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['updateSection'])

const {
  categories,
  settings,
  isTransactionFormOpen,
  isCategoryManagerOpen,
  isSettingsOpen,
  transactionToEdit,
  spendingByCategory,
  spendingByDay,
  filteredTransactions,
  filteredTotal,
  selectedCategoryFilter,
  openTransactionForm,
  saveTransaction,
  deleteTransaction,
  saveCategory,
  deleteCategory,
  saveSettings,
} = useFinancesSection(props, emit)

const categoryFilterItems = computed(() => {
  const items = categories.value.map(c => ({ value: c.id, label: c.name, icon: c.icon }))
  items.unshift({ value: null, label: 'Все категории', icon: 'mdi:format-list-bulleted' } as any)
  return items
})

const transactionFormVisibleBeforeCategoryManager = ref(false)

function handleOpenCategoryManager() {
  if (isTransactionFormOpen.value) {
    isTransactionFormOpen.value = false
    transactionFormVisibleBeforeCategoryManager.value = true
  }
  isCategoryManagerOpen.value = true
}

watch(isCategoryManagerOpen, (isOpen) => {
  if (!isOpen && transactionFormVisibleBeforeCategoryManager.value) {
    isTransactionFormOpen.value = true
    transactionFormVisibleBeforeCategoryManager.value = false
  }
})
</script>

<template>
  <div class="finances-section">
    <FinancesDashboard
      :main-currency="settings.mainCurrency"
      :spending-by-category="spendingByCategory"
      :spending-by-day="spendingByDay"
    />

    <div class="list-controls">
      <div class="category-filter-pills">
        <button
          v-for="item in categoryFilterItems"
          :key="String(item.value)"
          class="filter-pill"
          :class="{ active: selectedCategoryFilter === item.value }"
          @click="selectedCategoryFilter = item.value"
        >
          <Icon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>
      <div class="list-actions">
        <KitBtn v-if="!readonly" icon="mdi:plus" @click="openTransactionForm()">
          Добавить трату
        </KitBtn>
        <KitBtn v-if="!readonly" icon="mdi:tag-outline" variant="text" @click="handleOpenCategoryManager">
          Категории
        </KitBtn>
        <KitBtn v-if="!readonly" icon="mdi:cog-outline" variant="text" @click="isSettingsOpen = true">
          Настройки
        </KitBtn>
      </div>
    </div>

    <TransactionsList
      :transactions="filteredTransactions"
      :categories="categories"
      :main-currency="settings.mainCurrency"
      :readonly="readonly"
      :filtered-total="filteredTotal"
      @edit-transaction="openTransactionForm"
      @delete-transaction="deleteTransaction"
    />

    <!-- DIALOGS -->
    <TransactionFormDialog
      v-model:visible="isTransactionFormOpen"
      :transaction="transactionToEdit"
      :categories="categories"
      :main-currency="settings.mainCurrency"
      @save="saveTransaction"
      @open-category-manager="handleOpenCategoryManager"
    />

    <CategoryManagerDialog
      v-model:visible="isCategoryManagerOpen"
      :categories="categories"
      @save="saveCategory"
      @delete="deleteCategory"
    />

    <BudgetSettingsDialog
      v-model:visible="isSettingsOpen"
      :settings="settings"
      @save="saveSettings"
    />
  </div>
</template>

<style scoped lang="scss">
.finances-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: var(--r-full);
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  color: var(--fg-secondary-color);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border-accent-color);
    color: var(--fg-primary-color);
  }

  &.active {
    background-color: var(--bg-accent-color);
    border-color: var(--bg-accent-color);
    color: var(--fg-on-accent-color);
  }
}

.list-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}
</style>
