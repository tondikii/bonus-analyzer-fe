<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field v-model="nameRef" label="Nama" hide-details required />
    </v-col>

    <v-col cols="12" md="6">
      <v-number-input v-model="weightRef" control-variant="default" label="Bobot" inset :min="0" :max="100" hide-details
        required />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  name: { type: String, default: '' },
  weight: { type: [String, Number], default: '' }
})

const emit = defineEmits(['update:name', 'update:weight']);

const nameRef = ref(props.name);
const weightRef = ref(props.weight);

watch(nameRef, (newName) => emit('update:name', newName));
watch(weightRef, (newWeight) => emit('update:weight', newWeight));

</script>
