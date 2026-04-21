<template>
  <q-card flat class="q-pa-lg shadow-2">
    <div class="text-h6 q-mb-md text-center text-accent">
      {{ restaurant?.name || 'Your Restaurant' }}
    </div>

    <q-separator class="q-my-md" />

    <div v-if="restaurant?.logo" class="text-center q-mb-lg">
      <q-img :src="restaurant.logo" style="width: 120px; height: 120px" class="rounded-borders" />
    </div>

    <q-list dense bordered>
      <q-item>
        <q-item-section avatar>
          <q-icon name="store" color="accent" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Status</q-item-label>
          <q-item-label :label="status" :class="statusClass" />
        </q-item-section>
      </q-item>

      <q-item v-if="restaurant?.address">
        <q-item-section avatar>
          <q-icon name="location_on" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ restaurant.address }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="restaurant?.phone">
        <q-item-section avatar>
          <q-icon name="phone" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ restaurant.phone }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item v-if="restaurant?.branches?.length" icon="storefront" label="Branches">
        <q-list dense>
          <q-item v-for="branch in restaurant.branches" :key="branch">
            <q-item-section>{{ branch }}</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  restaurant: Object
})

const status = computed(() => {
  return props.restaurant ? '✅ Setup Complete' : '⚠️ Not Configured'
})

const statusClass = computed(() => {
  return props.restaurant ? 'text-positive text-bold' : 'text-warning'
})
</script>
