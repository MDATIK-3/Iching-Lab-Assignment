import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { STORAGE_KEYS } from '../services/storageKeys'
import { useLocalStorage } from '../services/useLocalStorage'

export const useRestaurantStore = defineStore('restaurant', () => {
  const { data: restaurantData, load, update } = useLocalStorage(STORAGE_KEYS.RESTAURANT, null)
  const restaurant = ref(null)

  const saveRestaurant = (data) => {
    const restaurantToSave = {
      ...data,
      logo: data.logo || null,
      branches: data.branches || [],
    }
    restaurant.value = restaurantToSave
    update(restaurantToSave)
  }

  const isSetupComplete = computed(() => !!restaurant.value)

  const deleteRestaurant = () => {
    restaurant.value = null
    update(null)
  }

  // Sync with storage data
  watch(
    restaurantData,
    (newData) => {
      restaurant.value = newData ? structuredClone(newData) : null
    },
    { immediate: true },
  )

  load()

  return {
    restaurant,
    saveRestaurant,
    deleteRestaurant,
    isSetupComplete,
  }
})
