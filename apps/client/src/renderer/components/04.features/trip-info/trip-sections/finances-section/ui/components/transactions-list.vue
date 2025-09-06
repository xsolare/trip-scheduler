<script setup lang="ts">
import type { Category, Transaction } from '../../models/types'
import { Icon } from '@iconify/vue'
import { useCurrencyFormatter } from '../../composables/use-currency-formatter'
import { useDateFormatter } from '../../composables/use-date-formatter'

interface Props {
  transactions: Transaction[]
  categories: Category[]
  mainCurrency: string
  readonly: boolean
  filteredTotal: number
}
defineProps<Props>()
defineEmits(['editTransaction', 'deleteTransaction'])

function getCategory(id: string | null, categories: Category[]) {
  return categories.find(c => c.id === id)
}
const { format: formatCurrency } = useCurrencyFormatter()
const { formatDate } = useDateFormatter()
</script>

<template>
  <div class="transactions-wrapper">
    <header class="list-header">
      <h3>Все транзакции</h3>
      <div v-if="filteredTotal > 0" class="total-amount">
        <span>Потрачено:</span>
        <strong>{{ formatCurrency(filteredTotal, mainCurrency) }}</strong>
      </div>
    </header>
    <div v-if="transactions.length > 0" class="transactions-list">
      <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
        <div class="item-main">
          <div class="item-icon" :class="tx.type">
            <Icon :icon="getCategory(tx.categoryId, categories)?.icon || 'mdi:help-rhombus-outline'" />
          </div>
          <div class="item-details">
            <span class="item-title">{{ tx.title }}</span>
            <span class="item-category">{{ getCategory(tx.categoryId, categories)?.name || 'Без категории' }} • {{ formatDate(tx.date, { dateStyle: 'medium' }) }}</span>
          </div>
        </div>
        <div class="item-amount">
          <span :class="tx.type">
            {{ tx.type === 'expense' ? '-' : '+' }} {{ formatCurrency(tx.amount, tx.currency) }}
          </span>
          <div v-if="!readonly" class="item-actions">
            <button title="Редактировать" @click="$emit('editTransaction', tx)">
              <Icon icon="mdi:pencil-outline" />
            </button>
            <button title="Удалить" @click="$emit('deleteTransaction', tx.id)">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <Icon icon="mdi:receipt-text-outline" />
      <p>Транзакций пока нет. Начните учет, добавив первую запись.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  height: 32px;
  h3 {
    margin: 0;
  }
  .total-amount {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--fg-secondary-color);
    background-color: var(--bg-secondary-color);
    padding: 4px 10px;
    border-radius: var(--r-s);
    strong {
      color: var(--fg-error-color);
      font-weight: 600;
    }
  }
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-secondary-color);
  &:hover .item-actions {
    opacity: 1;
  }
}

.item-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  &.expense {
    background-color: var(--bg-error-color);
    color: var(--fg-error-color);
  }
  &.income {
    background-color: var(--bg-success-color);
    color: var(--fg-success-color);
  }
}

.item-details {
  display: flex;
  flex-direction: column;
}
.item-title {
  font-weight: 500;
}
.item-category {
  font-size: 0.8rem;
  color: var(--fg-secondary-color);
}

.item-amount {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  .expense {
    color: var(--fg-error-color);
  }
  .income {
    color: var(--fg-success-color);
  }
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  button {
    color: var(--fg-tertiary-color);
  }
  button:hover {
    color: var(--fg-primary-color);
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--fg-tertiary-color);
  font-size: 2.5rem;
  p {
    font-size: 0.9rem;
  }
}
</style>
