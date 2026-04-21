<template>
  <q-item
    clickable
    :tag="isInternal ? 'router-link' : 'a'"
    :to="isInternal ? props.link : undefined"
    :href="!isInternal ? props.link : undefined"
    :target="!isInternal ? '_blank' : undefined"
    :rel="!isInternal ? 'noopener noreferrer' : undefined"
    :replace="false"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})

const isInternal = computed(() => props.link.startsWith('/'))
</script>
