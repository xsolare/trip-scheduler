import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRequest, useRequestStatus } from '~/plugins/request'

export interface Plan {
  id: number
  name: string
  maxTrips: number
  maxStorageBytes: number
  isDeveloping: boolean
}

// Mock-данные для price, т.к. их нет в схеме БД
const planPrices: Record<number, { monthly: number, yearly: number }> = {
  1: { monthly: 0, yearly: 0 },
  2: { monthly: 499, yearly: 4990 },
  3: { monthly: 1299, yearly: 12990 },
}

const planDescriptions: Record<number, string> = {
  1: 'Идеально для начала и планирования личных поездок.',
  2: 'Для опытных путешественников и более сложных маршрутов.',
  3: 'Для турагентств и организации групповых поездок.',
}

const planFeatures: Record<number, string[]> = {
  1: ['1 путешествия', '1 ГБ хранилища', 'Базовое планирование', 'Без совместной работы'],
  2: ['10 путешествий', '20 ГБ хранилища', 'Расширенное планирование', 'Совместная работа (до 5 чел.)', 'Офлайн-карты'],
  3: ['Неограниченно путешествий', '100 ГБ хранилища', 'Все PRO-функции', 'Управление командой', 'Приоритетная поддержка'],
}

export enum EAccountKeys {
  FETCH_PLANS = 'account:fetch-plans',
}

export const useAccountStore = defineStore('account', () => {
  const billingCycle = ref<'monthly' | 'yearly'>('monthly')
  const rawPlans = ref<Plan[]>([])

  const isLoading = useRequestStatus(EAccountKeys.FETCH_PLANS)

  const plans = computed(() => {
    // Обогащаем планы данными, которые хранятся только на фронте (цены, описания)
    return rawPlans.value.map(plan => ({
      ...plan,
      price: planPrices[plan.id] || { monthly: 0, yearly: 0 },
      description: planDescriptions[plan.id] || 'Описание для этого тарифа не найдено.',
      features: planFeatures[plan.id] || [],
      // ЗАГЛУШКА: Логика определения текущего тарифа
      isCurrent: plan.id === 1,
    }))
  })

  async function fetchPlans() {
    await useRequest({
      key: EAccountKeys.FETCH_PLANS,
      fn: db => db.account.listPlans(),
      onSuccess: (data) => {
        rawPlans.value = data
      },
    })
  }

  function setBillingCycle(cycle: 'monthly' | 'yearly') {
    billingCycle.value = cycle
  }

  return {
    billingCycle,
    plans,
    isLoading,
    fetchPlans,
    setBillingCycle,
  }
})
