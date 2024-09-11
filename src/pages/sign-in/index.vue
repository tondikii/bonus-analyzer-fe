<template>
  <div class="d-flex justify-center align-center h-screen w-screen">
    <v-sheet class="w-33 d-flex align-center flex-column" rounded>
      <h2 class="mb-4">Masuk</h2>

      <v-form validate-on="submit lazy" @submit.prevent="submit" class="w-100">
        <v-text-field v-model="email" :rules="emailRules" label="Alamat Email" required></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" label="Password" :type="visible ? 'text' : 'password'"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="visible = !visible"
          required></v-text-field>

        <v-btn :loading="loading" class="mt-2 bg-indigo" text="Submit" type="submit" block elevated
          :disabled="disabled"></v-btn>
      </v-form>

      <small class="text-grey-darken-1 mt-8">
        © Wejaya Food {{ new Date().getFullYear() }}
      </small>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/axios'
import { SwalError, SwalSuccess } from '@/lib/sweetalert2'
import { useSessionStore } from '@/stores/app'
import { validateEmail, validatePassword } from '@/utils'

const session = useSessionStore()

// State
const loading = ref(false)
const password = ref('')
const email = ref('')
const visible = ref(false)

// Validation rules
const passwordRules = [
  value => {
    if (validatePassword(value)) {
      return true
    }
    return 'Password minimal 6 karakter.'
  }
]

const emailRules = [
  value => {
    if (validateEmail(value)) {
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
    // Validate the form before proceeding
    const isValidForm = validateEmail(email.value) || validatePassword(password.value)

    if (!isValidForm) {
      return
    }

    loading.value = true
    const { data } = await api.post("/user/sign-in", { email: email.value, password: password.value })
    session.setSession(data)
    SwalSuccess(`Berhasil masuk, selamat bekerja kembali ${data?.name}`)
    router.push('/')
  } catch (err) {
    const msg = err?.response?.data?.error || "Terjadi kesalahan tidak diketahui pada saat masuk"
    SwalError(msg)
  } finally {
    loading.value = false
  }
}
</script>
