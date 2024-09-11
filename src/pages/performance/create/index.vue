<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="mt-16 pa-4 w-75" border rounded>
      <v-form class="d-flex flex-column" @submit.prevent="submitForm">
        <h2 class="">Buat Laporan Peringkat Karyawan</h2>
        <v-divider class="my-4" />
        <v-text class="mb-1">Periode</v-text>
        <VueDatePicker class="w-25" v-model="month" month-picker :max-date="getDateMinusOneMonth()" />
        <v-divider class="my-4" />
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(employee, idx) in employees" :key="idx" :title="employee?.name">
            <v-expansion-panel-text>
              <v-row dense>
                <v-col cols="4" v-for="(criteria, idx) in criterion" :key="idx">
                  <v-select :items="criteria.Appraisals" v-model="selectedScores[employee.id][criteria.id]"
                    item-title="name" item-value="id"
                    @update:modelValue="handleChangeSelect($event, criteria.Appraisals, employee?.id, criteria?.id)"
                    :label="criteria?.name" required />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-btn :loading="loading" class="mt-2 bg-indigo" text="Submit" type="submit" block elevated
          :disabled="disabledSubmit">
          Submit
        </v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { api } from '@/lib/axios';
import { SwalError, SwalSuccess } from '@/lib/sweetalert2';
import { getDateMinusOneMonth } from '@/utils';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const loading = ref(false);
const month = ref(null);
const employees = ref([]);
const criterion = ref([]);
const selectedScores = ref({});

const resetForm = () => {
  month.value = null;
  loading.value = false
  employees.value = []
  criterion.value = []
  selectedScores.value = {}
};

const disabledSubmit = computed(() => {
  // Check if the month is filled

  if (!month.value) return true;

  // Loop through all employees
  for (const employee of employees.value) {
    // For each employee, loop through all criteria
    for (const criteria of criterion.value) {
      // Check if a score has been selected for each criterion for the current employee
      const selectedScore = selectedScores.value[employee.id]?.[criteria.id];

      // If no score is selected for any criterion, return true (submit is disabled)
      if (!selectedScore) {

        return true;
      }
    }
  }

  // If all conditions are satisfied (month and all criteria for all employees are filled), enable submit (return false)
  return false;
});




const fetchMaster = async (endpoint = '/employee') => {
  try {
    const isFetchEmployee = endpoint === '/employee';
    const { data } = await api.get(`${endpoint}/only`, { params: {withAppraisal: !isFetchEmployee ? true : undefined} });
    if (isFetchEmployee) {
      employees.value = data;
      // Initialize selectedScores based on employees
      employees.value.forEach(employee => {
        selectedScores.value[employee.id] = {};
      });
    } else {
      criterion.value = data?.map(e => {
        return { ...e };
      });
    }
  } catch (err) {
    const msg = err?.response?.data?.error || `Terjadi error tidak diketahui saat mengambil data ${isFetchEmployee ? 'karyawan' : 'kriteria'}.`;
    SwalError(msg);
  }
}

onMounted(() => {
  resetForm();
  fetchMaster();
  fetchMaster('/criteria');
});

const handleChangeSelect = (id = 0, appraisals = [], employeeId, criteriaId) => {
  const appraisal = appraisals.find(e => e?.id === id)
  if (appraisal) {
    selectedScores.value[employeeId][criteriaId] = {
      name: appraisal.name,
      weight: appraisal.weight, // Set the corresponding weight
    };
  }
}

const submitForm = async () => {
  try {
    if (disabledSubmit.value) return;
    loading.value = true;

    const performanceData = {
      period: new Date(`${month.value?.year}-${month.value?.month}-1`),
      performances: employees.value.map(employee => ({
        employeeId: employee.id,
        scores: criterion.value.map(criteria => ({
          criterionId: criteria.id,
          score: selectedScores.value[employee.id][criteria.id]?.weight || 0,
        }))
      }))
    };

    await api.post("/performanceReport", performanceData);

    SwalSuccess(`Berhasil buat Laporan Peringkat Karyawan Periode ${month.value}`);
    router.replace('/performance');
  } catch (err) {
    const msg = err?.response?.data?.error || "Terjadi error tidak diketahui saat membuat laporan peringkat.";
    SwalError(msg);
  } finally {
    loading.value = false;
  }
};
</script>
