<template>
  <div class="checkout-page">
    <header class="co-head">
      <div>
        <p class="crumbs">
          <RouterLink :to="{ name: 'home' }">Home</RouterLink> / <RouterLink to="/cart">Bag</RouterLink> /
          <strong>Checkout</strong>
        </p>
        <h1>Checkout</h1>
      </div>
      <p class="secure"><ion-icon name="lock-closed-outline"></ion-icon> Encrypted 256-bit checkout</p>
    </header>

    <ol class="steps" aria-label="Checkout progress">
      <li class="done">Bag</li>
      <li class="current" aria-current="step">Details &amp; payment</li>
      <li>Confirmation</li>
    </ol>

    <div class="layout">
      <form id="checkout-form" class="forms" novalidate @submit.prevent="placeOrder">
        <!-- 1. Contact -->
        <section class="card">
          <h2><span>1</span> Contact</h2>
          <div class="grid">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" v-model.trim="form.email" type="email" autocomplete="email" :aria-invalid="!!errors.email" />
              <p v-if="errors.email" class="err">{{ errors.email }}</p>
            </div>
            <div class="field">
              <label for="phone">Mobile number</label>
              <input id="phone" v-model.trim="form.phone" type="tel" inputmode="numeric" placeholder="01XXXXXXXXX" autocomplete="tel" :aria-invalid="!!errors.phone" />
              <p v-if="errors.phone" class="err">{{ errors.phone }}</p>
            </div>
          </div>
        </section>

        <!-- 2. Shipping -->
        <section class="card">
          <h2><span>2</span> Shipping address</h2>
          <div class="grid">
            <div class="field full">
              <label for="name">Full name</label>
              <input id="name" v-model.trim="form.name" type="text" autocomplete="name" :aria-invalid="!!errors.name" />
              <p v-if="errors.name" class="err">{{ errors.name }}</p>
            </div>
            <div class="field">
              <label for="gov">Governorate</label>
              <select id="gov" v-model="form.governorate" :aria-invalid="!!errors.governorate">
                <option value="" disabled>Select governorate</option>
                <option v-for="g in GOVERNORATES" :key="g" :value="g">{{ g }}</option>
              </select>
              <p v-if="errors.governorate" class="err">{{ errors.governorate }}</p>
            </div>
            <div class="field">
              <label for="city">City / area</label>
              <input id="city" v-model.trim="form.city" type="text" :aria-invalid="!!errors.city" />
              <p v-if="errors.city" class="err">{{ errors.city }}</p>
            </div>
            <div class="field full">
              <label for="address">Street address</label>
              <input id="address" v-model.trim="form.address" type="text" autocomplete="street-address" :aria-invalid="!!errors.address" />
              <p v-if="errors.address" class="err">{{ errors.address }}</p>
            </div>
            <div class="field">
              <label for="building">Building / apartment <small>(optional)</small></label>
              <input id="building" v-model.trim="form.building" type="text" />
            </div>
            <div class="field">
              <label for="notes">Delivery notes <small>(optional)</small></label>
              <input id="notes" v-model.trim="form.notes" type="text" />
            </div>
          </div>
        </section>

        <!-- 3. Delivery -->
        <section class="card">
          <h2><span>3</span> Delivery method</h2>
          <div class="options">
            <label v-for="m in methods" :key="m.key" class="option" :class="{ on: form.delivery === m.key }">
              <input v-model="form.delivery" type="radio" name="delivery" :value="m.key" />
              <span class="o-main"><strong>{{ m.label }}</strong><small>{{ m.eta }}</small></span>
              <span class="o-price">{{ feeFor(m) === 0 ? 'Free' : fmt(feeFor(m)) + ' EGP' }}</span>
            </label>
          </div>
        </section>

        <!-- 4. Payment -->
        <section class="card">
          <h2><span>4</span> Payment</h2>
          <div class="options">
            <label class="option" :class="{ on: form.payment === 'card' }">
              <input v-model="form.payment" type="radio" name="payment" value="card" />
              <span class="o-main"><strong>Credit / debit card</strong><small>Visa, Mastercard, Meeza</small></span>
            </label>
            <label class="option" :class="{ on: form.payment === 'cod' }">
              <input v-model="form.payment" type="radio" name="payment" value="cod" />
              <span class="o-main"><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span>
            </label>
          </div>

          <div v-if="form.payment === 'card'" class="grid card-fields">
            <div class="field full">
              <label for="cardNumber">Card number</label>
              <input id="cardNumber" v-model="form.cardNumber" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23" :aria-invalid="!!errors.cardNumber" @input="formatCard" />
              <p v-if="errors.cardNumber" class="err">{{ errors.cardNumber }}</p>
            </div>
            <div class="field">
              <label for="exp">Expiry (MM/YY)</label>
              <input id="exp" v-model="form.exp" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" :aria-invalid="!!errors.exp" @input="formatExp" />
              <p v-if="errors.exp" class="err">{{ errors.exp }}</p>
            </div>
            <div class="field">
              <label for="cvc">CVC</label>
              <input id="cvc" v-model="form.cvc" type="text" inputmode="numeric" autocomplete="cc-csc" maxlength="4" :aria-invalid="!!errors.cvc" />
              <p v-if="errors.cvc" class="err">{{ errors.cvc }}</p>
            </div>
          </div>
        </section>

        <p v-if="submitError" class="err block" role="alert">{{ submitError }}</p>

        <!-- Mobile place-order button -->
        <button type="submit" class="btn-dark block mobile-only" :disabled="submitting">
          {{ submitting ? 'Placing order…' : `Place order · ${fmt(total)} EGP` }}
        </button>
      </form>

      <aside class="summary-col">
        <div class="summary">
          <button type="button" class="sum-toggle" :aria-expanded="open" @click="open = !open">
            <span>Order summary · {{ cart.count }} item{{ cart.count > 1 ? 's' : '' }}</span>
            <span>{{ fmt(total) }} EGP <ion-icon name="chevron-down-outline" :class="{ flip: open }"></ion-icon></span>
          </button>

          <div class="sum-body" :class="{ open }">
            <h2 class="sum-title">Order summary</h2>
            <ul class="lines">
              <li v-for="i in cart.items" :key="i.id">
                <div class="thumb"><img :src="i.image" :alt="i.title" /><b>{{ i.qty }}</b></div>
                <div class="l-info">
                  <span>{{ i.title }}</span>
                  <small v-if="i.color || i.size">{{ [i.color, i.size].filter(Boolean).join(' / ') }}</small>
                </div>
                <span>{{ fmt(i.price * i.qty) }} EGP</span>
              </li>
            </ul>

            <dl>
              <div><dt>Subtotal</dt><dd>{{ fmt(cart.subtotal) }} EGP</dd></div>
              <div v-if="discount > 0" class="gold">
                <dt>Seasonal privilege <span class="code">{{ cart.voucher }}</span></dt>
                <dd>-{{ fmt(discount) }} EGP</dd>
              </div>
              <div><dt>Delivery</dt><dd>{{ shipping === 0 ? 'Free' : fmt(shipping) + ' EGP' }}</dd></div>
              <div><dt>VAT (14%)</dt><dd>Included</dd></div>
            </dl>

            <div class="total">
              <strong>Total</strong>
              <div class="amount">{{ fmt(total) }} <span>EGP</span></div>
            </div>

            <button type="submit" form="checkout-form" class="btn-dark block desk-only" :disabled="submitting">
              {{ submitting ? 'Placing order…' : 'Place order' }}
            </button>
            <p class="legal">By placing your order you agree to our terms and return policy.</p>
            <RouterLink to="/cart" class="edit">Edit bag</RouterLink>

            <ul class="assure">
              <li><ion-icon name="shield-checkmark-outline"></ion-icon> Guaranteed safe &amp; secure checkout</li>
              <li><ion-icon name="refresh-outline"></ion-icon> 14-day free returns &amp; exchanges</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore, VOUCHERS, FREE_SHIPPING_AT, SHIPPING_FEE } from '../stores/cart'
