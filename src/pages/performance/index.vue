<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h2 class="">Data Laporan Peringkat Karyawan</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider />
      <Table :headers="headers" endpoint="/performanceReport" :downloadAble="true" :onDownload="handleDownload"
        :dataMapper="dataMapper" :noEdit="true" />
    </v-sheet>
  </div>
</template>

<script setup>
import { api } from '@/lib/axios';
import { SwalError } from '@/lib/sweetalert2';
import { useRouter } from 'vue-router';
import { useDate } from 'vuetify';

const router = useRouter()
const date = useDate()

const headers = [
  { title: 'Periode', align: 'start', sortable: false, key: 'periodLabel' },
]

const dataMapper = (data) => {
  const newData = data.map(e => ({ ...e, appraisalsCount: e?.Appraisals?.length, periodLabel: date.format(e?.period, 'monthAndYear') }))
  return newData
}

const handleCreate = () => {
  router.push('/performance/create')
}

const handleDownload = async (item) => {
  try {
    const { data } = await api.get(`/performanceReport/download/${item?.id}`, {
      headers: { 'Content-Type': 'text/csv' },
      responseType: 'blob'
    });

    const datePeriod = new Date(item?.period)
    const monthPeriod = datePeriod.getMonth() + 1;
    const fileName = `performance_report_${datePeriod.getUTCFullYear()}_${monthPeriod
      .toString()
      .padStart(2, "0")}.csv`;

    // Create a new Blob URL
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Set file name
    document.body.appendChild(link);
    link.click();

    // Clean up after the download
    document.body.removeChild(link);
  } catch (err) {
    const msg = err?.response?.data?.error || `Terjadi error tidak diketahui saat mengunduh periode ${item?.period}.`;
    SwalError(msg)
  }
}

//
</script>
