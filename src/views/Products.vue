<template>
  <div class="products-page">
    <!-- Header -->
    <div class="products-header">
      <p class="breadcrumb">HOME / SHOP / ALL PRODUCTS</p>
      <h1>All Products</h1>
      <p class="subtitle">Browse our full catalogue across every category.</p>
    </div>

    <!-- Toolbar: type filter, tag filter, search, sort -->
    <div class="toolbar">
      <div class="filters">
        <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="selectAll">
          All ({{ store.products.length }})
        </button>
        <button
          v-for="f in categoryFilters"
          :key="f.key"
          class="filter-btn"
          :class="{ active: activeFilter === f.key }"
          @click="setFilter(f.key)"
        >
          {{ f.label }} ({{ filterCounts[f.key] }})
        </button>
      </div>

      <div class="toolbar-right">
        <input v-model="search" type="text" class="search-input" placeholder="Search products..." />

        <select v-model="activeTag" class="tag-select">
          <option value="All">All Tags</option>
          <option v-for="tag in productTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>

        <select v-model="sortBy" class="sort-select">
          <option value="default">Curated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
        </select>
      </div>
    </div>

    <!-- Loading / Error states -->
    <div v-if="store.loading" class="state-msg">Loading products...</div>
    <div v-else-if="store.error" class="state-msg error">
      {{ store.error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredProducts.length === 0" class="state-msg">
      No products match your filters.
    </div>

    <!-- Product grid -->
    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image-wrap">
          <span v-if="product.tag" class="badge" :class="badgeClass(product.tag)">
            {{ product.tag }}
          </span>

          <button
            class="wishlist-btn"
            :class="{ active: wishlist.isWished(product.id) }"
            @click="wishlist.toggle(product)"
            aria-label="Toggle wishlist"
          >
            <ion-icon :name="wishlist.isWished(product.id) ? 'heart' : 'heart-outline'"></ion-icon>
          </button>

          <img
            :src="product.image"
            :alt="product.title"
            class="product-image"
            loading="lazy"
            @click="openQuickView(product)"
          />

          <button class="quick-view-btn" type="button" @click="openQuickView(product)">
            Quick View
          </button>
        </div>

        <div class="product-info">
          <p v-if="product.category" class="material">{{ product.category }}</p>
          <h3 class="product-name">{{ product.title }}</h3>

          <div v-if="product.rating" class="rating-row">
            <span class="stars">{{ starString(product.rating) }}</span>
            <span v-if="product.reviews" class="reviews">({{ product.reviews }})</span>
          </div>

          <div class="price-row">
            <span class="price">{{ formatPrice(product.price) }} EGP</span>
            <span v-if="product.oldPrice" class="old-price">
              {{ formatPrice(product.oldPrice) }} EGP
            </span>
            <span v-if="product.discount" class="discount">-{{ product.discount }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Product Quick View Popup -->
  <ProductsPopup v-model="isQuickViewOpen">
    <div v-if="selectedProduct" class="quick-view">
      <div class="quick-view-image-wrap">
        <img :src="selectedProduct.image" :alt="selectedProduct.title" class="quick-view-image" />
      </div>

      <div class="quick-view-details">
        <div class="quick-view-category">{{ selectedProduct.category }}</div>
        <h2 class="quick-view-title">{{ selectedProduct.title }}</h2>

        <div class="quick-view-rating" v-if="selectedProduct.rating">
          <span class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= Math.round(selectedProduct.rating) }"
              >★</span
            >
          </span>
          <span v-if="selectedProduct.reviews" class="review-count"
            >({{ selectedProduct.reviews }})</span
          >
        </div>

        <div class="quick-view-price">
          <span class="price-current">{{ formatPrice(selectedProduct.price) }} EGP</span>
          <span v-if="selectedProduct.oldPrice" class="price-old"
            >{{ formatPrice(selectedProduct.oldPrice) }} EGP</span
          >
        </div>

        <p class="quick-view-description">
          {{
            selectedProduct.description ||
            `A refined, versatile piece crafted from premium materials, designed to complement your everyday wardrobe with understated confidence.`
          }}
        </p>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="isQuickViewOpen = false">Close</button>
      <button class="btn-primary" type="button" @click="addToCart(selectedProduct)">
        Add to Cart
      </button>
    </template>
  </ProductsPopup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useWishlistStore } from '../stores/wishlist'
import ProductsPopup from '@/components/ProductsPopup.vue' // adjust the path if the popup lives elsewhere
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()
const wishlist = useWishlistStore()
const cart = useCartStore()

const activeFilter = ref('all')
const activeTag = ref('All')
const search = ref('')
const sortBy = ref('default')

// ---- Quick view popup state ----
const isQuickViewOpen = ref(false)
const selectedProduct = ref(null)

function openQuickView(product) {
  selectedProduct.value = product
  isQuickViewOpen.value = true
}

function addToCart(product) {
  if (!product) return
  cart.add(product)
  isQuickViewOpen.value = false
}

// ---- Random order for the "All" tab ----
// The shuffled order is stored once (not recomputed inside `filteredProducts`),
// so typing in search or changing a tag doesn't reshuffle the grid.
const shuffledOrder = ref(new Map()) // product id -> position

function reshuffle() {
  const ids = store.products.map((p) => p.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  shuffledOrder.value = new Map(ids.map((id, index) => [id, index]))
}

// New shuffle every time the page is visited and whenever products (re)load
watch(() => store.products.length, reshuffle, { immediate: true })

// Clicking "All" gives a fresh shuffle too
function selectAll() {
  reshuffle()
  setFilter('all')
}

// IDs of the products the store considers "new arrivals" (same source the Home page uses)
const newArrivalIds = computed(() => new Set(store.newArrivals.map((p) => p.id)))

// Category filters. "Clothing" is split by gender into Men / Women;
// Shoes and Accessories keep their own buttons.
// Product data uses gender: "man" | "woman" and type: "Clothing" | "Shoes" | "Accessories".
const categoryFilters = [
  { key: 'men', label: 'Men', match: (p) => p.type === 'Clothing' && p.gender === 'man' },
  { key: 'women', label: 'Women', match: (p) => p.type === 'Clothing' && p.gender === 'woman' },
  { key: 'shoes', label: 'Shoes', match: (p) => p.type === 'Shoes' },
  { key: 'accessories', label: 'Accessories', match: (p) => p.type === 'Accessories' },
  // New Arrivals = same products as the Home page's "New Arrivals" section
  { key: 'new', label: 'New Arrivals', match: (p) => newArrivalIds.value.has(p.id) },
  // Sale = anything with a discount / old price
  { key: 'sale', label: 'Sale', match: (p) => Boolean(p.oldPrice || p.discount) },
]

// ---- Sync the active filter with the URL (?filter=men|women|accessories|sale|new) ----
function filterFromRoute() {
  const key = route.query.filter
  return categoryFilters.some((f) => f.key === key) ? key : 'all'
}

// Apply the filter from the URL on first load
activeFilter.value = filterFromRoute()

// Navbar links point to the same page with a different query, so the component
// isn't remounted; watch the query to update the filter.
watch(
  () => route.query.filter,
  () => {
    activeFilter.value = filterFromRoute()
  },
)

// Used by the in-page filter buttons. Keeps the URL in sync so that clicking a
// navbar link afterwards always changes the filter as expected.
function setFilter(key) {
  activeFilter.value = key
  router.replace({
    query: { ...route.query, filter: key === 'all' ? undefined : key },
  })
}

// Product count shown next to each filter button
const filterCounts = computed(() => {
  const counts = {}
  for (const f of categoryFilters) {
    counts[f.key] = store.products.filter(f.match).length
  }
  return counts
})

// Unique tags derived from the store's product list (tag can be null)
const productTags = computed(() => {
  const tags = new Set(store.products.map((p) => p.tag).filter(Boolean))
  return [...tags]
})

const filteredProducts = computed(() => {
  let list = [...store.products]

  if (activeFilter.value !== 'all') {
    const filter = categoryFilters.find((f) => f.key === activeFilter.value)
    if (filter) list = list.filter(filter.match)
  }

  if (activeTag.value !== 'All') {
    list = list.filter((p) => p.tag === activeTag.value)
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter((p) => p.title?.toLowerCase().includes(q))
  }

  switch (sortBy.value) {
    case 'price-asc':
      list.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case 'price-desc':
      list.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case 'name-asc':
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
    default:
      // "Curated": random order on the All tab, store order on other tabs
      if (activeFilter.value === 'all') {
        const order = shuffledOrder.value
        const pos = (p) => order.get(p.id) ?? Number.MAX_SAFE_INTEGER
        list.sort((a, b) => pos(a) - pos(b))
      }
      break
  }

  return list
})

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-US')
}

function starString(rating) {
  const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

function badgeClass(tag) {
  const map = {
    New: 'badge-new',
    'Best Seller': 'badge-bestseller',
    Featured: 'badge-featured',
    Hot: 'badge-hot',
    Trending: 'badge-trending',
    'Top Rated': 'badge-toprated',
  }
  return map[tag] || 'badge-default'
}
</script>

<style scoped>
.products-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.breadcrumb {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #8a8a8a;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.products-header h1 {
  font-size: 42px;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin: 0 0 8px;
}

.subtitle {
  color: #6b6b6b;
  font-size: 15px;
  margin-bottom: 24px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #e5e2dd;
  border-bottom: 1px solid #e5e2dd;
  margin-bottom: 32px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  padding: 8px 14px;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #fff;
  border: 1px solid #d8d4cd;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-btn.active,
.filter-btn:hover {
  background: #1a1a1a;
  color: #fff;
  border-color: #1a1a1a;
}

.toolbar-right {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input,
.tag-select,
.sort-select {
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #d8d4cd;
  background: #fff;
}

.search-input {
  min-width: 200px;
}

.state-msg {
  text-align: center;
  padding: 80px 0;
  color: #6b6b6b;
  font-size: 14px;
}

.state-msg.error {
  color: #b91c1c;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.wishlist-btn ion-icon {
  font-size: 18px;
  color: #999;
  pointer-events: none;
  transition: color 0.2s ease;
}

.wishlist-btn.active ion-icon {
  color: #c0392b;
}

@media (max-width: 1100px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 760px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}

.product-card {
  display: flex;
  flex-direction: column;
}

.product-image-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f3f1ec;
  margin-bottom: 12px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-image {
  cursor: pointer;
}

.quick-view-btn {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 2;
  padding: 10px;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.product-card:hover .quick-view-btn,
.quick-view-btn:focus-visible {
  opacity: 1;
  transform: translateY(0);
}

.quick-view-btn:hover {
  background: #1a1a1a;
  color: #fff;
}

/* Always visible on touch devices (no hover) */
@media (hover: none) {
  .quick-view-btn {
    opacity: 1;
    transform: none;
  }
}

/* ---- Quick view popup content (slot content uses this component's scope) ---- */
.quick-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.quick-view-image-wrap {
  aspect-ratio: 3 / 4;
  background: #f3f1ec;
  overflow: hidden;
}

.quick-view-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quick-view-category {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8a8a8a;
  margin-bottom: 6px;
}

.quick-view-title {
  font-size: 26px;
  font-weight: 500;
  margin: 0 0 12px;
  line-height: 1.25;
}

.quick-view-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.quick-view-rating .star {
  color: #d8d4cd;
  font-size: 15px;
}

.quick-view-rating .star.filled {
  color: #c9a24b;
}

.review-count {
  font-size: 12px;
  color: #8a8a8a;
}

.quick-view-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}

.price-current {
  font-size: 22px;
  font-weight: 600;
}

.price-old {
  font-size: 15px;
  color: #a3a3a3;
  text-decoration: line-through;
}

.quick-view-description {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.btn-primary,
.btn-secondary {
  padding: 10px 22px;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid #1a1a1a;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.btn-primary {
  background: #1a1a1a;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #fff;
  color: #1a1a1a;
}

.btn-secondary:hover {
  background: #f2f2f2;
}

@media (max-width: 760px) {
  .quick-view {
    grid-template-columns: 1fr;
  }
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 8px;
  background: #1a1a1a;
  color: #fff;
}

.badge-new {
  background: #1a1a1a;
}

.badge-bestseller {
  background: #c9a24b;
  color: #1a1a1a;
}

.badge-featured {
  background: #1a1a1a;
}

.badge-hot {
  background: #b91c1c;
}

.badge-trending {
  background: #2563eb;
}

.badge-toprated {
  background: #7c3aed;
}

.badge-default {
  background: #4b4b4b;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.stars {
  color: #c9a24b;
  font-size: 12px;
  letter-spacing: 1px;
}

.reviews {
  font-size: 11px;
  color: #8a8a8a;
}

.discount {
  margin-left: auto;
  font-size: 11px;
  color: #b91c1c;
  font-weight: 600;
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-btn.active {
  color: #c0392b;
}

.material {
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #8a8a8a;
  margin: 0 0 4px;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 8px;
  line-height: 1.3;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.price {
  font-size: 14px;
  font-weight: 600;
}

.old-price {
  font-size: 13px;
  color: #a3a3a3;
  text-decoration: line-through;
}
</style>
