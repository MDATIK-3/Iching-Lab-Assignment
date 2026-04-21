<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-weight-bold q-mb-sm">Logo Upload</div>

      <q-file
        v-model="file"
        label="Choose logo image"
        accept="image/*"
        outlined
        clearable
        @update:model-value="handleLogoChange"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>

      <q-img
        v-if="logoPreview"
        :src="logoPreview"
        class="q-mt-md rounded-borders"
        style="max-height: 100px; max-width: 200px"
        fit="contain"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['logo-upload'])
const file = ref(null)
const logoPreview = ref(null)

const handleLogoChange = (selectedFile) => {
  if (selectedFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
      emit('logo-upload', logoPreview.value)
    }
    reader.readAsDataURL(selectedFile)
  } else {
    logoPreview.value = null
    emit('logo-upload', null)
  }
}
</script>
