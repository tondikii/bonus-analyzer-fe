<template>
  <v-card>
    <v-layout v-show="isAuthenticated">
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item :prepend-avatar="initialsAvatar" nav>
          <v-list-item-title>{{ session?.name }}</v-list-item-title>
          <v-list-item-sub-title class="text-grey-darken-1 text-subtitle-2">{{ session?.email
            }}</v-list-item-sub-title>
          <template v-slot:append>
            <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item v-for="({ icon, name, title, route }, idx) in menus" :key="idx"
            :class="location?.path === route ? 'bg-secondary-custom' : ''" :prepend-icon="icon" :title="title"
            :value="name" @click="onClickMenu(route)"></v-list-item>
          <!-- <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item> -->
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item prepend-icon="mdi-logout" title="Keluar" @click="onClickSignOut">
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 100vh"></v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useSessionStore } from '@/stores/app'

const session = useSessionStore()

const isAuthenticated = computed(() => session.isAuthenticated)

// State
const drawer = ref(true)
const rail = ref(true)
const menus = ref([
  { name: "home", title: "Home", route: "/", icon: "mdi-home-city" },
  { name: "employee", title: "karyawan", route: "/employee", icon: "mdi-account-group-outline" },
  { name: "criteria", title: "Kriteria", route: "/criteria", icon: "mdi-text-box-search-outline" }
])

// Accessing the current route and router
const location = useRoute()
const router = useRouter()

// Computed property for the avatar initials
const initialsAvatar = computed(() => {
  const initials = getInitials(session?.name)
  return `https://ui-avatars.com/api/?name=${initials}&background=3f51b5&color=fff&size=32`
})

// Method to extract initials from the session name
function getInitials(name) {
  if (!name) return ''
  const nameParts = name.split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('')
}

// Method to handle menu clicks
function onClickMenu(route) {
  router.push(route)
}

// Method to handle sign out
function onClickSignOut() {
  Swal.fire({
    title: "Keluar",
    text: "Apakah kamu yakin ingin keluar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      session.clearSession()
      router.push('/sign-in')
    }
  })
}
</script>
