import { STORAGE_KEYS } from './storageKeys'

export const itemService = {
  getItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
    } catch (e) {
      console.error('Items save error:', e)
    }
  },

  addItem(item) {
    const items = this.getItems()
    items.push(item)
    this.saveItems(items)
  },
}
