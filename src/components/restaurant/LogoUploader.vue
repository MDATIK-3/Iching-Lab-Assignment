<template>
  <q-card flat>
    <q-card-section>
      <div class="text-weight-bold q-mb-sm">Logo Upload</div>
      <q-file v-model="file" label="Choose logo image" accept="image/*" @update:model-value="uploadLogo">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>
      <q-img v-if="logoPreview" :src="logoPreview" class="q-mt-md rounded" style="max-height: 100px" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['logo-upload'])
const file = ref(null)
const logoPreview = ref('')

const uploadLogo = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      logoPreview.value = e.target.result
      emit('logo-upload', logoPreview.value)
    }
    reader.readAsDataURL(file)
  }
}
</script>
