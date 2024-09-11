<template>
  <!-- <HelloWorld /> -->
  <div class="d-flex flex-column w-100 align-center justify-center">
    <v-img class="mb-4 w-50 mt-16" src="@/assets/Working-on-a-project.svg" />
    <h3 class="">Selamat bekerja {{ session?.name }}</h3>

  </div>
</template>

<script setup>
import { useSessionStore } from '@/stores/app';


const session = useSessionStore()
//
</script>
