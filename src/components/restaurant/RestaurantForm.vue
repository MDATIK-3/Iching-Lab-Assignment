<template>
  <q-card flat class="q-pa-lg">
    <div class="text-h5 q-mb-lg">Restaurant Setup</div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="form.name" label="Restaurant Name *" :rules="[val => !!val || 'Required']" outlined />

      <q-input v-model="form.address" label="Address" type="textarea" outlined />

      <q-input v-model="form.phone" label="Phone *" :rules="[val => !!val || 'Required']" outlined />

      <q-file v-model="logoFile" label="Logo" accept="image/*" @update:model-value="handleLogo" outlined clearable @clear="form.logo = null">
        <template v-slot:prepend>
          <q-icon name="image" />
        </template>
      </q-file>

      <div class="q-mb-md">
        <div class="text-h6 q-mb-sm">Branches</div>

        <q-input
          v-model="newBranch"
          :label="isEditing ? 'Edit Branch Name' : 'New Branch Name'"
          placeholder="Enter branch name"
          outlined
          @keydown.enter.prevent="addBranch"
        >
          <template v-slot:after>
            <q-btn
              unelevated
              :icon="isEditing ? 'check' : 'add'"
              :label="isEditing ? 'Update' : 'Add'"
              :color="isEditing ? 'primary' : 'positive'"
              @click="addBranch"
              :disable="!newBranch.trim()"
            />
            <q-btn
              v-if="isEditing"
              unelevated
              icon="close"
              color="negative"
              flat
              @click="cancelEdit"
              class="q-ml-sm"
              tooltip="Cancel edit"
            />
          </template>
        </q-input>

        <div v-if="form.branches.length" class="q-mt-md">
          <q-list bordered separator>
            <q-item v-for="(branch, index) in form.branches" :key="index" class="q-py-sm">
              <q-item-section>
                <q-item-label>{{ branch }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="q-gutter-xs">
                  <q-btn dense flat icon="edit" color="primary" @click="editBranch(index)" />
                  <q-btn dense flat icon="delete" color="negative" @click="deleteBranch(index)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else class="text-grey q-mt-sm text-italic">
          No branches added yet
        </div>
      </div>

      <q-btn unelevated type="submit" label="Save Setup" color="accent" size="lg" class="q-mt-lg" :loading="loading" />
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['save'])
const loading = ref(false)
const logoFile = ref(null)
const newBranch = ref('')
const editingIndex = ref(-1)

// Helps UI know if we are currently editing an existing branch
const isEditing = computed(() => editingIndex.value >= 0)

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
  } else {
    form.value.logo = null
  }
}

const addBranch = () => {
  const branchName = newBranch.value.trim()
  if (branchName) {
    if (isEditing.value) {
      form.value.branches[editingIndex.value] = branchName
      editingIndex.value = -1 // reset edit state
    } else {
      // Optional: Prevent duplicate branch names
      if (!form.value.branches.includes(branchName)) {
        form.value.branches.push(branchName)
      }
    }
    newBranch.value = ''
  }
}

const editBranch = (index) => {
  newBranch.value = form.value.branches[index]
  editingIndex.value = index
}

const cancelEdit = () => {
  newBranch.value = ''
  editingIndex.value = -1
}

const deleteBranch = (index) => {
  form.value.branches.splice(index, 1)

  // Safely handle editing state if the user deletes items
  if (editingIndex.value === index) {
    cancelEdit() // Cancel edit if they deleted the currently edited item
  } else if (editingIndex.value > index) {
    editingIndex.value-- // Adjust index to match the array shift
  }
}

const onSubmit = () => {
  emit('save', form.value)
}
</script>
