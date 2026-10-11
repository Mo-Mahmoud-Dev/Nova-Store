import { defineStore } from 'pinia'

const KEY = 'last-order'

// Holds the most recent order so the confirmation page can show it.
export const useOrderStore = defineStore('order', {
  state: () => ({
    lastOrder: JSON.parse(sessionStorage.getItem(KEY) || 'null'),
  }),
  actions: {
    setLastOrder(order) {
      this.lastOrder = order
      try {
        sessionStorage.setItem(KEY, JSON.stringify(order))
      } catch {
        /* storage unavailable */
      }
    },
  },
})