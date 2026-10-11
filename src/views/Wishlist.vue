<template>
  <section class="new-arrivals-section wishlist-page">
    <div class="new-arrivals-container">

      <div class="new-arrivals-header">
        <div class="new-arrivals-header-text">
          <div class="new-arrivals-eyebrow">SAVED FOR LATER</div>
          <h2 class="new-arrivals-title">Your Wishlist</h2>
        </div>
        <p class="new-arrivals-description" v-if="wishlistStore.count">
          {{ wishlistStore.count }} item{{ wishlistStore.count > 1 ? 's' : '' }} saved
        </p>
      </div>

      <!-- Empty state -->
      <div v-if="!wishlistStore.count" class="wishlist-empty">
        <p>Your wishlist is empty.</p>
        <RouterLink to="/products" class="btn-primary">Browse Products</RouterLink>
      </div>

      <!-- Product Grid: same classes as Home.vue, so it inherits the nested .product-card styles -->
      <div v-else class="new-arrivals-grid">
        <div
          v-for="product in wishlistStore.items"
          :key="product.id"
          class="product-card"
          role="button"
          tabindex="0"
          @click="openQuickView(product)"
          @keyup.enter="openQuickView(product)"
        >
          <div class="product-image-wrap">
            <span v-if="product.discount" class="badge badge-discount">-{{ product.discount }}%</span>
            <span v-if="product.tag" class="badge badge-tag">{{ product.tag }}</span>

            <button class="wishlist-btn" @click.stop="wishlistStore.remove(product.id)">
              <span class="filled"><ion-icon name="heart"></ion-icon></span>
            </button>

            <img :src="product.image" :alt="product.title" class="product-image" />
          </div>

          <div class="product-info">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-title">{{ product.title }}</h3>

            <div class="product-rating" v-if="product.rating">
              <span class="stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= Math.round(product.rating) }"
                >★</span>
              </span>
              <span v-if="product.reviews" class="review-count">({{ product.reviews }})</span>
            </div>

            <div class="product-price">
              <span class="price-current">{{ product.price }} EGP</span>
              <span v-if="product.oldPrice" class="price-old">{{ product.oldPrice }} EGP</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Product Quick View Popup (identical wiring to Home.vue) -->
  <ProductsPopup v-model="isQuickViewOpen">
    <template #header>
      <h3 class="popup-title">Quick View</h3>
      <button class="popup-close" type="button" @click="isQuickViewOpen = false" aria-label="Close">
        &times;
      </button>
    </template>

    <div v-if="selectedProduct" class="quick-view">
      <div class="quick-view-image-wrap">
        <img :src="selectedProduct.image" :alt="selectedProduct.title" class="quick-view-image" />
      </div>

      <div class="quick-view-details">
        <div class="quick-view-category">{{ selectedProduct.category }}</div>
        <h2 class="quick-view-title">{{ selectedProduct.title }}</h2>

        <div class="quick-view-rating" v-if="selectedProduct.rating">
          <span class="stars">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(selectedProduct.rating) }">★</span>
          </span>
          <span v-if="selectedProduct.reviews" class="review-count">({{ selectedProduct.reviews }})</span>
        </div>

        <div class="quick-view-price">
          <span class="price-current">{{ selectedProduct.price }} EGP</span>
          <span v-if="selectedProduct.oldPrice" class="price-old">{{ selectedProduct.oldPrice }} EGP</span>
        </div>

        <p class="quick-view-description">
          {{ selectedProduct.description || 'A refined, versatile piece crafted from premium materials, designed to complement your everyday wardrobe with understated confidence.' }}
        </p>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="isQuickViewOpen = false">Close</button>
      <button class="btn-primary" type="button" @click="addToCart(selectedProduct)">Add to Cart</button>
    </template>
  </ProductsPopup>
</template>

<script setup>
import { ref } from "vue";
import { useWishlistStore } from "@/stores/wishlist";
import { useCartStore } from "@/stores/cart";          // ← جديد
import ProductsPopup from "@/components/ProductsPopup.vue";

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();                       // ← جديد

const isQuickViewOpen = ref(false);
const selectedProduct = ref(null);

function openQuickView(product) {
  selectedProduct.value = product;
  isQuickViewOpen.value = true;
}

function addToCart(product) {
  if (!product) return;
  cartStore.add(product);                               // ← الإضافة الفعلية
  isQuickViewOpen.value = false;
}
</script>
<style scoped lang="scss">
@use 'assets/styles/popUp' as *;

.wishlist-page {
  background: #fff;
}

.wishlist-empty {
  text-align: center;
  padding: 80px 0;
  color: #777;

  p {
    margin-bottom: 20px;
    font-size: 1.05rem;
  }
  .btn-primary {
  display: inline-block;
  padding: 14px 28px;
  background: #141414;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}
}

</style>