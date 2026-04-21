<template>
  <q-card flat class="q-pa-lg">
    <div class="text-h5 q-mb-lg">Restaurant Setup</div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="form.name" label="Restaurant Name *" :rules="[val => !!val || 'Required']" />

      <q-input v-model="form.address" label="Address" type="textarea" />

      <q-input v-model="form.phone" label="Phone *" mask="(###) ###-####" :rules="[val => !!val || 'Required']" />

      <q-file v-model="logoFile" label="Logo" accept="image/*" @update:model-value="handleLogo">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>

      <q-chips-input v-model="form.branches" label="Branches" placeholder="Add branch location" />

      <q-btn unelevated type="submit" label="Save Setup" color="accent" class="q-mt-md" :loading="loading" />
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save'])
const loading = ref(false)
const logoFile = ref(null)

const form = ref({
  name: '',
  address: '',
  phone: '',
  logo: null,
  branches: []
})

const handleLogo = async (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.logo = e.target.result // base64
    }
    reader.readAsDataURL(file)
  }
}

const onSubmit = () => {
  emit('save', form.value)
}
</script>
