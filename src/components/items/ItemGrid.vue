<template>
  <div class="row q-gutter-md">
    <ItemCard v-for="item in items" :key="item.id" :item="item" @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)" />

    <q-card v-if="items.length === 0" class="col-12 col-md-8 col-lg-6 full-height">
      <q-card-section class="text-center text-grey-5">
        <q-icon name="menu" size="5rem" class="q-mb-lg" />
        <div class="text-h6">No items yet</div>
        <div class="text-body2">Add your first menu item to get started</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineProps({
  items: Array
})
defineEmits(['edit', 'delete'])
</script>
