<template>
  <q-card class="col-12 col-md-6 col-lg-4 q-pa-sm">
    <q-card-section class="q-pb-none">
      <div class="row items-center q-mb-sm">
        <div class="col-auto">
          <q-badge :color="categoryColor(item.category)" class="text-caption">
            {{ item.category }}
          </q-badge>
        </div>
        <div class="col">
          <div class="text-h6 ellipsis-2-lines">{{ item.name }}</div>
        </div>
        <div class="col-auto">
          <q-btn-dropdown flat round dense icon="more_vert">
            <q-list>
              <q-item clickable @click="emit('edit', item)">
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item clickable @click="emit('delete', item)">
                <q-item-section color="negative">Delete</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-py-sm">
      <div class="text-primary text-h5">{{ money(item.price) }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  item: Object
})

const emit = defineEmits(['edit', 'delete'])

const money = (n) =>
  new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(
    Number(n) || 0,
  )

const categoryColor = (category) => {
  const colors = {
    'appetizer': 'orange',
    'main': 'primary',
    'dessert': 'pink',
    'drink': 'blue'
  }
  return colors[category.toLowerCase()] || 'grey'
}
</script>
