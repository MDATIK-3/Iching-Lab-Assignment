import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEYS } from '../services/storageKeys'
import { useLocalStorage } from '../services/useLocalStorage'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])
  const { data: ordersData, load, update } = useLocalStorage(STORAGE_KEYS.ORDERS, [])

  const openOrders = computed(() => orders.value.filter((o) => o.status === 'open'))
  const paidOrders = computed(() => orders.value.filter((o) => o.status === 'paid'))

  const createOrder = ({ customerName = '', tableNumber = '', items = [] }) => {
    const normalizedItems = items
      .filter((i) => i && i.qty > 0)
      .map((i) => ({
        itemId: i.itemId,
        name: i.name,
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 0,
      }))

    const total = normalizedItems.reduce((sum, i) => sum + i.price * i.qty, 0)

    const order = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'open',
      customerName,
      tableNumber,
      items: normalizedItems,
      total,
    }

    orders.value.unshift(order)
    update([...orders.value])
    return order
  }

  const markPaid = (orderId) => {
    const idx = orders.value.findIndex((o) => o.id === orderId)
    if (idx === -1) return
    const existing = orders.value[idx]
    orders.value[idx] = { ...existing, status: 'paid', paidAt: new Date().toISOString() }
    update([...orders.value])
  }

  const removeOrder = (orderId) => {
    orders.value = orders.value.filter((o) => o.id !== orderId)
    update([...orders.value])
  }

  load()
  // Clone to avoid mutating readonly proxies coming from storage composable
  orders.value = Array.isArray(ordersData.value) ? [...ordersData.value] : []

  return {
    orders,
    openOrders,
    paidOrders,
    createOrder,
    markPaid,
    removeOrder,
  }
})

