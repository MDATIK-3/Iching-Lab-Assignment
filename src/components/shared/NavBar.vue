<template>
  <div class="row items-center q-gutter-sm">
    <q-btn-dropdown flat color="white" icon="account_circle" label="User">
      <q-list>
        <q-item clickable @click="$emit('logout')">
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <ThemeSwitcher />
  </div>
</template>

<script setup>
import ThemeSwitcher from './ThemeSwitcher.vue'

defineEmits(['logout'])
</script>
