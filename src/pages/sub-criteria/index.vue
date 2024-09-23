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
        <div class="d-flex flex-row">
          <v-btn icon="mdi-printer" color="primary mr-4" @click="handlePrint" />
          <v-btn icon="mdi-plus" @click="handleCreate" />
        </div>
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
import { useAppStore, useSessionStore } from '@/stores/app';

const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Bobot', align: 'start', key: 'weight', sortable: false },
]

const appStore = useAppStore()
const session = useSessionStore()

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


const handlePrint = () => {
  const data = appStore.table
  const newDate = new Date()
  const month = newDate.getMonth() + 1;
  const title = `Daftar_Sub_Kriteria_${tab.value}_${newDate.getUTCFullYear()}_${month.toString().padStart(2, "0")}`;
  const date = `Jakarta, ${newDate.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;


  const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Bobot</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${row?.name}</td>
              <td>${row?.weight}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

  // Create a new window with the HTML content
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 20px;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 5px;
            }
            h1 { 
              font-size: 22px;
              font-weight: bold;
            }
            h2 {
              font-size: 18px;
              font-weight: normal;
            }
            .companyName{
              font-weight: bold;
              font-size: 28px !important;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin-bottom: 20px;
              font-size: 14px;
            }
            th, td { 
              border: 1px solid black; 
              padding: 8px; 
              text-align: left; 
            }
            th {
              background-color: #f2f2f2;
            }
            .signature {
              margin-top: 50px;
              text-align: right;
              margin-right: 30px;
            }
            .signature div {
              margin-bottom: 0px; /* Remove margin to reduce space */
            }
            .signature-line {
              margin: 0; /* Adjust margin for the line */
              margin-top: 50px !important;
              text-align: right; /* Align the signature line to the right */
              margin-bottom: 0px; /* Reduce space above signature line */
            }
            .signature-title {
              margin-top: 5px; /* Reduce the space between the line and "HRD Perusahaan" */
              text-align: right; /* Align the HRD Perusahaan title to the right */
            }
            .admin-printed {
              font-style: italic;
              text-align: right;
              margin-top: 40px;
              margin-right: 30px;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact; 
              }
            }
          </style>
        </head>
        <body>
          <h1>Daftar Sub Kriteria ${tab.value}</h1>
          <h2 class="companyName">Wejaya Food</h2>

          ${tableHtml}

           <div class="signature">
            <div>${date}</div>
            <div class="signature-line">_________________</div>
            <div class="signature-title">${session?.name}</div>
          </div>

          <footer>
            <div class="admin-printed">dicetak oleh <b>${session?.name}</b></div>
          </footer>
        </body>
      </html>
    `);
  printWindow.document.close();

  // Wait for content to load before printing
  printWindow.onload = function () {
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };
}

</script>
