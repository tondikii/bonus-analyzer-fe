<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h3 class="">Data Kriteria</h3>
        <v-btn density="compact" icon="mdi-plus" @click="handleCreate"></v-btn>
      </v-row>
      <v-divider></v-divider>
      <Table :headers="headers" endpoint="/criteria" />
    </v-sheet>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Bobot', align: 'start', key: 'weight' },
]

const handleCreate = () => {
  router.push('/criterion/create')
}

//
</script>
