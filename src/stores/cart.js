import { defineStore } from 'pinia'

const STORAGE_KEY = 'cart-items'
const VOUCHER_KEY = 'cart-voucher'

export const FREE_SHIPPING_AT = 1500
export const SHIPPING_FEE = 60
export const VOUCHERS = { AUTUMN15: 0.15 } // code -> discount rate

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: load(), // [{ id, sku, title, image, price, oldPrice, discount, color, size, qty }]
    voucher: localStorage.getItem(VOUCHER_KEY) || '',
    giftWrap: false,
    note: '',
  }),

  getters: {
    count: (s) => s.items.reduce((n, i) => n + i.qty, 0),
    subtotal: (s) => s.items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0),
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch {
        /* storage unavailable */
      }
    },

    // Adds a product (from the products store) or bumps its quantity.
    add(product, options = {}) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.qty += 1
      } else {
        this.items.push({
          id: product.id,
          sku: product.sku || `NV-${String(product.id).padStart(4, '0')}`,
          title: product.title,
          image: product.image,
          price: Number(product.price),
          oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
          discount: product.discount || null,
          color: options.color || product.color || null,
          size: options.size || product.size || null,
          qty: 1,
        })
      }
      this.persist()
    },

    setQty(id, qty) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      item.qty = Math.max(1, Math.min(99, qty))
      this.persist()
    },

    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this.persist()
    },

    setVoucher(code) {
      this.voucher = code
      try {
        localStorage.setItem(VOUCHER_KEY, code)
      } catch {
        /* storage unavailable */
      }
    },

    clear() {
      this.items = []
      this.giftWrap = false
      this.note = ''
      this.setVoucher('')
      this.persist()
    },
  },
})