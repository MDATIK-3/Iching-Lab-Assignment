<template>
  <div class="row q-col-gutter-sm items-center">
    <div class="col-grow">
      <q-input
        v-model="itemStore.searchQuery"
        outlined
        dense
        clearable
        debounce="300"
        placeholder="Search items..."
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-auto" style="min-width: 150px;">
      <q-select
        v-model="itemStore.categoryFilter"
        :options="categories"
        option-value="value"
        option-label="label"
        dense
        outlined
        emit-value
        map-options
      >
        <template v-slot:prepend>
          <q-icon name="filter_list" />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { useItemStore } from 'src/stores/itemStore'

const itemStore = useItemStore()

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Appetizer', value: 'appetizer' },
  { label: 'Main', value: 'main' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Drink', value: 'drink' }
]
</script>
