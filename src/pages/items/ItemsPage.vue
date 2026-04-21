<template>
  <q-page class="q-pa-lg">
    <div class="row q-gutter-md q-mb-lg">
      <div class="col">
        <div class="text-h4">Menu Items</div>
        <div class="text-subtitle1 text-grey-5">{{ itemStore.filteredItems.length }} items</div>
      </div>
      <div class="col-auto">
        <q-btn unelevated icon="add" label="New Item" color="accent" @click="showAddDialog = true" />
      </div>
    </div>

    <ItemSearchBar v-model:search="itemStore.searchQuery" />

    <div class="row q-gutter-md">
      <ItemCard v-for="item in itemStore.filteredItems" :key="item.id" :item="item"
        @edit="showEditDialog = true; editingItem = item" @delete="handleDelete" />
    </div>

    <ItemFormDialog v-model:show="showAddDialog" title="Add New Item" @save="handleSave" />

    <ItemFormDialog v-model:show="showEditDialog" title="Edit Item" :item="editingItem" @save="handleUpdate" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useItemStore } from 'src/stores/itemStore'
import ItemSearchBar from 'src/components/items/ItemSearchBar.vue'
import ItemCard from 'src/components/items/ItemCard.vue'
import ItemFormDialog from 'src/components/items/ItemFormDialog.vue'
import { Notify, Dialog } from 'quasar'

const itemStore = useItemStore()
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingItem = ref(null)

const handleSave = (data) => {
  itemStore.addItem(data)
  Notify.create({ type: 'positive', message: 'Item added' })
  showAddDialog.value = false
}

const handleUpdate = (data) => {
  itemStore.updateItem(editingItem.value.id, data)
  Notify.create({ type: 'positive', message: 'Item updated' })
  showEditDialog.value = false
  editingItem.value = null
}

const handleDelete = (item) => {
  Dialog.create({
    message: `Delete ${item.name}?`
  }).onOk(() => {
    itemStore.deleteItem(item.id)
    Notify.create({ type: 'positive', message: 'Item deleted' })
  })
}
</script>
