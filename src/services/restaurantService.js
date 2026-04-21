import { STORAGE_KEYS } from './storageKeys'

export const restaurantService = {
  getRestaurant() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESTAURANT)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },

  saveRestaurant(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.RESTAURANT, JSON.stringify(data))
    } catch (e) {
      console.error('Restaurant save error:', e)
    }
  },
}
