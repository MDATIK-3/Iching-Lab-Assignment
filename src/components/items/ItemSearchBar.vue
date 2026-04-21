<template>
  <q-input v-model="localSearch" outlined dense clearable debounce="300" placeholder="Search items...">
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:append>
      <q-select v-model="categoryFilter" :options="categories" option-value="label" option-label="label" dense outlined
        class="q-mx-sm">
        <template v-slot:prepend>
          <q-icon name="filter_list" />
        </template>
      </q-select>
    </template>
  </q-input>
</template>


<script setup>
import { ref } from 'vue'

defineModel('search')
const categoryFilter = ref('all')
const categories = [
  { label: 'All', value: 'all' },
  { label: 'Appetizer', value: 'appetizer' },
  { label: 'Main', value: 'main' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Drink', value: 'drink' }
]
</script>
