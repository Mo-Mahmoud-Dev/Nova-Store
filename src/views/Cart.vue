<template>
  <div class="cart-page">
    <!-- Header -->
    <header class="cart-head">
      <div>
        <p class="crumbs">
          <RouterLink to="/">Home</RouterLink> / <RouterLink to="/products">Shop</RouterLink> /
          <strong>Shopping bag</strong>
        </p>
        <div class="title-row">
          <h1>Your shopping bag</h1>
          <span v-if="cart.items.length" class="pill">
            {{ cart.items.length }} unique item{{ cart.items.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
      <p class="secure"><ion-icon name="lock-closed-outline"></ion-icon> Encrypted 256-bit checkout</p>
    </header>

    <!-- Free delivery progress -->
    <div v-if="cart.items.length" class="ship-bar">
      <div class="ship-text">
        <span>
          <ion-icon name="car-outline"></ion-icon>
          <template v-if="remainingForFree > 0">
            You are only {{ fmt(remainingForFree) }} EGP away from free express delivery.
          </template>
          <template v-else>You've unlocked free express delivery.</template>
        </span>
        <small>{{ fmt(Math.min(qualifying, FREE_SHIPPING_AT)) }} / {{ fmt(FREE_SHIPPING_AT) }} EGP</small>
      </div>
      <div class="track"><div class="fill" :style="{ width: progress + '%' }"></div></div>
    </div>

    <!-- Empty state -->
    <section v-if="!cart.items.length" class="empty">
      <h2>Your bag is empty</h2>
      <p>Add something from the collection and it will show up here.</p>
      <RouterLink to="/products" class="btn-dark">Browse products</RouterLink>
    </section>

    <div v-else class="layout">
      <!-- Items -->
      <section class="items">
        <div class="cols">
          <span>Garment &amp; details</span><span>Unit price</span><span>Quantity</span><span>Total</span>
        </div>

        <article v-for="item in cart.items" :key="item.id" class="item">
          <div class="thumb">
            <span v-if="item.discount" class="off">-{{ item.discount }}%</span>
            <img :src="item.image" :alt="item.title" />
          </div>

          <div class="info">
            <small class="sku">{{ item.sku }}</small>
            <h3>{{ item.title }}</h3>
            <p v-if="item.color || item.size" class="meta">
              <span v-if="item.color">Color: {{ item.color }}</span>
              <span v-if="item.size">Size: {{ item.size }}</span>
            </p>
            <div class="links">
              <button type="button" @click="wishlist.toggle(item)">
                <ion-icon :name="wishlist.isWished(item.id) ? 'heart' : 'heart-outline'"></ion-icon>
                Wishlist
              </button>
              <button type="button" @click="cart.remove(item.id)">
                <ion-icon name="trash-outline"></ion-icon> Remove
              </button>
            </div>
          </div>

          <div class="unit">
            {{ fmt(item.price) }} EGP
            <s v-if="item.oldPrice">{{ fmt(item.oldPrice) }} EGP</s>
          </div>

          <div class="qty">
            <button type="button" :disabled="item.qty <= 1" aria-label="Decrease quantity" @click="cart.setQty(item.id, item.qty - 1)">
              <ion-icon name="remove-outline"></ion-icon>
            </button>
            <span>{{ item.qty }}</span>
            <button type="button" aria-label="Increase quantity" @click="cart.setQty(item.id, item.qty + 1)">
              <ion-icon name="add-outline"></ion-icon>
            </button>
          </div>

          <div class="line-total">{{ fmt(item.price * item.qty) }} EGP</div>
        </article>

        <div class="bag-actions">
          <RouterLink to="/products"><ion-icon name="arrow-back-outline"></ion-icon> Continue exploring</RouterLink>
          <button type="button" @click="cart.clear()">Clear shopping bag</button>
        </div>

        <div class="gift">
          <button type="button" class="gift-toggle" :aria-expanded="giftOpen" @click="giftOpen = !giftOpen">
            <span><ion-icon name="gift-outline"></ion-icon> Gift packaging &amp; special instructions</span>
            <ion-icon name="chevron-down-outline" :class="{ flip: giftOpen }"></ion-icon>
          </button>
          <div v-if="giftOpen" class="gift-body">
            <label><input v-model="giftWrap" type="checkbox" /> Add complimentary gift packaging</label>
            <textarea v-model="note" rows="3" placeholder="Message or delivery instructions (optional)"></textarea>
          </div>
        </div>
      </section>

      <!-- Summary -->
      <aside class="summary-col">
        <div class="summary">
          <div class="sum-head">
            <h2>Order summary</h2>
            <small>{{ cart.count }} item{{ cart.count > 1 ? 's' : '' }}</small>
          </div>

          <dl>
            <div><dt>Subtotal</dt><dd>{{ fmt(cart.subtotal) }} EGP</dd></div>
            <div v-if="discount > 0" class="gold">
              <dt>Seasonal privilege <span class="code">{{ voucher }}</span></dt>
              <dd>-{{ fmt(discount) }} EGP</dd>
            </div>
            <div>
              <dt>
                Delivery
                <small v-if="shipping === 0">Free delivery threshold reached</small>
              </dt>
              <dd class="small">{{ shipping === 0 ? 'Free' : fmt(shipping) + ' EGP' }}</dd>
            </div>
            <div>
              <dt>Estimated VAT (14%)</dt>
              <dd>Included</dd>
            </div>
          </dl>

          <div class="total">
            <div>
              <strong>Total</strong>
              <small>All taxes and shipping duties accounted</small>
            </div>
            <div class="amount">{{ fmt(total) }}<span>EGP</span></div>
          </div>

          <form class="voucher" @submit.prevent="applyVoucher">
            <label for="voucher">Voucher / privilege code</label>
            <div class="voucher-row">
              <input id="voucher" v-model.trim="voucherInput" type="text" placeholder="Enter code" />
              <button type="submit">Apply</button>
            </div>
            <p v-if="voucherMsg" class="voucher-msg" :class="{ bad: voucherBad }">{{ voucherMsg }}</p>
          </form>

          <button type="button" class="btn-dark block" @click="checkout">
            Proceed to checkout <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>

          <div class="or"><span>Or express pay</span></div>
          <div class="express">
            <button type="button"> Pay</button>
            <button type="button">G Pay</button>
          </div>

          <ul class="assure">
            <li><ion-icon name="shield-checkmark-outline"></ion-icon> Guaranteed safe &amp; secure checkout</li>
            <li><ion-icon name="refresh-outline"></ion-icon> 14-day free returns &amp; exchanges</li>
            <li><ion-icon name="archive-outline"></ion-icon> Discreet signature box packaging</li>
          </ul>
          <div class="pay-tags"><span>Visa</span><span>Mastercard</span><span>Meeza</span><span>Cash on delivery</span></div>
        </div>

        <div class="advice">
          <p><strong>Need styling advice?</strong><br />Our concierge is available on WhatsApp</p>
          <a href="https://wa.me/" target="_blank" rel="noopener">Connect</a>
        </div>
      </aside>
    </div>

    <!-- Complete your look -->
    <section v-if="suggestions.length" class="look">
      <div class="look-head">
        <div>
          <p class="eyebrow">Curated pairings</p>
          <h2>Complete your look</h2>
        </div>
        <p class="look-sub">Hand-selected pieces that go with what's already in your bag.</p>
      </div>
      <div class="look-grid">
        <article v-for="p in suggestions" :key="p.id" class="look-card">
          <div class="look-img"><img :src="p.image" :alt="p.title" loading="lazy" /></div>
          <small>{{ p.type || p.category }}</small>
          <h3>{{ p.title }}</h3>
          <div class="look-foot">
            <span>{{ fmt(p.price) }} EGP</span>
            <button type="button" @click="cart.add(p)">Add to bag</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore, VOUCHERS, FREE_SHIPPING_AT, SHIPPING_FEE } from '../stores/cart'
import { useProductsStore } from '../stores/products'
import { useWishlistStore } from '../stores/wishlist'

const cart = useCartStore()
const products = useProductsStore()
const wishlist = useWishlistStore()
const router = useRouter()


const voucher = ref(cart.voucher)
const voucherInput = ref(cart.voucher)
const voucherMsg = ref('')
const voucherBad = ref(false)
const giftOpen = ref(false)
const giftWrap = computed({ get: () => cart.giftWrap, set: (v) => (cart.giftWrap = v) })
const note = computed({ get: () => cart.note, set: (v) => (cart.note = v) })

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })

