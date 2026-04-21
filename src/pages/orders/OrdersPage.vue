<template>
  <q-page class="q-pa-lg">
    <div class="row items-start q-col-gutter-lg">
      <div class="col-12 col-lg-7">
        <div class="text-h4 q-mb-xs">New Order</div>
        <div class="text-subtitle1 text-grey-6 q-mb-md">Create an order from your menu items</div>

        <q-card class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="customerName" label="Customer name (optional)" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="tableNumber" label="Table number (optional)" outlined dense />
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
            <q-btn
              unelevated
              color="accent"
              icon="shopping_cart_checkout"
              label="Create order"
              :disable="total <= 0"
              @click="create"
            />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <div class="text-h5 q-mb-sm">Open Orders</div>
        <q-card>
          <q-list separator>
            <q-item v-for="o in orderStore.openOrders" :key="o.id">
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ o.customerName || 'Walk-in' }}
                  <span v-if="o.tableNumber" class="text-grey-6">• Table {{ o.tableNumber }}</span>
                </q-item-label>
                <q-item-label caption>
                  {{ new Date(o.createdAt).toLocaleString() }} • {{ o.items.length }} item(s) • {{ money(o.total) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat color="positive" icon="paid" label="Pay" @click="pay(o.id)" />
              </q-item-section>
            </q-item>
            <q-item v-if="orderStore.openOrders.length === 0">
              <q-item-section class="text-grey-6">No open orders yet.</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Notify, Dialog } from 'quasar'
import { useItemStore } from 'src/stores/itemStore'
import { useOrderStore } from 'src/stores/orderStore'

const itemStore = useItemStore()
const orderStore = useOrderStore()

const customerName = ref('')
const tableNumber = ref('')
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
    tableNumber: tableNumber.value.trim(),
    items: orderItems,
  })

  customerName.value = ''
  tableNumber.value = ''
  cart.value = {}

  Notify.create({ type: 'positive', message: `Order created (${order.id.slice(0, 8)})` })
}

const pay = (orderId) => {
  Dialog.create({
    title: 'Mark as paid?',
    message: 'This will move the order into Invoices.',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    orderStore.markPaid(orderId)
    Notify.create({ type: 'positive', message: 'Payment recorded' })
  })
}
</script>

