<script setup lang="ts">
import type { TripSection } from '~/shared/types/models/trip'
import { Icon } from '@iconify/vue'
import { v4 as uuidv4 } from 'uuid'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInput } from '~/components/01.kit/kit-input'
import { useModuleStore } from '~/components/05.modules/trip-info/composables/use-module'

interface Props {
  section: TripSection
}
const props = defineProps<Props>()

interface Expense {
  id: string
  title: string
  amount: number
  category: string
}

const { sections: sectionsStore, ui: uiStore } = useModuleStore(['sections', 'ui'])
const { isViewMode } = storeToRefs(uiStore)

const content = ref(props.section.content || { totalBudget: 0, currency: 'RUB', items: [] })
const isModalOpen = ref(false)
const currentExpense = ref<Expense | null>(null)
const isEditing = ref(false)

const totalSpent = computed(() => {
  return (content.value.items || []).reduce((sum: number, item: Expense) => sum + Number(item.amount || 0), 0)
})

const budgetProgress = computed(() => {
  if (!content.value.totalBudget || content.value.totalBudget === 0)
    return 0
  return (totalSpent.value / content.value.totalBudget) * 100
})

const remainingBudget = computed(() => content.value.totalBudget - totalSpent.value)

const currencyOptions = [
  { value: 'RUB', label: '₽' },
  { value: 'USD', label: '$' },
  { value: 'EUR', label: '€' },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: content.value.currency || 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function handleUpdate() {
  sectionsStore.updateSection({ ...props.section, content: content.value })
}

function openModal(expense: Expense | null = null) {
  isEditing.value = !!expense
  currentExpense.value = expense
    ? { ...expense }
    : { id: uuidv4(), title: '', amount: 0, category: '' }
  isModalOpen.value = true
}

function saveExpense() {
  if (!currentExpense.value)
    return

  const newItems = [...(content.value.items || [])]
  if (isEditing.value) {
    const index = newItems.findIndex(e => e.id === currentExpense.value!.id)
    if (index !== -1)
      newItems[index] = currentExpense.value
  }
  else {
    newItems.push(currentExpense.value)
  }
  content.value.items = newItems
  handleUpdate()
  isModalOpen.value = false
}

function deleteExpense(expenseId: string) {
  content.value.items = content.value.items.filter((e: Expense) => e.id !== expenseId)
  handleUpdate()
}
</script>

<template>
  <div class="finances-section">
    <div class="budget-summary">
      <div class="budget-input">
        <label for="totalBudget">Общий бюджет</label>
        <div class="input-with-currency">
          <KitInput
            id="totalBudget"
            v-model.number="content.totalBudget"
            type="number"
            :readonly="isViewMode"
            @blur="handleUpdate"
          />
          <select v-model="content.currency" :disabled="isViewMode" @change="handleUpdate">
            <option v-for="c in currencyOptions" :key="c.value" :value="c.value">
              {{ c.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="budget-stats">
        <div class="stat-item">
          <span>Потрачено</span>
          <strong>{{ formatCurrency(totalSpent) }}</strong>
        </div>
        <div class="stat-item" :class="{ 'is-over': remainingBudget < 0 }">
          <span>Осталось</span>
          <strong>{{ formatCurrency(remainingBudget) }}</strong>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${Math.min(budgetProgress, 100)}%` }" />
        <div v-if="budgetProgress > 100" class="progress-bar-over" :style="{ width: `${budgetProgress - 100}%` }" />
      </div>
    </div>

    <div class="expenses-list">
      <div class="list-header">
        <h4>Расходы</h4>
        <KitBtn v-if="!isViewMode" icon="mdi:plus" size="sm" @click="openModal()">
          Добавить
        </KitBtn>
      </div>
      <div v-if="content.items && content.items.length > 0" class="items-grid">
        <div v-for="expense in content.items" :key="expense.id" class="expense-item">
          <span class="expense-title">{{ expense.title }}</span>
          <span class="expense-amount">{{ formatCurrency(expense.amount) }}</span>
          <div v-if="!isViewMode" class="item-actions">
            <button @click="openModal(expense)">
              <Icon icon="mdi:pencil-outline" />
            </button>
            <button @click="deleteExpense(expense.id)">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Список расходов пуст.</p>
      </div>
    </div>

    <KitDialogWithClose v-if="currentExpense" v-model:visible="isModalOpen" :title="isEditing ? 'Изменить расход' : 'Новый расход'">
      <div class="modal-form">
        <KitInput v-model="currentExpense.title" label="Название" placeholder="Авиабилеты, ужин и т.д." />
        <KitInput v-model.number="currentExpense.amount" type="number" label="Сумма" />
        <div class="modal-actions">
          <KitBtn variant="text" @click="isModalOpen = false">
            Отмена
          </KitBtn>
          <KitBtn @click="saveExpense">
            Сохранить
          </KitBtn>
        </div>
      </div>
    </KitDialogWithClose>
  </div>
</template>

<style scoped lang="scss">
.finances-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}
.budget-summary {
  background: var(--bg-secondary-color);
  padding: 1rem;
  border-radius: var(--r-m);
}
.budget-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label {
    font-size: 0.9rem;
    color: var(--fg-secondary-color);
  }
}
.input-with-currency {
  display: flex;
  align-items: center;
  select {
    height: 46px;
    border: 1px solid var(--border-primary-color);
    border-left: none;
    border-radius: 0 var(--r-s) var(--r-s) 0;
    padding: 0 0.5rem;
    background: var(--bg-tertiary-color);
    color: var(--fg-primary-color);
  }
  :deep(.kit-input-wrapper input) {
    border-radius: var(--r-s) 0 0 var(--r-s);
  }
}
.budget-stats {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}
.stat-item {
  display: flex;
  flex-direction: column;
  span {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
  }
  strong {
    font-size: 1.1rem;
    color: var(--fg-primary-color);
  }
  &.is-over strong {
    color: var(--fg-error-color);
  }
}
.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary-color);
  border-radius: var(--r-full);
  overflow: hidden;
  position: relative;
}
.progress-bar {
  height: 100%;
  background: var(--fg-accent-color);
  border-radius: var(--r-full);
}
.progress-bar-over {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--fg-error-color);
  border-radius: var(--r-full);
}
.expenses-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  h4 {
    margin: 0;
    font-size: 1.1rem;
  }
}
.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
.expense-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-s);
  .expense-title {
    font-weight: 500;
  }
  .expense-amount {
    font-weight: 600;
    color: var(--fg-accent-color);
  }
  .item-actions {
    display: flex;
    gap: 0.25rem;
  }
}
.modal-form,
.modal-actions {
  display: flex;
  gap: 1rem;
}
.modal-form {
  flex-direction: column;
}
.modal-actions {
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}
</style>