import { useOrderStore } from '../stores/order'

const cart = useCartStore()
const orders = useOrderStore()
const router = useRouter()

const GOVERNORATES = ['Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia', 'New Valley', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said', 'Damietta', 'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh', 'Luxor', 'Qena', 'North Sinai', 'Sohag']

// Standard follows the cart's rule (free over the threshold); Express is always paid.
const methods = [
  { key: 'standard', label: 'Standard delivery', eta: '3–5 working days', fee: SHIPPING_FEE, freeOver: true },
  { key: 'express', label: 'Express delivery', eta: '1–2 working days', fee: 100, freeOver: false },
]

const form = reactive({
  email: '', phone: '', name: '', governorate: '', city: '', address: '', building: '', notes: '',
  delivery: 'standard', payment: 'cod', cardNumber: '', exp: '', cvc: '',
})
const errors = reactive({})
const open = ref(false)
const submitting = ref(false)
const submitError = ref('')

const fmt = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })

const discount = computed(() => Math.round(cart.subtotal * (VOUCHERS[cart.voucher] || 0)))
const qualifying = computed(() => cart.subtotal - discount.value)
function feeFor(m) {
  return m.freeOver && qualifying.value >= FREE_SHIPPING_AT ? 0 : m.fee
}
const shipping = computed(() => feeFor(methods.find((m) => m.key === form.delivery)))
const total = computed(() => qualifying.value + shipping.value) // VAT is included in prices

