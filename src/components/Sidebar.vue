<template>
  <v-card>
    <v-layout>
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
      </v-navigation-drawer>
      <v-main style="height: 250px"></v-main>
    </v-layout>
  </v-card>
</template>
<script>

import { useRoute } from 'vue-router'
// const location = useRoute();

export default {
  data() {
    return {
      drawer: true,
      rail: true,
      session: JSON.parse(localStorage.getItem("session") || '{}'),
      menus: [{ name: "home", title: "Home", route: "/", icon: "mdi-home-city" }, { name: "employees", title: "karyawan", route: "/employees", icon: "mdi-account-group-outline" }, { name: "criterion", title: "Kriteria", route: "/criterion", icon: "mdi-text-box-search-outline" }],
      location: useRoute()
    }
  },
  computed: {
    initialsAvatar() {
      const initials = this.getInitials(this.session?.name);
      return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=32`; // Adjust size and style as needed
    }
  },
  methods: {
    getInitials(name) {
      if (!name) return '';
      const nameParts = name.split(' ');
      if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    },
    onClickMenu(route) {
      this.$router.push(route)
    }
  },
}
</script>