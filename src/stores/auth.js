// src/stores/auth.js
// Simple shared auth state (no Pinia needed). Persists the user in localStorage.
import { computed, ref } from "vue";

const STORAGE_KEY = "nova_user";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

const user = ref(load());

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  function login(data) {
    user.value = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function updateUser(patch) {
    login({ ...user.value, ...patch });
  }

  function logout() {
    user.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { user, isAuthenticated, login, updateUser, logout };
}
