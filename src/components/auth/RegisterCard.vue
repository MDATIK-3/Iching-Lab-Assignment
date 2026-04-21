<template>
  <q-dialog v-model="localShow" persistent>
    <q-card class="max-w-md">
      <q-card-section class="bg-accent text-white">
        <div class="text-h6">Create Account</div>
      </q-card-section>

      <q-card-section>
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-sm">
          <q-input v-model="form.name" label="Full Name *" :rules="[val => !!val || 'Name required']" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input v-model="form.email" type="email" label="Email *"
            :rules="[val => !!val || 'Email required', val => /.+@.+\..+/.test(val) || 'Invalid email']" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input v-model="form.password" type="password" label="Password *"
            :rules="[val => !!val || 'Password required', val => val.length >= 6 || 'Min 6 chars']" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input v-model="form.phone" label="Phone" mask="(###) ###-####" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="phone" />
            </template>
          </q-input>

          <div class="q-gutter-sm row items-center">
            <q-btn flat label="Cancel" @click="localShow = false" />
            <q-space />
            <q-btn unelevated type="submit" color="accent" label="Register" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['register', 'update:show'])
const props = defineProps({
  show: Boolean,
  loading: Boolean
})

const localShow = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  email: '',
  password: '',
  phone: ''
})

watch(() => props.show, (val) => {
  localShow.value = val
  if (!val) form.value = { name: '', email: '', password: '', phone: '' }
})

watch(localShow, (val) => {
  if (val !== props.show) emit('update:show', val)
  if (!val) form.value = { name: '', email: '', password: '', phone: '' }
})

const onSubmit = async () => {
  const ok = await formRef.value?.validate?.()
  if (ok === false) return

  emit('register', {
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    password: form.value.password,
    phone: form.value.phone,
  })
  localShow.value = false
}
</script>
