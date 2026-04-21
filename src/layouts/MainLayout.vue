<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>Restaurant POS</q-toolbar-title>

        <q-space />

        <NavBar @logout="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above width="240">
      <q-list>
        <q-item-label header class="text-grey-4">Navigation</q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <AppFooter />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import EssentialLink from 'src/components/EssentialLink.vue'
import NavBar from 'src/components/shared/NavBar.vue'
import AppFooter from 'src/components/shared/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

const essentialLinks = [
  { title: 'Restaurant', caption: 'Setup & Info', icon: 'store', link: '/app/restaurant' },
  { title: 'Items', caption: 'Menu Items', icon: 'restaurant_menu', link: '/app/items' },
  { title: 'Orders', caption: 'New Orders', icon: 'shopping_cart', link: '/app/orders' },
  { title: 'Invoices', caption: 'Order History', icon: 'receipt_long', link: '/app/invoices' },
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
