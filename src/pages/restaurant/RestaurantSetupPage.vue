<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-8">
        <RestaurantForm @save="handleSave" />
      </div>
      <div class="col-12 col-md-4">
        <RestaurantInfoCard :restaurant="restaurant" />
        <q-card v-if="restaurant" flat class="q-mt-md q-pa-md">
          <q-btn unelevated icon="delete" label="Delete Restaurant" color="negative" @click="deleteRestaurant"
            class="full-width" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from 'src/stores/restaurantStore'
import RestaurantForm from 'src/components/restaurant/RestaurantForm.vue'
import RestaurantInfoCard from 'src/components/restaurant/RestaurantInfoCard.vue'
import { Notify, Dialog } from 'quasar'

const router = useRouter()
const restaurantStore = useRestaurantStore()
const restaurant = ref(restaurantStore.restaurant)

const handleSave = (data) => {
  restaurantStore.saveRestaurant(data)
  Notify.create({
    message: 'Restaurant setup complete!',
    color: 'positive'
  })
  router.push('/app/items')
}

const deleteRestaurant = () => {
  Dialog.create({
    title: 'Confirm Delete',
    message: 'Delete this restaurant setup? This cannot be undone.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    restaurantStore.deleteRestaurant()
    Notify.create({
      message: 'Restaurant deleted',
      color: 'negative'
    })
  })
}
</script>
