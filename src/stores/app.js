// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
  }),
});

export const useSessionStore = defineStore("session", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  }),
  actions: {
    setSession(data) {
      this.token = data.access_token;
      this.name = data.name;
      this.email = data.email;
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("token", data.access_token);
    },
    clearSession() {
      this.token = "";
      this.name = "";
      this.email = "";
      localStorage.clear();
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
