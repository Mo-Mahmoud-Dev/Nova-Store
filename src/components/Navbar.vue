<template>
  <header class="navbar">
    <div v-if="showAnnouncement" class="navbar__announcement">
      <p class="navbar__announcement-text">
        Free shipping on orders over 1,500 EGP | Worldwide Delivery Available
      </p>
      <button
        type="button"
        class="navbar__announcement-close"
        aria-label="Dismiss announcement"
        @click="showAnnouncement = false"
      >
        <ion-icon name="close-outline"></ion-icon>
      </button>
    </div>

    <div class="navbar__main">
      <div class="navbar__container">
        <RouterLink to="/" class="navbar__brand" @click="closeMenu">
          <span class="navbar__brand-text">Nova Store</span>
        </RouterLink>

        <nav
          id="navbar-links"
          class="navbar__links"
          :class="{ 'navbar__links--open': menuOpen }"
          aria-label="Main navigation"
          @click="closeMenu"
        >
          <RouterLink to="/" class="navbar__link">Home</RouterLink>
          <RouterLink to="/Products" class="navbar__link">Shop</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'men' } }" class="navbar__link">Men</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'women' } }" class="navbar__link">Women</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'shoes' } }" class="navbar__link">Shoes</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'accessories' } }" class="navbar__link">Accessories</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'new' } }" class="navbar__link">New Arrivals</RouterLink>
          <RouterLink :to="{ path: '/Products', query: { filter: 'sale' } }" class="navbar__link navbar__link--sale">
            Sale
            <span class="navbar__sale-badge">Sale</span>
          </RouterLink>
        </nav>

        <div class="navbar__actions">
          <RouterLink to="/wishlist" class="navbar__action navbar__action--badge" aria-label="Wishlist">
            <ion-icon name="heart-circle-outline"></ion-icon>
            <span class="navbar__badge">{{ wishlistStore.count }}</span>
          </RouterLink>

          <RouterLink to="/cart" class="navbar__action navbar__action--badge" aria-label="Cart">
            <ion-icon name="bag-outline"></ion-icon>
            <span class="navbar__badge">{{ cartStore.count > 99 ? '99+' : cartStore.count }}</span>
          </RouterLink>

          <RouterLink :to="{ name: 'Authentication' }" class="navbar__action navbar__action--profile" aria-label="Account">
            <ion-icon name="person-outline"></ion-icon>
          </RouterLink>

          <button
            type="button"
            class="navbar__action navbar__toggle"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="menuOpen"
            aria-controls="navbar-links"
            @click="menuOpen = !menuOpen"
          >
            <ion-icon :name="menuOpen ? 'close-outline' : 'menu-outline'"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'

const showAnnouncement = ref(true)
const menuOpen = ref(false)
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style scoped lang="scss">
@use "assets/styles/_variables.scss" as *;
$navbar-black: #000000;
$navbar-white: #ffffff;
$navbar-gold: #d4af37;
$navbar-sale: #b22222;
$navbar-border: #eeeeee;

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: var(--font-para, 'Manrope', sans-serif);
}

.navbar__announcement {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 40px;
  padding: 0.5rem 3rem;
  background: $navbar-black;
  color: $navbar-white;
}

.navbar__announcement-text {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.4;
}

.navbar__announcement-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: $navbar-white;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s ease;

  ion-icon {
    font-size: 1.25rem;
  }

  &:hover {
    opacity: 1;
  }
}

.navbar__main {
  background: $navbar-white;
  border-bottom: 1px solid $navbar-border;
}

/* ---------- Layout (flexbox) ---------- */
.navbar__container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
}

/* Brand and actions share equal space so the links stay centered */
.navbar__brand {
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  text-decoration: none;
  color: $navbar-black;
}

.navbar__brand-text {
  width: fit-content;
  font-size: 1.9rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: capitalize;
  font-family: var(--font-logo);
  white-space: nowrap;
}

.navbar__links {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.75rem;
}

.navbar__link {
  position: relative;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  color: $navbar-black;
  padding-bottom: 0.35rem;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: $navbar-black;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform 0.35s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    transform: translateX(-50%) scaleX(1);
  }
}

.navbar__link--sale {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar__sale-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.45rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: $navbar-white;
  background: $navbar-sale;
  line-height: 1;
}

.navbar__actions {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
}

.navbar__action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: $navbar-black;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  ion-icon {
    font-size: 1.35rem;
  }

  &:hover {
    opacity: 0.65;
  }
}

.navbar__action--badge {
  .navbar__badge {
    position: absolute;
    top: -0.9rem;
    right: -0.9rem;
    min-width: 1.125rem;
    height: 1.125rem;
    padding: 0 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 1;
    color: $navbar-white;
    background: $navbar-black;
    border-radius: 999px;
  }
}

.navbar__action--profile {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: $navbar-black;
  color: $navbar-white;

  ion-icon {
    font-size: 1.1rem;
  }

  &:hover {
    opacity: 0.85;
  }
}

/* Hamburger is hidden on desktop */
.navbar__toggle {
  display: none;

  ion-icon {
    font-size: 1.75rem;
  }
}

/* ---------- Tablet & mobile: collapsible menu ---------- */
@media (max-width: 1024px) {
  .navbar__container {
    gap: 0.75rem 1rem;
  }

  .navbar__brand {
    order: 1;
  }

  .navbar__actions {
    order: 2;
    flex: 0 0 auto;
  }

  .navbar__toggle {
    display: inline-flex;
  }

  /* Links drop below the brand row and take the full width */
  .navbar__links {
    order: 3;
    flex: 0 0 100%;
    display: none;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: 0;
    border-top: 1px solid $navbar-border;

    &--open {
      display: flex;
    }
  }

  .navbar__link {
    padding: 0.9rem 0;
    border-bottom: 1px solid $navbar-border;

    &::after {
      display: none;
    }
  }

  .navbar__link--sale {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .navbar__announcement {
    padding: 0.5rem 2.5rem 0.5rem 1rem;
  }

  .navbar__announcement-text {
    font-size: 0.5625rem;
  }

  .navbar__announcement-close {
    right: 0.5rem;
  }

  .navbar__container {
    padding: 0.75rem 1rem;
  }

  .navbar__brand-text {
    font-size: 1.35rem;
    letter-spacing: 0.15em;
  }

  .navbar__actions {
    gap: 0.9rem;
  }

  .navbar__action ion-icon {
    font-size: 1.25rem;
  }

  .navbar__action--badge .navbar__badge {
    top: -0.6rem;
    right: -0.6rem;
  }
}

@media (max-width: 380px) {
  .navbar__brand-text {
    font-size: 1.1rem;
    letter-spacing: 0.1em;
  }

  .navbar__actions {
    gap: 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navbar__link::after,
  .navbar__action,
  .navbar__announcement-close {
    transition: none;
  }
}
</style>