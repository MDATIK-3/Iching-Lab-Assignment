import { ref, readonly } from 'vue'

export function useLocalStorage(key, defaultValue = null) {
  const data = ref(defaultValue)

  const load = () => {
    try {
      const stored = localStorage.getItem(key)
      data.value = stored ? JSON.parse(stored) : defaultValue
    } catch {
      data.value = defaultValue
    }
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (e) {
      console.error('LS save error:', e)
    }
  }

  const update = (newValue) => {
    data.value = newValue
    save()
  }

  load()

  return {
    data: readonly(data),
    load,
    save,
    update,
  }
}