const discount = computed(() => Math.round(cart.subtotal * (VOUCHERS[voucher.value] || 0)))
const qualifying = computed(() => cart.subtotal - discount.value)
const remainingForFree = computed(() => Math.max(0, FREE_SHIPPING_AT - qualifying.value))
const progress = computed(() => Math.min(100, (qualifying.value / FREE_SHIPPING_AT) * 100))
const shipping = computed(() => (remainingForFree.value === 0 || !cart.items.length ? 0 : SHIPPING_FEE))
const total = computed(() => qualifying.value + shipping.value) // VAT is included in prices

function applyVoucher() {
  const code = voucherInput.value.toUpperCase()
  if (VOUCHERS[code]) {
    voucher.value = code
    cart.setVoucher(code)
    voucherBad.value = false
    voucherMsg.value = `Code ${code} applied.`
  } else {
    voucher.value = ''
    cart.setVoucher('')
    voucherBad.value = true
    voucherMsg.value = 'This code is not valid. Check it and try again.'
  }
}

// Up to 4 products not already in the bag, in random order
const suggestions = computed(() => {
  const inBag = new Set(cart.items.map((i) => i.id))
  const pool = products.products.filter((p) => !inBag.has(p.id))
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, 4)
})

function checkout() {
  router.push('/checkout') // adjust to your checkout route
}
</script>

