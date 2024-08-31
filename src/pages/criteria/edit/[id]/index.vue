<template>
  <div class="d-flex flex-column w-100 align-center">
    <v-sheet class="mt-16 pa-4 w-75" border rounded>
      <v-form class="d-flex flex-column" @submit.prevent="submitForm">
        <h2 class="">Edit Kriteria</h2>
        <v-divider class="my-4" />

        <CriteriaForm v-model:name="name" v-model:weight="weight" />

        <v-divider class="mb-4" />

        <v-row align="center" justify="space-between" class="mb-4 mt-2 px-4">
          <h3 class="">Edit Sub Kriteria</h3>
          <v-btn density="compact" icon="mdi-plus" @click="addSubCriteria" />
        </v-row>

        <!-- Expansion Panels for Sub-Criteria -->
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(sub, idx) in subCriterion" :key="idx" :title="renderTitleSubCriteria(idx, sub)">
            <v-expansion-panel-text>
              <v-row align="center" class="pa-4">
                <CriteriaForm v-model:name="sub.name" v-model:weight="sub.weight" />
                <v-btn density="compact" icon="mdi-delete" @click="confirmRemoveSubCriteria(idx)"
                  :class="`ml-4 ${disabledRemoveSubCriteria ? '' : 'bg-red-lighten-1'}`"
                  :disabled="disabledRemoveSubCriteria">
                </v-btn>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Submit Button -->
        <v-btn :loading="loading" class="mt-4 bg-indigo" text="Submit" type="submit" block elevated
          :disabled="disabledSubmit || loading">
          Submit
        </v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CriteriaForm from '@/components/CriteriaForm.vue';
import { api } from '@/lib/axios';
import { SwalError, SwalConfirm, SwalSuccess } from '@/lib/sweetalert2';

const router = useRouter();
const route = useRoute();

const id = route.params.id;
const name = ref('');
const weight = ref('');
const subCriterion = ref([{ name: '', weight: '' }]);
const loading = ref(false);

// Computed Property for Form Disable State
const disabledSubmit = computed(() => {
  const isMainCriteriaValid = name.value && weight.value > 0;
  const areSubCriterionValid = subCriterion.value.every(sub => sub.name && sub.weight > 0);

  return !(isMainCriteriaValid && areSubCriterionValid);
});

const disabledRemoveSubCriteria = computed(() => subCriterion.value.length === 1)

// Fetch Criterion Data on Mount
onMounted(async () => {
  try {
    resetForm();
    loading.value = true;
    const { data } = await api.get(`/criteria/${id}`);
    name.value = data.name;
    weight.value = data.weight;
    subCriterion.value = data.Appraisals.length ? data.Appraisals : [{ name: '', weight: '' }];

  } catch (err) {
    const msg = err?.response?.data?.error || "Terjadi error tidak diketahui saat mengambil data.";
    SwalError(msg);
    router.replace('/criteria');
  } finally {
    loading.value = false;
  }
});

const resetForm = () => {
  name.value = '';
  weight.value = '';
  subCriterion.value = [{ name: '', weight: '' }];
};

// Methods
const addSubCriteria = () => {
  subCriterion.value.push({ name: '', weight: '' });
};

const confirmRemoveSubCriteria = async (index) => {
  if (subCriterion.value.length > 1) {
    const { isConfirmed } = await SwalConfirm({ title: 'Hapus Sub Kriteria', text: 'Apakah Anda yakin ingin menghapus sub-kriteria ini?' });
    if (isConfirmed) {
      removeSubCriteria(index);
    }
  }
};

const removeSubCriteria = (index) => {
  subCriterion.value.splice(index, 1);
};

const renderTitleSubCriteria = (idx, { name, weight }) => {
  const labelName = name ? `- ${name}` : '';
  const labelWeight = weight ? `- ${weight}` : '';
  return `Sub Kriteria ${idx + 1} ${labelName} ${labelWeight}`;
};

const submitForm = async () => {
  try {
    if (disabledSubmit.value) return;

    loading.value = true;
    await api.put(`/criteria/${id}`, { name: name.value, weight: weight.value, appraisals: subCriterion.value });
    SwalSuccess(`Berhasil mengedit kriteria ${name.value}`);
    router.replace('/criteria');
  } catch (err) {
    const msg = err?.response?.data?.error || "Terjadi error tidak diketahui saat mengedit kriteria.";
    SwalError(msg);
  } finally {
    loading.value = false;
  }
};
</script>
