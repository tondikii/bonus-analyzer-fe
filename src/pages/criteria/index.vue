<template>
  <ModalCriteria v-model:dialog="dialog" :data="selected" :callback="refreshTable" />
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h2 class="">Data Kriteria</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider />
      <Table :headers="headers" endpoint="/criteria" :onEdit="handleEdit" :dataMapper="dataMapper"
        :refreshKey="refreshKey" />
    </v-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Bobot', align: 'start', key: 'weight', sortable: false },
  { title: 'Sub Kriteria', align: 'start', key: 'appraisalsCount', sortable: false },
]

const refreshKey = ref(0);
const dialog = ref(false);
const selected = ref(null);

const resetForm = () => {
  refreshKey.value = 0;
  dialog.value = false
  selected.value = null
};

onMounted(() => {
  resetForm();
});

const refreshTable = () => {
  refreshKey.value += 1; // Incrementing refreshKey to trigger refresh
}

const dataMapper = (data) => {
  return data.map(e => ({ ...e, appraisalsCount: e?.Appraisals?.length }))
}

const handleCreate = () => {
  dialog.value = true
}

const handleEdit = (item) => {
  selected.value = item
  dialog.value = true
}

//
</script>
