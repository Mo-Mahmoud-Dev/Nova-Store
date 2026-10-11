<template>
  <section class="hero">
    <div class="hero-container">

      <!-- Left: Text content -->
      <div class="hero-content">
        <div class="hero-badge">
          <span class="dot"></span>
          NEW COLLECTION • AUTUMN 2026
        </div>

        <h1 class="hero-title">Define Your Style.</h1>

        <p class="hero-description">
          Discover our latest collection of timeless silhouettes and structural
          essentials designed for understated daily confidence.
        </p>

        <div class="hero-actions">
          <RouterLink to="/products" class="btn-primary">Shop Collection</RouterLink>
          <RouterLink :to="{ path: '/products', query: { filter: 'new' } }" class="btn-link">
            Explore New Arrivals
            <span class="arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
          </RouterLink>
        </div>

        <div class="hero-meta">
          <span class="meta-item">
            <span class="meta-icon">✓</span>
            Curated in Cairo
          </span>
          <span class="meta-divider"></span>
          <span class="meta-item">
            <span class="meta-icon">🌐</span>
            Worldwide Shipping
          </span>
        </div>
      </div>

      <!-- Right: Image -->
      <div class="hero-image-wrap">
        <img src="/heroSectionManPhoto.webp" alt="Model wearing tailored minimalist wardrobe" class="hero-image" />

        <div class="hero-promo-badge">
          <span class="promo-label">Special Release</span>
          <span class="promo-title">Up to 40% Off</span>
          <span class="promo-sub">Selected Outerwear</span>
        </div>

        <div class="hero-caption">
          Look 01 / Tailored Minimalist Wardrobe
        </div>
      </div>

    </div>
  </section>
  <section class="category-section">
    <div class="category-container">

      <!-- Header -->
      <div class="category-header">
        <div class="category-header-text">
          <div class="category-eyebrow">DEPARTMENTS</div>
          <h2 class="category-title">Shop by Category</h2>
        </div>

        <p class="category-description">
          Explore curated collections meticulously designed for the
          contemporary wardrobe with architectural proportions.
        </p>
      </div>

      <!-- Category Grid -->
      <div class="category-grid">

        <RouterLink to="/products?filter=men" class="category-card">
          <div class="category-image-wrap">
            <img src="/man1.png" alt="Men" class="category-image" />
          </div>
          <div class="category-info">
            <div class="category-info-text">
              <h3>Men</h3>
              <p>Blazers, Knitwear & Trousers</p>
            </div>
            <span class="category-arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
          </div>
        </RouterLink>

        <RouterLink to="/products?filter=women" class="category-card">
          <div class="category-image-wrap">
            <img src="/woman1.png" alt="Women" class="category-image" />
          </div>
          <div class="category-info">
            <div class="category-info-text">
              <h3>Women</h3>
              <p>Coats, Silks & Structured Sets</p>
            </div>
            <span class="category-arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
          </div>
        </RouterLink>

        <RouterLink to="/products?filter=shoes" class="category-card">
          <div class="category-image-wrap">
            <img src="/Shoe.png" alt="Shoes" class="category-image" />
          </div>
          <div class="category-info">
            <div class="category-info-text">
              <h3>Shoes</h3>
              <p>Loafers, Boots & Sneakers</p>
            </div>
            <span class="category-arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
          </div>
        </RouterLink>

        <RouterLink to="/products?filter=accessories" class="category-card">
          <div class="category-image-wrap">
            <img src="/bag.png" alt="Accessories" class="category-image" />
          </div>
          <div class="category-info">
            <div class="category-info-text">
              <h3>Accessories</h3>
              <p>Handbags, Jewelry & Belts</p>
            </div>
            <span class="category-arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
          </div>
        </RouterLink>

      </div>

    </div>
  </section>
  <section class="featured-section">
    <div class="featured-container">

      <!-- Header -->
      <div class="featured-header">
        <div class="featured-header-text">
          <div class="featured-eyebrow">SIGNATURE WARDROBE</div>
          <h2 class="featured-title">Featured Collection</h2>
          <p class="featured-description">
            Discover our most celebrated pieces loved for cut, texture, and durability.
          </p>
        </div>

        <div class="featured-tabs">
          <button v-for="tab in tabs" :key="tab" class="tab-btn" :class="{ active: activeTab === tab }"
            @click="activeTab = tab">
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">Loading products...</div>

      <!-- Product Grid -->
      <div v-else class="featured-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" role="button" tabindex="0"
          @click="openQuickView(product)" @keyup.enter="openQuickView(product)">
          <div class="product-image-wrap">
            <span v-if="product.discount" class="badge badge-discount">-{{ product.discount }}%</span>
            <span v-if="product.tag" class="badge badge-tag">{{ product.tag }}</span>

            <button class="wishlist-btn" @click.stop="toggleWishlist(product)">
              <span :class="{ filled: wishlistStore.isWished(product.id) }"><ion-icon name="heart"></ion-icon></span>
            </button>

            <img :src="product.image" :alt="product.title" class="product-image" />
          </div>

          <div class="product-info">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-title">{{ product.title }}</h3>

            <div class="product-rating">
              <span class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(product.rating) }">★</span>
              </span>
              <span class="review-count">({{ product.reviews }})</span>
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
  <section class="hero-banner">
    <div class="bg-parent">
      <img src="/background.png" alt="banner">
    </div>
    <div class="parent-content">
      <div class="badge">
        <span class="dot"></span>
        <p>EXCLUSIVE AUTUMN / WINTER DROP</p>
      </div>
      <h1>Elevate Your
        Everyday.</h1>
      <p>
        Premium essentials crafted with relentless
        discipline. Architectural tailoring and effortless
        presence for the modern urbanist.
      </p>
      <div class="parent-links">
        <button type="button" @click="router.push('/products')">shop now</button>
        <RouterLink to="/products">
          LIMITED QUANTITIES
        </RouterLink>

      </div>
    </div>
  </section>
  <section class="new-arrivals-section">
    <div class="new-arrivals-container">

      <!-- Header -->
      <div class="new-arrivals-header">
        <div class="new-arrivals-header-text">
          <div class="new-arrivals-eyebrow">JUST IN</div>
          <h2 class="new-arrivals-title">New Arrivals</h2>
        </div>

        <p class="new-arrivals-description">
          Fresh silhouettes just landed in our studio, cut from breathable
          Italian and Egyptian textiles.
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">Loading products...</div>

      <!-- Product Grid -->
      <div v-else class="new-arrivals-grid">
        <div v-for="product in newArrivalProducts" :key="product.id" class="product-card" role="button" tabindex="0"
          @click="openQuickView(product)" @keyup.enter="openQuickView(product)">
          <div class="product-image-wrap">
            <span v-if="product.tag" class="badge">{{ product.tag }}</span>

            <button class="wishlist-btn" @click.stop="toggleWishlist(product)">
              <span :class="{ filled: wishlistStore.isWished(product.id) }"><ion-icon name="heart"></ion-icon></span>
            </button>

            <img :src="product.image" :alt="product.title" class="product-image" />
          </div>

          <div class="product-info">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-title">{{ product.title }}</h3>

            <div class="product-rating">
              <span class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(product.rating) }">★</span>
              </span>
            </div>

            <div class="product-price">
              <span class="price-current">{{ product.price }} EGP</span>
              <span v-if="product.oldPrice" class="price-old">{{ product.oldPrice }} EGP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View All -->
      <div class="new-arrivals-footer">
        <RouterLink to="/products" class="btn-view-all">
          View All Products (120+)
          <span class="arrow"><ion-icon name="arrow-forward-outline"></ion-icon></span>
        </RouterLink>
      </div>

    </div>
  </section>
  <section class="trust-section">
    <div class="trust-container">

      <!-- Header -->
      <div class="trust-header">
        <div class="trust-eyebrow">THE NOVA STANDARD</div>
        <h2 class="trust-title">Engineered for Distinction</h2>
      </div>

      <!-- Feature Grid -->
      <div class="trust-grid">

        <div class="trust-card">
          <div class="trust-icon">
            <ion-icon name="car-outline"></ion-icon>
          </div>
          <h3>Free Shipping</h3>
          <p>Complimentary delivery on all orders over 1,500 EGP across Egypt with insured transit.</p>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
          </div>
          <h3>Secure Payment</h3>
          <p>Encrypted transactions supporting Visa, Mastercard, national Meeza cards, or Cash on Delivery.</p>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <ion-icon name="sync-outline"></ion-icon>
          </div>
          <h3>Easy Returns</h3>
          <p>14-day hassle-free return and exchange policy with complimentary home courier pickup.</p>
        </div>

        <div class="trust-card">
          <div class="trust-icon">
            <ion-icon name="headset-outline"></ion-icon>
          </div>
          <h3>24/7 Support</h3>
          <p>Dedicated fashion concierges available at all hours for sizing advice and order tracking.</p>
        </div>

      </div>

    </div>
  </section>
  <section class="newsletter-section">
    <div class="newsletter-container">

      <div class="newsletter-eyebrow">JOIN THE COLLECTIVE</div>
      <h2 class="newsletter-title">Stay in the Loop</h2>
      <p class="newsletter-description">
        Subscribe to receive early private-sale invitations, seasonal editorial
        lookbooks, and insider collection previews.
      </p>

      <form class="newsletter-form" @submit.prevent="handleSubscribe">
        <input v-model="email" type="email" placeholder="Enter your email address" class="newsletter-input" required />
        <button type="submit" class="newsletter-btn">Subscribe</button>
      </form>

      <p class="newsletter-note">
        By subscribing you agree to our
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>.
        Unsubscribe anytime with one click.
      </p>

    </div>
  </section>
