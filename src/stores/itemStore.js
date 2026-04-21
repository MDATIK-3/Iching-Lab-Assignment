import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { STORAGE_KEYS } from '../services/storageKeys'
import { useLocalStorage } from '../services/useLocalStorage'

export const useItemStore = defineStore('items', () => {
  const items = ref([])
  const searchQuery = ref('')
  const categoryFilter = ref('all')
  const { data: itemsData, load, update } = useLocalStorage(STORAGE_KEYS.ITEMS, [])

  const filteredItems = computed(() => {
    let filtered = items.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
      )
    }

    if (categoryFilter.value !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter.value)
    }

    return filtered
  })

  const addItem = (itemData) => {
    const item = {
      id: uuidv4(),
      ...itemData,
    }
    items.value.push(item)
    update([...items.value])
  }

  const updateItem = (id, itemData) => {
    const index = items.value.findIndex((i) => i.id === id)
    if (index > -1) {
      items.value[index] = { ...items.value[index], ...itemData }
      update([...items.value])
    }
  }

  const deleteItem = (id) => {
    items.value = items.value.filter((i) => i.id !== id)
    update([...items.value])
  }

  load()
  // Clone to avoid mutating readonly proxies coming from storage composable
  items.value = Array.isArray(itemsData.value) ? [...itemsData.value] : []

  return {
    items,
    searchQuery,
    categoryFilter,
    filteredItems,
    addItem,
    updateItem,
    deleteItem,
  }
})
