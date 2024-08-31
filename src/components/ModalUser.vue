<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialogRef" max-width="600">
      <template v-slot:activator="{ props: activatorProps }">
      </template>


      <v-form class="" @submit.prevent="submitForm">
        <v-card prepend-icon="mdi-account" title="Tambah Karyawan">

          <v-card-text>
            <v-text-field label="Nama" v-model="name" required hide-details />

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
  </div>
</template>

<script setup>
import { api } from '@/lib/axios';
import { SwalToast } from '@/lib/sweetalert2';
import { ref, watch } from 'vue';

const props = defineProps({
  dialog: { type: Boolean, default: false },
  employee: { type: [Object, null], default: null },
  callback: { type: Function, default: () => { } }
});

const emit = defineEmits(['update:dialog']);

const dialogRef = ref(props.dialog);
const name = ref(props.name);
const loading = ref(false);

const disabledSubmit = computed(() => {
  return !Boolean(name.value)
});

// Watch props for changes and update refs accordingly
watch(() => props.dialog, (newDialog) => {
  dialogRef.value = newDialog;
});
watch(() => props.employee, (employee) => {
  name.value = employee?.name || '';
});

// Emit changes to parent component
watch(dialogRef, (newDialog) => {
  emit('update:dialog', newDialog)
});

const submitForm = async () => {
  const { employee } = props
  const isEdit = Boolean(employee)
  try {
    if (disabledSubmit.value) return;
    loading.value = true;
    await api[isEdit ? 'put' : 'post'](`/employee${isEdit ? `/${employee.id}` : ''}`, { name: name.value })

    SwalToast({ title: `Berhasil ${isEdit ? 'edit' : 'tambah'} karyawan` })
    props.callback()
  } catch (err) {
    const msg = err?.response?.data?.error || `Terjadi error tidak diketahui`
    SwalToast({ title: msg })
  } finally {
    loading.value = false;
    dialogRef.value = false;
  }
};

</script>