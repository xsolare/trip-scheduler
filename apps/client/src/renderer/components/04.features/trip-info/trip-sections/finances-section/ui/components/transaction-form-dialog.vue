<script setup lang="ts">
import type { Category, Transaction } from '../../models/types'
import { computed, ref, watch } from 'vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitDialogWithClose } from '~/components/01.kit/kit-dialog-with-close'
import { KitInput } from '~/components/01.kit/kit-input'
import { KitSelectWithSearch } from '~/components/01.kit/kit-select-with-search'
import { KitViewSwitcher } from '~/components/01.kit/kit-view-switcher'

interface Props {
  visible: boolean
  transaction: Transaction | null
  categories: Category[]
  mainCurrency: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'save', 'openCategoryManager'])

const form = ref<Partial<Transaction>>({})

const title = computed(() => props.transaction ? 'Редактировать транзакцию' : 'Новая транзакция')

const categoryItems = computed(() =>
  props.categories.map(c => ({ value: c.id, label: c.name, icon: c.icon })),
)

const typeItems = [
  { id: 'expense', label: 'Расход', icon: 'mdi:arrow-down' },
  { id: 'income', label: 'Доход', icon: 'mdi:arrow-up' },
]

function initializeForm() {
  form.value = props.transaction
    ? { ...props.transaction }
    : {
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        currency: props.mainCurrency,
        categoryId: null,
      }
}

function handleSubmit() {
  emit('save', form.value)
}

watch(() => props.visible, (isVisible) => {
  if (isVisible)
    initializeForm()
})
</script>

<template>
  <KitDialogWithClose :visible="visible" :title="title" icon="mdi:cash-plus" @update:visible="emit('update:visible', $event)">
    <form class="form-grid" @submit.prevent="handleSubmit">
      <KitViewSwitcher v-model="form.type" :items="typeItems" full-width />

      <KitInput v-model="form.title" label="Название" placeholder="Обед в ресторане" required class="span-2" />

      <KitInput v-model.number="form.amount" label="Сумма" type="number" required />
      <KitInput v-model="form.currency" label="Валюта" placeholder="RUB, USD..." />

      <KitInput v-model="form.date" label="Дата" type="text" placeholder="YYYY-MM-DD" required class="span-2" />

      <div class="category-select-wrapper span-2">
        <KitSelectWithSearch
          v-model="form.categoryId"
          :items="categoryItems"
          label="Категория"
          placeholder="Выберите категорию"
        />
        <KitBtn icon="mdi:cog-outline" variant="text" title="Управлять категориями" @click="$emit('openCategoryManager')" />
      </div>

      <KitInput v-model="form.notes" label="Заметки" placeholder="Дополнительная информация" class="span-2" />

      <div class="form-actions span-2">
        <KitBtn variant="text" @click="emit('update:visible', false)">
          Отмена
        </KitBtn>
        <KitBtn type="submit">
          Сохранить
        </KitBtn>
      </div>
    </form>
  </KitDialogWithClose>
</template>

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.span-2 {
  grid-column: span 2;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-secondary-color);
}
.category-select-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  .kit-select-with-search {
    flex-grow: 1;
  }
}
</style>