<!-- Subscribe Success Popup -->
<SuccessPopup v-model="isSubscribeOpen" />
  <!-- Product Quick View Popup -->
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
            <span v-for="n in 5" :key="n" class="star"
              :class="{ filled: n <= Math.round(selectedProduct.rating) }">★</span>
          </span>
          <span v-if="selectedProduct.reviews" class="review-count">({{ selectedProduct.reviews }})</span>
        </div>

        <div class="quick-view-price">
          <span class="price-current">{{ selectedProduct.price }} EGP</span>
          <span v-if="selectedProduct.oldPrice" class="price-old">{{ selectedProduct.oldPrice }} EGP</span>
        </div>

        <p class="quick-view-description">
          {{ selectedProduct.description || `A refined, versatile piece crafted from premium materials, designed to complement your everyday wardrobe with understated confidence.` }}    
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
// 1. استيراد الـ Stores
import { useProductsStore } from "@/stores/products";
import { useWishlistStore } from "@/stores/wishlist";
import SuccessPopup from "@/components/SuccessPopup.vue";
const router = useRouter();

// 2. تفعيل الـ Stores
const productsStore = useProductsStore();
const wishlistStore = useWishlistStore();

// التبويبات
const tabs = ["All", "Clothing", "Shoes", "Accessories"];
const activeTab = ref("All");

