<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="d-flex flex-column w-75 mt-16 pa-4" border rounded>
      <v-row align="center" justify="space-between" class="mb-4 mt-1 px-4">
        <h2 class="">Data Laporan Performa Karyawan</h2>
        <v-btn icon="mdi-plus" @click="handleCreate" />
      </v-row>
      <v-divider />
      <Table :headers="headers" endpoint="/performanceReport" :downloadAble="true" :onDownload="handleDownload"
        :printAble="true" :onPrint="handlePrint" :dataMapper="dataMapper" :noEdit="true" />
    </v-sheet>
  </div>
</template>

<script setup>
import { api } from '@/lib/axios';
import { SwalError } from '@/lib/sweetalert2';
import { useSessionStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import { useDate } from 'vuetify';

const headers = [
  { title: 'Periode', align: 'start', sortable: false, key: 'periodLabel' },
]

const router = useRouter()
const date = useDate()

const session = useSessionStore()

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

const handlePrint = async (item) => {
  try {
    const { data } = await api.get(`/performanceReport/download/${item?.id}`, {
      headers: { 'Content-Type': 'text/csv' },
      responseType: 'text'
    });

    const datePeriod = new Date(item?.period);
    const monthPeriod = datePeriod.getMonth() + 1;
    const reportTitle = `Performance Report ${datePeriod.getUTCFullYear()}_${monthPeriod.toString().padStart(2, "0")}`;
    const reportDate = `Jakarta, ${datePeriod.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;

    // Convert CSV to HTML table
    const rows = data.split('\n').map(row => row.split(','));
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Karyawan</th>
            <th>Hasil</th>
            <th>Periode</th>
          </tr>
        </thead>
        <tbody>
          ${rows.slice(1).map((row, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${row[1].replace(/['"]/g, '')}</td>
              <td>${row[2]}</td>
              <td>${row[3].replace(/['"]/g, '')}</td>
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
          <title>${reportTitle}</title>
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
          <h1>Laporan Peringkat Performa Karyawan</h1>
          <h2 class="companyName">Wejaya Food</h2>

          ${tableHtml}

           <div class="signature">
            <div>${reportDate}</div>
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
  } catch (error) {
    console.error('Error printing report:', error);
    SwalError("Gagal print laporan peringkat karyawan")
  }
}


//
</script>
