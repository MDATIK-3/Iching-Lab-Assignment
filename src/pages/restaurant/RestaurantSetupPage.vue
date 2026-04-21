<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-8">
        <RestaurantForm @save="handleSave" />
      </div>
      <div class="col-12 col-md-4">
        <RestaurantInfoCard :restaurant="restaurant" />
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
import { Notify } from 'quasar'

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
</script>
