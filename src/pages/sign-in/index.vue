<template>
  <div class="d-flex justify-center align-center h-screen w-screen">
    <v-sheet class="w-33 d-flex align-center flex-column" rounded>
      <h2 class="mb-4">Sign In</h2>

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

<script>
import { api } from '@/lib/axios'
import { SwalError, SwalSuccess } from '@/lib/sweetalert2'

export default {
  data: vm => ({
    loading: false,
    passwordRules: [value => {
      if (value?.length > 6) {
        return true
      }
      return 'Password minimal 6 karakter.'
    }],
    timeout: null,
    password: '',
    email: '',
    emailRules: [
      value => {
        if (/.+@.+\..+/.test(value)) { return true }

        return 'Format email tidak sesuai.'
      },
    ],
  }),

  computed: {
    disabled() {
      return !this.email || !this.password;
    }
  },

  methods: {
    async submit(event) {
      try {
        this.loading = true
        // Validate the form inputs
        const { valid } = await this.$refs.form.validate() || {}
        if (!valid) {
          return
        }

        const { data } = await api.post("/user/sign-in", { email: this.email, password: this.password })
        localStorage.setItem("session", JSON.stringify(data))
        SwalSuccess("Login successfully, welcome to BonusAnalyzer")
        this.$router.push('/')
      } catch (err) {
        const msg = err?.response?.data?.error || "Unknown error occured."
        SwalError(msg)
      } finally {
        this.loading = false
      }



      // alert(JSON.stringify(results, null, 2))

    },
    // async checkApi(userName) {
    //   return new Promise(resolve => {
    //     clearTimeout(this.timeout)

    //     this.timeout = setTimeout(() => {
    //       if (!userName) return resolve('Please enter a user name.')
    //       if (userName === 'johnleider') return resolve('User name already taken. Please try another one.')

    //       return resolve(true)
    //     }, 1000)
    //   })
    // },
  },
}
</script>
