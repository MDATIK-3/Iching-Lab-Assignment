import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '../services/storageKeys'
import { useLocalStorage } from '../services/useLocalStorage'

export const useAuthStore = defineStore('auth', () => {
  const users = ref([])
  const currentUser = ref(null)
  const {
    data: usersData,
    load: loadUsers,
    update: saveUsers,
  } = useLocalStorage(STORAGE_KEYS.USERS, [])
  const {
    data: currentUserData,
    load: loadCurrent,
    update: saveCurrent,
  } = useLocalStorage(STORAGE_KEYS.CURRENT_USER, null)

  const syncFromStorage = () => {
    loadUsers()
    loadCurrent()
    // Clone to avoid mutating readonly proxies coming from storage composable
    users.value = Array.isArray(usersData.value) ? [...usersData.value] : []
    currentUser.value = currentUserData.value || null
  }

  const login = (email, password) => {
    syncFromStorage()
    const normalizedEmail = String(email || '')
      .trim()
      .toLowerCase()
    const normalizedPassword = String(password || '')

    const user = users.value.find(
      (u) => String(u.email || '').trim().toLowerCase() === normalizedEmail && u.password === normalizedPassword,
    )
    if (user) {
      currentUser.value = { id: user.id, name: user.name, email: user.email }
      saveCurrent(currentUser.value)
      return true
    }
    return false
  }

  const register = (name, email, password, phone) => {
    syncFromStorage()
    const normalizedEmail = String(email || '')
      .trim()
      .toLowerCase()

    const exists = users.value.some((u) => String(u.email || '').trim().toLowerCase() === normalizedEmail)
    if (exists) return false

    const newUser = {
      id: Date.now().toString(),
      name: String(name || '').trim(),
      email: normalizedEmail,
      password, // In prod, hash this!
      phone: String(phone || ''),
    }

    users.value.push(newUser)
    saveUsers(users.value)
    return true
  }

  const logout = () => {
    currentUser.value = null
    saveCurrent(null)
  }

  const isAuthenticated = computed(() => !!currentUser.value)

  // Init
  syncFromStorage()

  return {
    users,
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
  }
})
