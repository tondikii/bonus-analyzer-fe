<template>
  <v-data-table-server :items-per-page="itemsPerPage" :headers="tableHeaders" :items="items" :items-length="totalItems"
    :loading="loading" item-value="name" @update:options="loadItems">
    <template v-slot:top>
      <v-text-field v-show="Boolean(searchLabel)" v-model="search" :label="searchLabel" @input="onSearch"
        clearable></v-text-field>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn v-show="!props.noEdit" icon @click="props.onEdit(item)" class="mx-1" color="warning">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn v-show="props.downloadAble" icon @click="props.onDownload(item)" class="mx-1" color="primary">
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn v-show="props.printAble" icon @click="props.onPrint(item)" class="mx-1" color="primary">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-btn icon class="mx-1" color="red" @click="deleteItem(item)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash';
import { api } from '@/lib/axios';
import { SwalConfirm, SwalSuccess, SwalError } from '@/lib/sweetalert2';
import { useAppStore } from '@/stores/app';

const props = defineProps({
  endpoint: { type: String, required: true },
  headers: { type: Array, required: true },
  searchLabel: { type: String, default: '' },
  onEdit: { type: Function, default: () => { } },
  onDownload: { type: Function, default: () => { } },
  onPrint: { type: Function, default: () => { } },
  dataMapper: { type: Function, default: null },
  refreshKey: { type: String, default: '' },
  noEdit: { type: Boolean, default: false },
  downloadAble: { type: Boolean, default: false },
  printAble: { type: Boolean, default: false },
  endpointParams: { type: Object, default: () => ({}) },
  prevent: { type: Boolean, default: false }
});

const appStore = useAppStore()

const search = ref('');
const items = ref([]);
const loading = ref(true);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const currentPage = ref(1);

const tableHeaders = computed(() => [
  { title: 'No', align: 'center', sortable: false, key: 'no' },
  ...props.headers,
  { title: 'Actions', align: 'center', sortable: false, key: 'actions' },
]);

const loadItems = async ({ page = 1, itemsPerPage: itemsPerPageParam = 10 } = {}) => {
  try {
    if (props.prevent) return;
    loading.value = true;
    currentPage.value = page;
    itemsPerPage.value = itemsPerPageParam;
    const params = {
      page,
      limit: itemsPerPageParam,
      search: search.value,
      ...props.endpointParams
    };
    const { data } = await api.get(props.endpoint, { params });

    let rows = data?.rows || [];
    const startNo = (page - 1) * itemsPerPageParam + 1;

    if (props.dataMapper) {
      rows = props.dataMapper(rows);
    }
    const mappedRows = rows.map((e, idx) => ({ no: startNo + idx, ...e }));
    items.value = mappedRows
    appStore.setTable(mappedRows)
    totalItems.value = data.count || 0;
  } catch (err) {
    SwalError("Terjadi kesalahan tidak diketahui saat memuat data");
  } finally {
    loading.value = false;
  }
};

const debouncedLoadItems = debounce(loadItems, 500);

const onSearch = () => {
  debouncedLoadItems({ page: 1, itemsPerPage: itemsPerPage.value });
};

const deleteItem = async (item) => {
  const { isConfirmed } = await SwalConfirm({
    title: 'Hapus data',
    text: `Apakah Anda yakin ingin menghapus ${item.name || 'data'}?`
  });
  if (isConfirmed) {
    await api.delete(`${props.endpoint}/${item.id}`);
    SwalSuccess(`Berhasil menghapus ${item.name || 'data'}`);
    loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
  }
};

watch(() => props.refreshKey, () => {
  loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
});

onMounted(() => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
});

onUnmounted(() => {
  appStore.setTable([])
})
</script>