// 3. فلترة واقتطاع أربعة منتجات قسم الـ Featured Collection
const filteredProducts = computed(() => {
  let list = productsStore.products;

  // إذا تم اختيار تبويب معين غير "All"
  if (activeTab.value !== "All") {
    list = list.filter((p) => p.type === activeTab.value);
  }

  // أخذ أول 4 منتجات فقط
  return [...list].sort(() => Math.random() - 0.5).slice(0, 4);
});

// 4. عرض 4 منتجات جديدة عشوائية من الـ Getter
const newArrivalProducts = computed(() => {
  // 1. عمل نسخة سريعة من القائمة
  // 2. ترتيب العناصر عشوائياً
  // 3. اقتطاع أول 4 منتجات
  return [...productsStore.newArrivals]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
});

//* Wishlist
function toggleWishlist(product) {
  wishlistStore.toggle(product);
}

//* Newsletter
const email = ref("");
const isSubscribeOpen = ref(false);

function handleSubscribe() {
  console.log("Subscribed:", email.value);
  email.value = "";
  isSubscribeOpen.value = true;
}

//* Product Quick View Popup
const isQuickViewOpen = ref(false);
const selectedProduct = ref(null);

function openQuickView(product) {
  selectedProduct.value = product;
  isQuickViewOpen.value = true;
}

function addToCart(product) {
  if (!product) return;
  console.log("Added to cart:", product.title);
  isQuickViewOpen.value = false;
}
</script>

<style scoped lang="scss">
@use 'assets/styles/popUp' as *;

.loading-state {
  padding: 60px 0;
  text-align: center;
  color: #888;
  font-size: 0.95rem;
}

.product-card {
  cursor: pointer;
}
</style>