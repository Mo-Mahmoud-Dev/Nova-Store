<template>
  <footer class="footer">
    <div class="footer-container">

      <div class="footer-brand">
        <h2>NOVA Store</h2>
        <p>
          Premium essentials. Effortless style.
        </p>
      </div>

      <div class="footer-column">
        <h3>Shop</h3>
        <RouterLink to="/products?filter=men">Men</RouterLink>
        <RouterLink to="/products?filter=women">Women</RouterLink>
        <RouterLink to="/products?filter=accessories">Accessories</RouterLink>
        <RouterLink to="/products?filter=new">New Arrivals</RouterLink>
      </div>

      <div class="footer-column">
        <h3>Customer Service</h3>
        <RouterLink to="/contact-us">Shipping & Delivery</RouterLink>
        <RouterLink to="/contact-us">Returns</RouterLink>
        <RouterLink to="/contact-us">FAQ</RouterLink>
        <RouterLink to="/contact-us">Contact Us</RouterLink>
      </div>

      <div class="footer-column">
        <h3>Follow Us</h3>
        <a href="https://github.com/Mo-Mahmoud-Dev" target="_blank">Instagram</a>
        <a href="https://github.com/Mo-Mahmoud-Dev" target="_blank">Facebook</a>
        <a href="https://github.com/Mo-Mahmoud-Dev" target="_blank">TikTok</a>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© 2026 Built by <a href="https://github.com/Mo-Mahmoud-Dev" target="_blank">@Mo-Mahmoud-Dev</a> . All rights reserved.</p>
      <div class="footer-bottom-links">
        <RouterLink to="/privacy-policy" class="footer-bottom-link">
          Privacy Policy
        </RouterLink>
        <RouterLink to="/terms-of-service" class="footer-bottom-link">
          Terms of Service
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  flex-shrink: 0;
  background: #ffffff;
  border-top: 1px solid #ececec;
  padding: 64px 48px 32px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #1a1a1a;
}

.footer-container {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 48px;
}

/* Brand block */
.footer-brand h2 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 14px;
}

.footer-brand p {
  font-size: 14px;
  line-height: 1.6;
  color: #6b6b6b;
  max-width: 260px;
  margin: 0;
}

/* Columns */
.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-column h3 {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 18px;
  color: #1a1a1a;
}

.footer-column a {
  font-size: 14px;
  color: #6b6b6b;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s ease;
  width: fit-content;
}

.footer-column a:hover {
  color: #1a1a1a;
}

/* Bottom bar */
.footer-bottom {
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid #ececec;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p , .footer-bottom p a{
  font-size: 13px;
  color: #8a8a8a;
  margin: 0;
  transition: color 0.3s ease;
  text-decoration: none;
}
.footer-bottom p a:hover{
  color: #0e0a0a;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-bottom-link {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1a1a1a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-bottom-link:hover {
  color: #6b6b6b;
}

/* Responsive */
@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    row-gap: 40px;
  }
}

@media (max-width: 560px) {
  .footer {
    padding: 48px 24px 24px;
  }
  .footer-container {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .footer-bottom-links {
    flex-wrap: wrap;
    gap: 16px;
  }
}

</style>