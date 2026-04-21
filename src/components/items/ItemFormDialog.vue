<template>
  <q-dialog v-model="localShow">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section>
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-sm">
          <q-input v-model="localItem.name" label="Name *" :rules="[val => !!val || 'Required']" />

          <q-select v-model="localItem.category" :options="categories" label="Category *" option-label="label"
            option-value="value" :rules="[val => !!val || 'Required']" use-input />

          <q-input v-model.number="localItem.price" type="number" label="Price (BDT) *" prefix="৳"
            :rules="[val => val > 0 || 'Price > 0']" />

          <q-input v-model="localItem.description" label="Description" type="textarea" />

          <div class="row items-center justify-end q-gutter-sm">
            <q-btn flat label="Cancel" @click="localShow = false" />
            <q-btn unelevated color="accent" type="submit" label="Save" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  item: Object
})

const emit = defineEmits(['save', 'update:show'])
const localShow = ref(false)
const formRef = ref(null)
const localItem = ref({
  name: '',
  category: '',
  price: 0,
  description: ''
})

const categories = [
  { label: 'Appetizer', value: 'appetizer' },
  { label: 'Main', value: 'main' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Drink', value: 'drink' }
]

watch(() => props.show, (val) => {
  localShow.value = val
  if (val && props.item) {
    localItem.value = { ...props.item }
  } else {
    localItem.value = { name: '', category: '', price: 0, description: '' }
  }
})

watch(localShow, (val) => {
  if (val !== props.show) emit('update:show', val)
  if (!val) formRef.value?.resetValidation?.()
})

const onSubmit = async () => {
  const ok = await formRef.value?.validate?.()
  if (ok === false) return

  emit('save', {
    name: String(localItem.value.name || '').trim(),
    category: localItem.value.category?.value || localItem.value.category,
    price: Number(localItem.value.price) || 0,
    description: String(localItem.value.description || '').trim(),
  })
  localShow.value = false
}
</script>
