<template>
  <ModalCriteria v-model:dialog="dialog" :data="selected" :callback="refreshTable" icon="text-search-variant"
    endpoint="/appraisal" :title="`Sub Kriteria ${tab}`" :criteriaId="params?.criteriaId" />
  <div class="d-flex flex-column w-100 align-center">

    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-tabs v-model="tab" bg-color="transparent" color="primary" grow>
        <v-tab v-for="item in tabs" :key="item" :text="item" :value="item" />
      </v-tabs>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h2 class="">Data Sub Kriteria</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider />
      <Table :headers="headers" endpoint="/appraisal" :endpointParams="params" :onEdit="handleEdit"
        :dataMapper="dataMapper" :refreshKey="refreshKey" :prevent="!params?.criteriaId" />
    </v-sheet>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { api } from '@/lib/axios';

const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Bobot', align: 'start', key: 'weight', sortable: false },
]


const tab = ref('')
const tabs = ref([])
const criterion = ref([])
const refreshKey = ref(0);
const dialog = ref(false);
const selected = ref(null);

const resetForm = () => {
  tab.value = '';
  tabs.value = []
  criterion.value = []
  refreshKey.value = 0
};

const refreshTable = () => {
  refreshKey.value += 1; // Incrementing refreshKey to trigger refresh
}

const params = computed(() => {
  const criteriaId = criterion.value.find(e => e?.name === tab.value)?.id
  return { criteriaId }
})

watch(tab, () => {
  refreshTable()
});

const fetchCriteria = async () => {
  try {
    const { data } = await api.get('/criteria/only');
    criterion.value = data
    const criterionLabels = data?.map(e => e?.name);
    tabs.value = criterionLabels
    tab.value = criterionLabels[0]

  } catch (err) {
    const msg = err?.response?.data?.error || `Terjadi error tidak diketahui saat mengambil data ${isFetchEmployee ? 'karyawan' : 'kriteria'}.`;
    SwalError(msg);
  }
}

onMounted(() => {
  resetForm();
  fetchCriteria();
});


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
