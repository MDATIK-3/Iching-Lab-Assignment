import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '../services/storageKeys'
import { useLocalStorage } from '../services/useLocalStorage'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurant = ref(null)
  const { data: restaurantData, load, update } = useLocalStorage(STORAGE_KEYS.RESTAURANT, null)

  const saveRestaurant = (data) => {
    const restaurantData = {
      ...data,
      logo: data.logo || null, // base64
      branches: data.branches || [],
    }
    restaurant.value = restaurantData
    update(restaurantData)
  }

  const isSetupComplete = computed(() => !!restaurant.value)

  load()
  // Clone to avoid mutating readonly proxies coming from storage composable
  restaurant.value = restaurantData.value ? structuredClone(restaurantData.value) : null

  return {
    restaurant,
    saveRestaurant,
    isSetupComplete,
  }
})
