<template>
  <v-data-table-server :items-per-page="itemsPerPage" :headers="tableHeaders" :items="items" :items-length="totalItems"
    :loading="loading" item-value="name" @update:options="loadItems">
    <template v-slot:top>
      <v-text-field v-show="Boolean(searchLabel)" v-model="search" :label="searchLabel" @input="onSearch"
        clearable></v-text-field>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-btn v-show="!noEdit" icon @click="onEdit(item)" color="warning">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn v-show="downloadAble" icon @click="onDownload(item)" color="primary">
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn icon color="red" @click="deleteItem(item)" class="ml-2">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script>
import { debounce } from 'lodash';
import { api } from '@/lib/axios';
import { SwalConfirm, SwalSuccess, SwalError } from '@/lib/sweetalert2';

export default {
  name: "Table",
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    searchLabel: {
      type: String,
      default: '',
    },
    onEdit: {
      type: Function,
      default: () => { }
    },
    onDownload: {
      type: Function,
      default: () => { }
    },
    dataMapper: {
      type: [Function, null],
      default: null
    },
    refreshKey: {
      type: String,
      default: ''
    },
    noEdit: {
      type: Boolean,
      default: false
    },
    downloadAble: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      search: '',
      items: [],
      loading: true,
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
    };
  },
  watch: {
    refreshKey() {
      this.loadItems({ page: this.currentPage, itemsPerPage: this.itemsPerPage });
    },
  },
  computed: {
    tableHeaders() {
      return [
        { title: 'No', align: 'center', sortable: false, key: 'no' },
        ...this.headers,
        { title: 'Actions', align: 'center', sortable: false, key: 'actions' },
      ];
    },
  },
  created() {
    // Debounce the search function to avoid excessive API calls
    this.debouncedLoadItems = debounce(this.loadItems, 500);
  },
  methods: {
    onSearch() {
      // Trigger the debounced search function
      this.debouncedLoadItems({ page: 1, itemsPerPage: this.itemsPerPage });
    },
    async loadItems({ page = 1, itemsPerPage = 10 }) {
      try {
        this.loading = true;
        this.currentPage = page;
        this.itemsPerPage = itemsPerPage;
        const params = {
          page,
          limit: itemsPerPage,
          search: this.search,
        };
        const { data } = await api.get(this.endpoint, { params });

        let rows = data?.rows || [];
        const startNo = (page - 1) * itemsPerPage + 1;

        if (this.dataMapper) {
          rows = this.dataMapper(rows);
        }
        this.items = rows.map((e, idx) => ({ no: startNo + idx, ...e }));
        this.totalItems = data.count || 0;
      } catch (err) {
        SwalError("Terjadi kesalahan tidak diketahui saat memuat data");
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(item) {
      const { isConfirmed } = await SwalConfirm({ title: 'Hapus data', text: `Apakah Anda yakin ingin menghapus ${item.name || 'data'}?` });
      if (isConfirmed) {
        await api.delete(`${this.endpoint}/${item.id}`);
        SwalSuccess(`Berhasil menghapus ${item.name || 'data'}`);
        this.loadItems({ page: this.currentPage, itemsPerPage: this.itemsPerPage });
      }
    },
  },
};
</script>
