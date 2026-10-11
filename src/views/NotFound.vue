<template>
  <div class="not-found-page">
    <div class="navbar__logo">Nova Store</div>
    <!-- Main Content -->
    <main class="content">
      <!-- Left Panel -->
      <div class="content__left">
        <div class="illustration-wrapper">
          <img class="illustration" :src="$base + 'SeekerNotFoundPage.png'" alt="Seeker">
        </div>
      </div>

      <!-- Right Panel -->
      <div class="content__right">
        <div class="error-content">
          <h1 class="error-content__code">404</h1>
          <h2 class="error-content__title">
            OOOps!<br />Page Not Found
          </h2>
          <p class="error-content__description">
            This page doesn't exist or was removed!<br />
            We suggest you back to home
          </p>
          <button class="error-content__btn" @click="goHome">
            Back to homepage
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      window.location.href = '/';
    },
  },
};
</script>

<style lang="scss">
@use "assets/styles/_variables.scss" as *;
// ─── Variables ────────────────────────────────────────────────────────────────
$cyan-bg: #adf0f5;
$black: #111111;
$white: #ffffff;
$gray-text: #9e9e9e;
$font-primary: 'Helvetica Neue', Arial, sans-serif;

// Breakpoints
$bp-desktop-lg: 1200px;
$bp-tablet: 992px;
$bp-mobile: 768px;
$bp-mobile-sm: 480px;

// ─── Reset / Base ─────────────────────────────────────────────────────────────
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: $font-primary;
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
.not-found-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; // accounts for mobile browser address bar
  overflow: hidden;
  background: $white;
}

.navbar__logo {
  width: fit-content;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: capitalize;
  font-family: var(--font-logo);
  z-index: 100;
  position: absolute;
  top: 20px;
  left: 20px;
}

// ─── Main content ─────────────────────────────────────────────────────────────
.content {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  // ── Left panel ──────────────────────────────────────────────────────────────
  &__left {
    flex: 0 0 50%;
    min-width: 0;
    background-color: $cyan-bg;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  // ── Right panel ─────────────────────────────────────────────────────────────
  &__right {
    flex: 0 0 50%;
    min-width: 0;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 60px;
    overflow-y: auto;
  }
}

// ─── Illustration ─────────────────────────────────────────────────────────────
.illustration-wrapper {
  width: 100%;
  max-width: 500px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 20px;
}

.illustration {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: bottom center;
}

// ─── Error content ────────────────────────────────────────────────────────────
.error-content {
  width: 100%;
  text-align: center;
  max-width: 420px;

  &__code {
    font-size: clamp(80px, 14vw, 160px);
    font-weight: 900;
    line-height: 1;
    color: $black;
    letter-spacing: -0.025em;
    margin-bottom: 20px;
    font-family: $font-primary;
  }

  &__title {
    font-size: clamp(22px, 3.5vw, 38px);
    font-weight: 700;
    color: $black;
    line-height: 1.3;
    margin-bottom: 20px;
  }

  &__description {
    font-size: clamp(14px, 1.6vw, 15px);
    color: $gray-text;
    line-height: 1.7;
    margin-bottom: 36px;
  }

  &__btn {
    display: inline-block;
    padding: 14px 36px;
    background-color: $black;
    color: $white;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
    font-family: $font-primary;

    &:hover {
      opacity: 0.82;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      opacity: 1;
    }

    &:focus-visible {
      outline: 3px solid $cyan-bg;
      outline-offset: 3px;
    }
  }
}

// ─── Responsive ───────────────────────────────────────────────────────────────

// Large laptops / small desktops
@media (max-width: $bp-desktop-lg) {
  .content__right {
    padding: 40px 40px;
  }
}

// Tablets (landscape) – still side by side, tighter spacing
@media (max-width: $bp-tablet) {
  .navbar__logo {
    font-size: 1.6rem;
  }

  .content__right {
    padding: 32px 28px;
  }

  .illustration-wrapper {
    padding: 0 12px;
  }

  .error-content {
    &__description {
      margin-bottom: 28px;
    }
  }
}

// Tablets (portrait) & phones – stack panels
@media (max-width: $bp-mobile) {
  .not-found-page {
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: auto;
  }

  .navbar__logo {
    top: 16px;
    left: 16px;
    font-size: 1.4rem;
    letter-spacing: 0.15em;
  }

  .content {
    flex-direction: column;
    overflow: visible;

    &__left {
      flex: 0 0 auto;
      height: 55vw;
      min-height: 280px;
      max-height: 420px;
      padding-top: 56px; // keep illustration clear of the logo
    }

    &__right {
      flex: 1 0 auto;
      padding: 40px 24px 60px;
      overflow-y: visible;
    }
  }

  .illustration-wrapper {
    max-width: 380px;
  }

  .error-content {
    max-width: 480px;

    &__code {
      font-size: clamp(80px, 20vw, 120px);
      margin-bottom: 16px;
    }

    &__title {
      margin-bottom: 16px;
    }
  }
}

// Small phones
@media (max-width: $bp-mobile-sm) {
  .navbar__logo {
    font-size: 1.2rem;
    top: 14px;
    left: 14px;
  }

  .content {
    &__left {
      height: 65vw;
      min-height: 240px;
      padding-top: 48px;
    }

    &__right {
      padding: 32px 20px 48px;
    }
  }

  .illustration-wrapper {
    max-width: 300px;
    padding: 0 8px;
  }

  .error-content {
    &__description {
      margin-bottom: 24px;

      br {
        display: none; // let text wrap naturally on narrow screens
      }
    }

    // full-width, easy-to-tap button
    &__btn {
      width: 100%;
      padding: 16px 24px;
    }
  }
}

// Very small phones
@media (max-width: 360px) {
  .navbar__logo {
    font-size: 1.05rem;
    letter-spacing: 0.1em;
  }

  .error-content__code {
    letter-spacing: -0.02em;
  }
}

// Phones in landscape (short viewport) – keep side by side, avoid cramped stacking
@media (max-height: 500px) and (orientation: landscape) {
  .not-found-page {
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: auto;
  }

  .navbar__logo {
    font-size: 1.1rem;
  }

  .content {
    flex-direction: row;
    overflow: visible;

    &__left {
      flex: 0 0 45%;
      height: auto;
      min-height: 0;
      max-height: none;
      padding-top: 40px;
    }

    &__right {
      flex: 0 0 55%;
      padding: 24px 24px;
      overflow-y: visible;
    }
  }

  .illustration-wrapper {
    max-width: 280px;
  }

  .error-content {
    &__code {
      font-size: clamp(56px, 12vh, 90px);
      margin-bottom: 8px;
    }

    &__title {
      font-size: 20px;
      margin-bottom: 8px;
    }

    &__description {
      margin-bottom: 16px;
    }

    &__btn {
      width: auto;
      padding: 12px 28px;
    }
  }
}

// Respect reduced-motion preferences
@media (prefers-reduced-motion: reduce) {
  .error-content__btn {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>