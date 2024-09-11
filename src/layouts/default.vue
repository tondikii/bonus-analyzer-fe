<!-- src/layouts/default.vue -->
<template>
  <v-app>
    <v-main class="d-flex flex-row">
      <Sidebar v-if="isAuthenticated" :session="session" v-model:rail="rail" />
      <div :class="styles.container" :is-expanded="rail || !isAuthenticated">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import styles from './styles.module.scss'
import { useSessionStore } from '@/stores/app';
import { computed, ref, watch } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

const session = useSessionStore()

const rail = ref(true)

const isAuthenticated = computed(() => session.isAuthenticated)
</script>