<style scoped>
.cart-page {
  --ink: #111;
  --muted: #6f6a66;
  --line: #ebe6e2;
  --paper: #fbf8f6;
  --gold: #a6790c;
  --bar: #f5b71e;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
}
button { font: inherit; color: inherit; cursor: pointer; }
a { color: inherit; }
button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* Header */
.cart-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.crumbs { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
.crumbs a { text-decoration: none; }
.crumbs strong { color: var(--ink); }
.title-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
h1 { font-size: clamp(30px, 5vw, 42px); font-weight: 500; text-transform: uppercase; margin: 0; letter-spacing: -.01em; }
.pill { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; background: #eeeae6; padding: 6px 10px; }
.secure { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin: 0; }

/* Progress */
.ship-bar { background: var(--paper); padding: 14px 16px 12px; margin: 24px 0 0; }
.ship-text { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; margin-bottom: 10px; }
.ship-text ion-icon { color: var(--bar); vertical-align: -3px; margin-right: 6px; }
.ship-text small { font-size: 11px; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.track { height: 3px; background: #e6e1dc; }
.fill { height: 100%; background: var(--bar); transition: width .4s ease; }

/* Layout */
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 40px; background: var(--paper); margin: 32px -24px 0; padding: 48px 24px 56px; align-items: start; }
.cols { display: grid; grid-template-columns: 1fr 110px 130px 110px; padding: 0 16px 16px; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.cols span:not(:first-child) { text-align: center; }
.cols span:last-child { text-align: right; }

.item { display: grid; grid-template-columns: 96px 1fr 110px 130px 110px; gap: 16px; align-items: center; background: #fff; padding: 16px; margin-bottom: 16px; }
.thumb { position: relative; aspect-ratio: 3 / 4; background: #f0ece8; overflow: hidden; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.off { position: absolute; top: 6px; left: 6px; background: #c62828; color: #fff; font-size: 10px; padding: 2px 6px; }
.sku { font-size: 11px; letter-spacing: .08em; color: var(--muted); }
.info h3 { font-size: 18px; font-weight: 500; text-transform: uppercase; margin: 4px 0 6px; line-height: 1.2; }
.meta { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 13px; color: var(--muted); margin: 0 0 10px; }
.meta span + span { border-left: 1px solid #ccc; padding-left: 12px; }
.links { display: flex; gap: 16px; }
.links button { border: 0; background: none; padding: 0; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 4px; }
.links button:hover { color: var(--ink); }
.unit { text-align: center; font-size: 14px; }
.unit s { display: block; color: #aaa; font-size: 12px; }
.qty { display: flex; align-items: center; justify-content: space-between; background: #f2eeea; padding: 6px; }
.qty button { width: 28px; height: 28px; border: 0; background: transparent; display: grid; place-items: center; }
.qty button:hover:not(:disabled) { background: #e6e0db; }
.qty button:disabled { opacity: .35; cursor: default; }
.line-total { text-align: right; font-size: 17px; font-weight: 500; }

.bag-actions { display: flex; justify-content: space-between; margin: 28px 0; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
.bag-actions a { display: flex; align-items: center; gap: 8px; text-decoration: none; font-weight: 600; }
.bag-actions button { border: 0; background: none; color: var(--muted); font-size: inherit; letter-spacing: inherit; text-transform: inherit; }
.bag-actions button:hover { color: var(--ink); }

.gift { background: #fff; }
.gift-toggle { width: 100%; display: flex; justify-content: space-between; align-items: center; border: 0; background: none; padding: 18px 16px; font-size: 15px; }
.gift-toggle span { display: flex; align-items: center; gap: 10px; }
.gift-toggle .flip { transform: rotate(180deg); }
.gift-body { padding: 0 16px 16px; display: grid; gap: 12px; font-size: 14px; }
.gift-body textarea { width: 100%; border: 1px solid var(--line); padding: 10px; font: inherit; resize: vertical; }

/* Summary */
.summary { background: #fff; padding: 28px; }
.sum-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
.sum-head h2 { font-size: 24px; font-weight: 500; text-transform: uppercase; margin: 0; }
.sum-head small { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
dl { margin: 0; display: grid; gap: 14px; }
dl > div { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; }
dt small { display: block; font-size: 11px; color: var(--muted); margin-top: 4px; }
dd { margin: 0; text-align: right; }
dd.small { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; font-weight: 600; }
.gold { color: var(--gold); }
.code { font-size: 10px; letter-spacing: .06em; background: #eeeae6; color: var(--ink); padding: 3px 7px; margin-left: 6px; }
.total { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid var(--line); margin-top: 22px; padding-top: 22px; }
.total strong { font-size: 16px; text-transform: uppercase; display: block; margin-bottom: 4px; }
.total small { font-size: 12px; color: var(--muted); }
.amount { font-size: 44px; font-weight: 300; line-height: 1; text-align: right; }
.amount span { display: block; font-size: 13px; margin-top: 6px; }

.voucher { margin: 26px 0 20px; }
.voucher label { display: block; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; }
.voucher-row { display: flex; }
.voucher-row input { flex: 1; min-width: 0; border: 0; background: #f2eeea; padding: 12px; font: inherit; font-size: 14px; border: none; outline: none; }
.voucher-row button { border: 0; background: #ebe6e1; padding: 0 18px; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; }
.voucher-msg { font-size: 12px; margin: 8px 0 0; color: #2e7d32; }
.voucher-msg.bad { color: #b91c1c; }

.btn-dark { display: inline-flex; align-items: center; justify-content: center; gap: 10px; background: #000; color: #fff; border: 0; padding: 16px 28px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; }
.btn-dark:hover { background: #2a2a2a; }
.btn-dark.block { width: 100%; }
.or { text-align: center; margin: 16px 0; position: relative; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.or::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: var(--line); }
.or span { position: relative; background: #fff; padding: 0 10px; }
.express { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.express button { border: 0; background: #f2eeea; padding: 12px; font-weight: 600; font-size: 14px; }
.express button:hover { background: #e9e4df; }
.assure { list-style: none; padding: 0; margin: 24px 0 14px; display: grid; gap: 10px; font-size: 13px; }
.assure li { display: flex; gap: 8px; align-items: center; }
.assure ion-icon { font-size: 18px; flex-shrink: 0; }
.pay-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.pay-tags span { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; background: var(--paper); padding: 6px 10px; }
.advice { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 16px; background: #f3efeb; padding: 16px; font-size: 13px; }
.advice p { margin: 0; line-height: 1.5; }
.advice strong { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
.advice a { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; white-space: nowrap; }

/* Empty */
.empty { text-align: center; padding: 100px 0; }
.empty h2 { font-size: 28px; font-weight: 500; margin: 0 0 8px; }
.empty p { color: var(--muted); margin: 0 0 24px; }

/* Complete your look */
.look { margin-top: 64px; }
.look-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.eyebrow { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
.look-head h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 500; text-transform: uppercase; margin: 0; }
.look-sub { max-width: 320px; font-size: 13px; color: var(--muted); margin: 0; }
.look-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.look-card { background: var(--paper); padding: 8px 8px 16px; }
.look-img { aspect-ratio: 4 / 5; background: #eee; overflow: hidden; margin-bottom: 12px; }
.look-img img { width: 100%; height: 100%; object-fit: cover; }
.look-card small { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.look-card h3 { font-size: 18px; font-weight: 500; text-transform: uppercase; margin: 4px 0 8px; line-height: 1.25; }
.look-foot { display: flex; justify-content: space-between; align-items: center; font-size: 15px; }
.look-foot button { border: 0; background: none; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }

/* Responsive */
@media (max-width: 1000px) {
  .layout { grid-template-columns: 1fr; }
  .look-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 720px) {
  .cols { display: none; }
  .item { grid-template-columns: 84px 1fr; }
  .unit, .qty, .line-total { grid-column: 2; text-align: left; }
  .unit s { display: inline; margin-left: 8px; }
  .qty { width: 130px; }
  .line-total { font-size: 16px; }
  .ship-text { flex-direction: column; }
}
</style>