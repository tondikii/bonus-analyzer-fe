<!-- src/components/Sidebar.vue -->
<template>
  <v-navigation-drawer v-model="drawer" :rail="railRef" permanent @click="railRef = false" class="sidebar-drawer">
    <div class="sidebar-content">
      <v-list-item :prepend-avatar="initialsAvatar" nav>
        <v-list-item-title>{{ props?.session?.name }}</v-list-item-title>
        <v-list-item-subtitle class="text-grey-lighten-2 text-subtitle-2">
          {{ props?.session?.email }}
        </v-list-item-subtitle>
        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="railRef = !railRef"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item v-for="({ icon, title, route }, idx) in menus" :key="idx" :prepend-icon="icon" :title="title"
          :value="route" :active="isActive(route)" @click="onClickMenu(route)"></v-list-item>
      </v-list>

      <v-spacer></v-spacer>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item prepend-icon="mdi-logout" title="Keluar" @click="onClickSignOut"
          :disabled="!props?.session"></v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SwalConfirm } from '@/lib/sweetalert2';

const props = defineProps({
  session: { type: [Object, null], default: null },
  rail: { type: Boolean, default: true }
});

const emit = defineEmits(['update:rail']);

// State
const drawer = ref(true)
const menus = ref([
  { name: "home", title: "Home", route: "/", icon: "mdi-home-city" },
  { name: "employee", title: "Karyawan", route: "/employee", icon: "mdi-account-group-outline" },
  { name: "criteria", title: "Kriteria", route: "/criteria", icon: "mdi-text-box-search-outline" },
  { name: "subCriteria", title: "Sub Kriteria", route: "/sub-criteria", icon: "mdi-text-search-variant" },
  { name: "performance", title: "Peringkat Karyawan", route: "/performance", icon: "mdi-human-male-board-poll" }
])
const railRef = ref(props.rail)

watch(() => props.rail, (newRail) => {
  railRef.value = newRail;
});

// Accessing the current route and router
const route = useRoute()
const router = useRouter()

// Computed property for the avatar initials
const initialsAvatar = computed(() => {
  const initials = getInitials(props?.session?.name)
  return `https://ui-avatars.com/api/?name=${initials}&background=3f51b5&color=fff&size=32`
})

watch(railRef, (newRail) => {
  emit('update:rail', newRail)
});

// Method to extract initials from the session name
const getInitials = (name) => {
  if (!name) return ''
  const nameParts = name.split(' ')
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('')
}

// Method to check if a menu item is active
const isActive = (menuRoute) => {
  return route.path === menuRoute
}

// Method to handle menu clicks
const onClickMenu = (menuRoute) => {
  router.push(menuRoute)
}

// Method to handle sign out
const onClickSignOut = async () => {
  const { isConfirmed } = await SwalConfirm({ title: "Keluar", text: "Apakah kamu yakin ingin keluar?" })
  if (isConfirmed) {
    props.session.clearSession()
    router.push('/sign-in')
  }
}
</script>

<style scoped>
.sidebar-drawer {
  background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent overlay */
  color: white;
}
</style>