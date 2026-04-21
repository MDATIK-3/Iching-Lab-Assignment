import { STORAGE_KEYS } from './storageKeys'

export const authService = {
  getUsers() {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  },

  saveUser(user) {
    try {
      const users = this.getUsers()
      users.push(user)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    } catch (e) {
      console.error('Auth save error:', e)
    }
  },

  saveCurrentUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
    } catch (e) {
      console.error('Current user save error:', e)
    }
  },

  clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },
}
