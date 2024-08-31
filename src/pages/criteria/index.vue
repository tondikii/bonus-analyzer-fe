<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h2 class="">Data Kriteria</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider />
      <Table :headers="headers" endpoint="/criteria" :onEdit="handleEdit" :dataMapper="dataMapper" />
    </v-sheet>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Bobot', align: 'start', key: 'weight' },
  { title: 'Sub Kriteria', align: 'start', key: 'appraisalsCount' },
]

const dataMapper = (data) => {
  return data.map(e => ({ ...e, appraisalsCount: e?.Appraisals?.length }))
}

const handleCreate = () => {
  router.push('/criteria/create')
}

const handleEdit = (item) => {
  router.push(`/criteria/edit/${item.id}`)
}

//
</script>
