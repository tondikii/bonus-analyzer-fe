<template>
  <div class="d-flex justify-center align-center h-screen w-screen">
    <v-sheet class="w-33 d-flex align-center flex-column" rounded>
      <h2 class="mb-4">Masuk</h2>

      <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit" class="w-100">
        <v-text-field v-model="email" :rules="emailRules" label="Alamat Email" required></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"
          required></v-text-field>

        <v-btn :loading="loading" class="mt-2 bg-indigo" text="Submit" type="submit" block elevated
          :disabled="disabled"></v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/axios'
import { SwalError, SwalSuccess } from '@/lib/sweetalert2'
import { useSessionStore } from '@/stores/app'

const session = useSessionStore()

// State
const loading = ref(false)
const password = ref('')
const email = ref('')

// Validation rules
const passwordRules = [
  value => {
    if (value?.length > 6) {
      return true
    }
    return 'Password minimal 6 karakter.'
  }
]

const emailRules = [
  value => {
    if (/.+@.+\..+/.test(value)) {
      return true
    }
    return 'Format email tidak sesuai.'
  }
]

// Computed property for form disable state
const disabled = computed(() => !email.value || !password.value)

// Router
const router = useRouter()

// Methods
async function submit() {
  try {
    loading.value = true
    // Assuming the form is already validated through some means

    const { data } = await api.post("/user/sign-in", { email: email.value, password: password.value })
    session.setSession(data)
    SwalSuccess("Login successfully, welcome to BonusAnalyzer")
    router.push('/')
  } catch (err) {
    const msg = err?.response?.data?.error || "Unknown error occurred."
    SwalError(msg)
  } finally {
    loading.value = false
  }
}
</script>
