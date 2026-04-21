<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md">
    <div class="text-h5 q-mb-md text-center">Sign In</div>

    <q-input v-model="form.email" type="email" label="Email *"
      :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']" lazy-rules>
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-input v-model="form.password" type="password" label="Password *"
      :rules="[val => !!val || 'Password is required', val => val.length >= 6 || 'Min 6 chars']" lazy-rules>
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
    </q-input>

    <q-btn unelevated type="submit" color="accent" label="Login" class="full-width q-py-md" :loading="loading" />
  </q-form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['login'])


const form = ref({
  email: '',
  password: ''
})

const onSubmit = () => {
  emit('login', {
    email: form.value.email.trim(),
    password: form.value.password,
  })
}
</script>
