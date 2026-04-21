<template>
  <q-page class="flex column items-center justify-center q-pa-md bg-grey-1">
    <div class="text-center q-mb-xl q-pa-md">
      <div class="text-h4 q-mb-sm">Welcome to</div>
      <div class="text-h2 text-weight-bold text-accent">Restaurant POS</div>
      <div class="text-subtitle1 text-grey-6 q-mt-sm">Point of Sale System</div>
    </div>

    <q-card class="q-pa-xl shadow-8" style="max-width: 440px; min-width: 380px">
      <LoginForm :loading="loading" @login="handleLogin" />

      <q-separator class="q-my-md" />

      <div class="text-center q-mb-md">
        <span class="text-body2 text-grey-7">Don't have an account?</span>
        <q-btn flat size="sm" label="Create one" color="accent" @click="showRegisterDialog = true" class="q-ml-sm" />
      </div>
    </q-card>

    <RegisterCard :show="showRegisterDialog" @register="handleRegister" @update:show="showRegisterDialog = $event" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { Notify } from 'quasar'
import LoginForm from 'src/components/auth/LoginForm.vue'
import RegisterCard from 'src/components/auth/RegisterCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const showRegisterDialog = ref(false)

const handleLogin = async ({ email, password }) => {
  loading.value = true
  try {
    const success = await authStore.login(email, password)
    if (success) {
      Notify.create({
        message: `Welcome back, ${authStore.currentUser?.name}!`,
        color: 'positive',
        icon: 'verified'
      })
      router.push('/app/restaurant')
    } else {
      Notify.create({
        message: 'Invalid email or password!',
        color: 'negative',
        icon: 'error',
        timeout: 4000
      })
    }
  } finally {
    loading.value = false
  }
}

const handleRegister = async (formData) => {
  const success = authStore.register(formData.name, formData.email, formData.password, formData.phone)
  if (success) {
    Notify.create({
      message: 'Account created! Logging in...',
      color: 'positive',
      icon: 'person_add'
    })
    // Auto-login after register
    const loginSuccess = await authStore.login(formData.email, formData.password)
    if (loginSuccess) {
      router.push('/app/restaurant')
    }
  } else {
    Notify.create({
      message: 'Email already exists!',
      color: 'negative',
      icon: 'error'
    })
  }
}

// Seed default user if no users exist (for testing)
onMounted(() => {
  if (authStore.users.length === 0) {
    authStore.register('Admin User', 'admin@test.com', 'password123', '123-456-7890')
    Notify.create({
      message: 'Default admin created: admin@test.com / password123',
      color: 'info',
      timeout: 5000
    })
  }
})
</script>
