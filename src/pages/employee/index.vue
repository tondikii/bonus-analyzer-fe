<template>
  <ModalUser v-model:dialog="dialog" :employee="selectedEmployee" :callback="refreshTable" />
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="my-1 px-4">
        <h2 class="">Data Karyawan</h2>
        <div class="d-flex flex-row">
          <v-btn icon="mdi-printer" color="primary mr-4" @click="handlePrint" />
          <v-btn icon="mdi-plus" @click="handleCreate" />
        </div>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <Table :headers="headers" endpoint="/employee" search-label="Cari nama karyawan" :onEdit="handleEdit"
        :refreshKey="refreshKey" />
    </v-sheet>
  </div>
</template>

<script setup>
import { useAppStore, useSessionStore } from '@/stores/app';
import { ref, watch } from 'vue';


const headers = [
  { title: 'Nama', align: 'start', sortable: false, key: 'name' },
  { title: 'Id Karyawan', align: 'start', key: 'identityNumber', sortable: false },
]

const appStore = useAppStore()
const session = useSessionStore()

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

watch(() => appStore.table, (dataTable) => {
  console.log({ dataTable });
});

const handlePrint = () => {
  const data = appStore.table
  const newDate = new Date()
  const month = newDate.getMonth() + 1;
  const title = `Daftar_Karyawan_${newDate.getUTCFullYear()}_${month.toString().padStart(2, "0")}`;
  const date = `Jakarta, ${newDate.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
  console.log({ data, title, date });


  const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Karyawan</th>
            <th>Id Karyawan</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${row?.name}</td>
              <td>${row?.id}</td>
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
          <h1>Daftar Karyawan</h1>
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
