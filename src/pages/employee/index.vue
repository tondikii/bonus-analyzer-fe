<template>
  <ModalUser v-model:dialog="dialog" :employee="selectedEmployee" :callback="refreshTable" />
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="my-1 px-4">
        <h2 class="">Data Karyawan</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider class="my-4"></v-divider>
      <Table :headers="headers" endpoint="/employee" search-label="Cari nama karyawan" :onEdit="handleEdit"
        :refreshKey="refreshKey" />
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';


const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Id Karyawan', align: 'start', key: 'identityNumber', sortable: false },
]

const dialog = ref(false);
const selectedEmployee = ref(null);
const refreshKey = ref(0);

const refreshTable = () => {
  refreshKey.value += 1; // Incrementing refreshKey to trigger refresh
}

const handleCreate = () => {
  dialog.value = true
}

const handleEdit = (item) => {
  selectedEmployee.value = item
  dialog.value = true
}

</script>