onMounted(() => {
  if (!cart.items.length) router.replace('/cart')
})

function formatCard() {
  form.cardNumber = form.cardNumber.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
}
function formatExp() {
  const d = form.exp.replace(/\D/g, '').slice(0, 4)
  form.exp = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  const req = { name: 'Enter your full name.', governorate: 'Select a governorate.', city: 'Enter your city or area.', address: 'Enter your street address.' }
  for (const [k, msg] of Object.entries(req)) if (!form[k]) errors[k] = msg
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!/^01[0125]\d{8}$/.test(form.phone)) errors.phone = 'Enter an 11-digit Egyptian mobile number, e.g. 01012345678.'
  if (form.payment === 'card') {
    if (form.cardNumber.replace(/\s/g, '').length < 15) errors.cardNumber = 'Enter a valid card number.'
    const m = /^(\d{2})\/(\d{2})$/.exec(form.exp)
    if (!m || +m[1] < 1 || +m[1] > 12) errors.exp = 'Use the format MM/YY.'
    if (!/^\d{3,4}$/.test(form.cvc)) errors.cvc = 'Enter the 3 or 4 digit code.'
  }
  return Object.keys(errors).length === 0
}

async function placeOrder() {
  submitError.value = ''
  if (!validate()) {
    await nextTick()
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  submitting.value = true
  try {
    // TODO: replace with your API / payment-gateway call. Never send or store raw card data yourself.
    await new Promise((r) => setTimeout(r, 800))

    const method = methods.find((m) => m.key === form.delivery)
    orders.setLastOrder({
      number: 'NV-' + Date.now().toString().slice(-8),
      placedAt: new Date().toISOString(),
      items: cart.items.map((i) => ({ ...i })),
      subtotal: cart.subtotal,
      discount: discount.value,
      shipping: shipping.value,
      total: total.value,
      delivery: { label: method.label, eta: method.eta },
      payment: form.payment === 'card' ? 'Card' : 'Cash on delivery',
      giftWrap: cart.giftWrap,
      note: cart.note,
      customer: { name: form.name, email: form.email, phone: form.phone },
      address: [form.address, form.building, form.city, form.governorate].filter(Boolean).join(', '),
    })
    cart.clear()
    router.push('/order-confirmation')
  } catch {
    submitError.value = 'We could not place your order. Check your connection and try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  --ink: #111; --muted: #6f6a66; --line: #ebe6e2; --paper: #fbf8f6; --gold: #a6790c; --field: #f2eeea;
  max-width: 1280px; margin: 0 auto; padding: 32px 24px 80px; color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
}
button { font: inherit; color: inherit; cursor: pointer; }
a { color: inherit; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.co-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.crumbs { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
.crumbs a { text-decoration: none; }
.crumbs strong { color: var(--ink); }
h1 { font-size: clamp(30px, 5vw, 42px); font-weight: 500; text-transform: uppercase; margin: 0; }
.secure { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin: 0; }

.steps { list-style: none; display: flex; gap: 8px; padding: 0; margin: 24px 0 0; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.steps li { flex: 1; padding-top: 10px; border-top: 3px solid #e6e1dc; }
.steps .done, .steps .current { color: var(--ink); }
.steps .done { border-color: var(--ink); }
.steps .current { border-color: #f5b71e; font-weight: 600; }

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 40px; background: var(--paper); margin: 32px -24px 0; padding: 40px 24px 56px; align-items: start; }
.forms { display: grid; gap: 16px; }
.card { background: #fff; padding: 28px; }
.card h2 { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 500; text-transform: uppercase; margin: 0 0 20px; }
.card h2 span { width: 26px; height: 26px; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 12px; border-radius: 50%; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.field.full { grid-column: 1 / -1; }
.field label { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.field label small { text-transform: none; letter-spacing: 0; }
.field input, .field select { border: 1px solid transparent; background: var(--field); padding: 13px 12px; font: inherit; font-size: 15px; border-radius: 0; }
.field [aria-invalid='true'] { border-color: #b91c1c; background: #fdf3f3; }
.err { color: #b91c1c; font-size: 12px; margin: 0; }
.err.block { font-size: 14px; }

.options { display: grid; gap: 10px; }
.option { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid var(--line); cursor: pointer; }
.option.on { border-color: var(--ink); background: var(--paper); }
.option input { accent-color: #000; }
.o-main { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 15px; }
.o-main small { color: var(--muted); font-size: 12px; }
.o-price { font-size: 14px; font-weight: 600; }
.card-fields { margin-top: 18px; }

.btn-dark { display: inline-flex; align-items: center; justify-content: center; background: #000; color: #fff; border: 0; padding: 16px 28px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
.btn-dark:hover:not(:disabled) { background: #2a2a2a; }
.btn-dark:disabled { opacity: .6; cursor: progress; }
.btn-dark.block { width: 100%; }

.summary-col { position: sticky; top: 100px; }
.summary { background: #fff; padding: 28px; }
.sum-toggle { display: none; }
.sum-title { font-size: 22px; font-weight: 500; text-transform: uppercase; margin: 0 0 18px; }
.lines { list-style: none; padding: 0; margin: 0 0 20px; display: grid; gap: 14px; }
.lines li { display: grid; grid-template-columns: 56px 1fr auto; gap: 12px; align-items: center; font-size: 14px; }
.thumb { position: relative; aspect-ratio: 3 / 4; background: #f0ece8; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb b { position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; display: grid; place-items: center; background: var(--ink); color: #fff; font-size: 10px; border-radius: 99px; }
.l-info { display: flex; flex-direction: column; gap: 2px; }
.l-info small { color: var(--muted); font-size: 12px; }
dl { margin: 0; display: grid; gap: 12px; border-top: 1px solid var(--line); padding-top: 18px; }
dl > div { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; }
dd { margin: 0; }
.gold { color: var(--gold); }
.code { font-size: 10px; letter-spacing: .06em; background: #eeeae6; color: var(--ink); padding: 3px 7px; margin-left: 6px; }
.total { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--line); margin: 18px 0 20px; padding-top: 18px; }
.total strong { text-transform: uppercase; }
.amount { font-size: 34px; font-weight: 300; }
.amount span { font-size: 13px; }
.legal { font-size: 12px; color: var(--muted); margin: 12px 0; }
.edit { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; }
.assure { list-style: none; padding: 0; margin: 22px 0 0; display: grid; gap: 10px; font-size: 13px; }
.assure li { display: flex; gap: 8px; align-items: center; }
.assure ion-icon { font-size: 18px; }
.mobile-only { display: none; }

@media (max-width: 1000px) {
  .layout { grid-template-columns: 1fr; }
  .summary-col { position: static; order: -1; }
  .summary { padding: 0; }
  .sum-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; border: 0; background: #fff; padding: 18px 20px; font-size: 14px; font-weight: 600; }
  .sum-toggle ion-icon { vertical-align: -3px; transition: transform .2s ease; }
  .sum-toggle .flip { transform: rotate(180deg); }
  .sum-body { display: none; padding: 0 20px 24px; }
  .sum-body.open { display: block; }
  .sum-title, .desk-only { display: none; }
  .mobile-only { display: inline-flex; position: sticky; bottom: 12px; z-index: 5; }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .card { padding: 20px; }
  .steps { font-size: 10px; }
}
</style>