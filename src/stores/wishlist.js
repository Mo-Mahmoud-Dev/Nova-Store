import { defineStore } from "pinia";

const STORAGE_KEY = "nova-wishlist";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse wishlist from localStorage:", e);
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save wishlist to localStorage:", e);
  }
}

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: loadFromStorage(), // array of full product objects
  }),

  getters: {
    count: (state) => state.items.length,
    isWished: (state) => (productId) =>
      state.items.some((p) => p.id === productId),
  },

  actions: {
    toggle(product) {
      const index = this.items.findIndex((p) => p.id === product.id);
      if (index === -1) {
        // store a clean copy of the card data, not a live reference
        this.items.push({ ...product, wished: true });
      } else {
        this.items.splice(index, 1);
      }
      saveToStorage(this.items);
    },

    remove(productId) {
      this.items = this.items.filter((p) => p.id !== productId);
      saveToStorage(this.items);
    },

    clear() {
      this.items = [];
      saveToStorage(this.items);
    },
  },
});