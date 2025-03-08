<template>
  <v-dialog v-model="dialogRef" max-width="600">
    <template v-slot:activator="{ props: activatorProps }">
    </template>


    <v-form class="" @submit.prevent="submitForm">
      <v-card :prepend-icon="`mdi-${icon}`" :title="`${isEdit ? 'Ubah' : 'Tambah'} ${title}`">

        <v-card-text>
          <v-text-field label="Nama" v-model="name" required hide-details />
          <v-number-input v-model="weight" control-variant="default" label="Bobot" inset :min="0" :max="100"
            hide-details required />
          <v-select v-show="withIsBenefit" :items="benefitCostOptions" v-model="isBenefit" item-title="name"
            item-value="value" @update:modelValue="handleChangeSelect($event)" label="Kategori" required />

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Batal" variant="plain" @click="dialogRef = false" />

          <v-btn color="primary" text="Submit" variant="tonal" :disabled="disabledSubmit" type="submit" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { api } from '@/lib/axios';
import { SwalToast } from '@/lib/sweetalert2';
import { ref, watch } from 'vue';

const props = defineProps({
  dialog: { type: Boolean, default: false },
  data: { type: [Object, null], default: null },
  callback: { type: Function, default: () => { } },
  title: { type: String, default: 'Kriteria' },
  endpoint: {
    type: String,
    default: '/criteria'
  },
  icon: { type: String, default: 'text-box-search-outline' },
  criteriaId: { type: [Number, undefined], default: undefined },
});

const emit = defineEmits(['update:dialog']);

const dialogRef = ref(props.dialog);
const name = ref(props.name);
const weight = ref(props.weight);
const isBenefit = ref(null);
const loading = ref(false);

const withIsBenefit = props.title === 'Kriteria'

const benefitCostOptions = [{ name: 'Benefit', value: true }, { name: 'Cost', value: false }]

const handleChangeSelect = (value) => {
  isBenefit.value = value
}

const resetForm = () => {
  name.value = '';
  weight.value = null
  loading.value = false
};

const disabledSubmit = computed(() => {
  return Boolean(!name.value || !weight.value)
});
const isEdit = computed(() => { return Boolean(props.data) })

// Watch props for changes and update refs accordingly
watch(() => props.dialog, (newDialog) => {
  dialogRef.value = newDialog;
  if (!newDialog) {
    resetForm()
  }
});
watch(() => props.data, (newData) => {
  name.value = newData?.name || '';
  weight.value = newData?.weight || '';
  isBenefit.value = newData?.isBenefit || '';
});

// Emit changes to parent component
watch(dialogRef, (newDialog) => {
  emit('update:dialog', newDialog)
});

const submitForm = async () => {
  const { data } = props

  try {
    if (disabledSubmit.value) return;
    loading.value = true;
    const reqPayload = { name: name.value, weight: weight.value, criteriaId: props.criteriaId }
    if (withIsBenefit) {
      reqPayload.isBenefit = isBenefit.value
    }
    await api[isEdit.value ? 'put' : 'post'](`${props.endpoint}${isEdit.value ? `/${data?.id}` : ''}`, reqPayload)

    SwalToast({ title: `Berhasil ${isEdit.value ? 'edit' : 'tambah'} ${props.title.toLowerCase()}` })
    props.callback()
  } catch (err) {
    const msg = err?.response?.data?.error || `Terjadi error tidak diketahui`
    SwalToast({ title: msg, icon: 'error' })
  } finally {
    loading.value = false;
    dialogRef.value = false;
  }
};

</script>