<template>
  <q-card flat class="q-pa-lg">
    <div class="text-h5 q-mb-lg">Restaurant Setup</div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="form.name" label="Restaurant Name *" :rules="[val => !!val || 'Required']" />

      <q-input v-model="form.address" label="Address" type="textarea" />

      <q-input v-model="form.phone" label="Phone *" :rules="[val => !!val || 'Required']" />

      <q-file v-model="logoFile" label="Logo" accept="image/*" @update:model-value="handleLogo">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>

      <!-- Branches Management -->
      <div class="q-mb-md">
        <div class="text-h6 q-mb-sm">Branches</div>
        <q-input v-model="newBranch" label="New Branch Name" placeholder="Enter branch name" class="q-mb-md" />
        <q-btn unelevated icon="add" label="Add Branch" color="positive" @click="addBranch" class="q-mr-sm" />

        <div v-if="form.branches.length" class="q-mt-md">
          <q-list bordered>
            <q-item v-for="(branch, index) in form.branches" :key="index" class="q-py-sm">
              <q-item-section>
                <q-item-label>{{ branch }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat icon="edit" color="primary" @click="editBranch(index)" class="q-mr-sm" />
                <q-btn dense flat icon="delete" color="negative" @click="deleteBranch(index)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else class="text-grey q-mt-sm">
          No branches added yet
        </div>
      </div>

      <q-btn unelevated type="submit" label="Save Setup" color="accent" class="q-mt-md" :loading="loading" />
    </q-form>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save'])
const loading = ref(false)
const logoFile = ref(null)
const newBranch = ref('')
const editingIndex = ref(-1)

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

const addBranch = () => {
  if (newBranch.value.trim()) {
    if (editingIndex.value >= 0) {
      form.value.branches[editingIndex.value] = newBranch.value.trim()
      editingIndex.value = -1
    } else {
      form.value.branches.push(newBranch.value.trim())
    }
    newBranch.value = ''
  }
}

const editBranch = (index) => {
  newBranch.value = form.value.branches[index]
  editingIndex.value = index
}

const deleteBranch = (index) => {
  form.value.branches.splice(index, 1)
}

const onSubmit = () => {
  emit('save', form.value)
}
</script>
