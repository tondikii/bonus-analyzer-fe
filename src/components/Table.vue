<template>
  <v-data-table-server v-model:items-per-page="itemsPerPage"
    :headers="[{ title: 'No', align: 'center', sortable: false, key: 'no' }, ...headers]" :items="items"
    :items-length="totalItems" :loading="loading" item-value="name" @update:options="loadItems">
    <template v-slot:top>
      <v-text-field v-show="Boolean(searchLabel)" v-model="search" class="" :label="searchLabel"></v-text-field>
    </template>
  </v-data-table-server>
</template>

<script>
import { api } from '@/lib/axios';

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
  },
  data() {
    return {
      search: '',
      items: [],
      loading: true,
      totalItems: 0,
      itemsPerPage: 5,
    };
  },
  methods: {
    async loadItems({ page, itemsPerPage, sortBy }) {
      try {
        this.loading = true;
        const params = {
          page,
          limit: itemsPerPage,
          search: this.search,
        };
        const { data } = await api.get(this.endpoint, { params });
        this.items = data.rows.map((e, idx) => ({ no: idx + 1, ...e }));
        this.totalItems = data.count;
      } catch (err) {
        console.log(err);
        SwalError("Unknown error occurred.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
