<template>
  <q-page class="q-pa-lg">
    <div class="row items-start q-col-gutter-lg">
      <div class="col-12">
        <div class="text-h4 q-mb-xs">New Order</div>
        <div class="text-subtitle1 text-grey-6 q-mb-md">Create an order from your menu items</div>

        <q-card class="q-pa-md">
          <q-form @submit="create" class="q-gutter-md">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <q-input v-model="customerName" label="Customer Name *" outlined dense
                  :rules="[val => !!val || 'Customer name is required']" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="phoneNumber" label="Phone Number *" outlined dense
                  :rules="[val => !!val || 'Phone number is required']" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="tableNumber" label="Table Number *" outlined dense
                  :rules="[val => !!val || 'Table number is required']" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="seatNumber" label="Seat Number *" outlined dense
                  :rules="[val => !!val || 'Seat number is required']" />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row items-center q-gutter-sm q-mb-sm">
              <div class="text-subtitle2">Add items</div>
              <q-space />
              <q-input v-model="search" outlined dense placeholder="Search menu..." style="max-width: 280px" />
            </div>

            <q-list bordered separator>
              <q-item v-for="it in visibleItems" :key="it.id">
                <q-item-section>
                  <q-item-label>{{ it.name }}</q-item-label>
                  <q-item-label caption>{{ it.category }} • {{ money(it.price) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-btn dense round flat icon="remove" @click="dec(it)" />
                    <div style="min-width: 24px" class="text-center">{{ qtyFor(it.id) }}</div>
                    <q-btn dense round flat icon="add" @click="inc(it)" />
                  </div>
                </q-item-section>
              </q-item>
              <q-item v-if="visibleItems.length === 0">
                <q-item-section class="text-grey-6">No items found. Add items in the Items page first.</q-item-section>
              </q-item>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="row items-center">
              <div class="text-subtitle1 text-weight-medium">Total: {{ money(total) }}</div>
              <q-space />
              <q-btn unelevated type="submit" color="accent" icon="shopping_cart_checkout" label="Create order"
                :disable="total <= 0" />
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { useItemStore } from 'src/stores/itemStore'
import { useOrderStore } from 'src/stores/orderStore'

const itemStore = useItemStore()
const orderStore = useOrderStore()

const customerName = ref('')
const phoneNumber = ref('')
const tableNumber = ref('')
const seatNumber = ref('')
const search = ref('')
const cart = ref({})

const visibleItems = computed(() => {
  const items = itemStore.items || []
  const q = search.value.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (i) =>
      i.name?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      String(i.price ?? '').includes(q),
  )
})

const qtyFor = (itemId) => cart.value[itemId] || 0

const inc = (it) => {
  cart.value = { ...cart.value, [it.id]: (cart.value[it.id] || 0) + 1 }
}

const dec = (it) => {
  const next = (cart.value[it.id] || 0) - 1
  const updated = { ...cart.value }
  if (next <= 0) delete updated[it.id]
  else updated[it.id] = next
  cart.value = updated
}

const total = computed(() => {
  const itemsById = new Map((itemStore.items || []).map((i) => [i.id, i]))
  return Object.entries(cart.value).reduce((sum, [id, qty]) => {
    const it = itemsById.get(id)
    if (!it) return sum
    return sum + (Number(it.price) || 0) * Number(qty || 0)
  }, 0)
})

const money = (n) =>
  new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(
    Number(n) || 0,
  )

const router = useRouter()

const create = () => {
  const itemsById = new Map((itemStore.items || []).map((i) => [i.id, i]))
  const orderItems = Object.entries(cart.value)
    .map(([id, qty]) => {
      const it = itemsById.get(id)
      if (!it) return null
      return { itemId: it.id, name: it.name, price: it.price, qty }
    })
    .filter(Boolean)

  const order = orderStore.createOrder({
    customerName: customerName.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    tableNumber: tableNumber.value.trim(),
    seatNumber: seatNumber.value.trim(),
    items: orderItems,
  })

  customerName.value = ''
  phoneNumber.value = ''
  tableNumber.value = ''
  seatNumber.value = ''
  cart.value = {}

  Notify.create({ type: 'positive', message: `Order created (${order.id.slice(0, 8)})` })
  router.push('/app/invoices')
}


</script>
