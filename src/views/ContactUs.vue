<template>
  <div class="contact-page">
    <!-- Header -->
    <header class="head">
      <p class="crumbs">
        <RouterLink to="/">Home</RouterLink> / <strong>Contact us</strong>
      </p>
      <h1>Contact us</h1>
      <p class="lede">
        Questions about an order, a fit or a return? Send us a message and a real person will reply
        within one business day.
      </p>
    </header>

    <div class="layout">
      <!-- Form -->
      <section class="form-col" aria-labelledby="form-title">
        <h2 id="form-title">Send us a message</h2>

        <!-- Success -->
        <div v-if="sentRef" class="sent" role="status">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <h3>Thanks, {{ form.name.split(' ')[0] }}. Your message is on its way.</h3>
          <p>
            Your reference is <strong>{{ sentRef }}</strong>. We have sent a copy to
            {{ form.email }} and will reply within one business day.
          </p>
          <button type="button" class="btn-light" @click="reset">Send another message</button>
        </div>

        <form v-else novalidate @submit.prevent="submit">
          <div class="row">
            <div class="field">
              <label for="name">Full name</label>
              <input
                id="name" v-model.trim="form.name" type="text" autocomplete="name"
                :aria-invalid="!!show('name')" aria-describedby="name-err"
                @blur="touched.name = true"
              />
              <p v-if="show('name')" id="name-err" class="err">{{ errors.name }}</p>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input
                id="email" v-model.trim="form.email" type="email" autocomplete="email"
                :aria-invalid="!!show('email')" aria-describedby="email-err"
                @blur="touched.email = true"
              />
              <p v-if="show('email')" id="email-err" class="err">{{ errors.email }}</p>
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label for="phone">Phone <span class="opt">(optional)</span></label>
              <input
                id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel"
                placeholder="+20 100 000 0000"
                :aria-invalid="!!show('phone')" aria-describedby="phone-err"
                @blur="touched.phone = true"
              />
              <p v-if="show('phone')" id="phone-err" class="err">{{ errors.phone }}</p>
            </div>
            <div class="field">
              <label for="topic">What is this about?</label>
              <select id="topic" v-model="form.topic">
                <option v-for="t in topics" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
          </div>

          <div v-if="needsOrder" class="field">
            <label for="order">Order number <span class="opt">(optional)</span></label>
            <input id="order" v-model.trim="form.orderNo" type="text" placeholder="e.g. NV-10482" />
          </div>

          <div class="field">
            <label for="message">Message</label>
            <textarea
              id="message" v-model.trim="form.message" rows="6"
              :aria-invalid="!!show('message')" aria-describedby="message-err"
              @blur="touched.message = true"
            ></textarea>
            <p v-if="show('message')" id="message-err" class="err">{{ errors.message }}</p>
          </div>

          <button type="submit" class="btn-dark" :disabled="sending">
            {{ sending ? 'Sending…' : 'Send message' }}
          </button>
          <p class="fine">
            By sending this form you agree to our
            <RouterLink to="/terms-of-service">Terms of Service</RouterLink>.
          </p>
        </form>
      </section>

      <!-- Channels -->
      <aside class="channels">
        <h2>Prefer to talk?</h2>
        <ul class="ch-list">
          <li v-for="c in channels" :key="c.label">
            <a :href="c.href" :target="c.external ? '_blank' : undefined" :rel="c.external ? 'noopener' : undefined">
              <ion-icon :name="c.icon"></ion-icon>
              <span>
                <strong>{{ c.label }}</strong>
                <small>{{ c.value }}</small>
              </span>
            </a>
          </li>
        </ul>

        <h3>Support hours</h3>
        <dl class="hours">
          <div v-for="h in hours" :key="h.days">
            <dt>{{ h.days }}</dt>
            <dd>{{ h.time }}</dd>
          </div>
        </dl>
        <p class="tz">Cairo time (EET). Messages sent outside these hours are answered the next working day.</p>
      </aside>
    </div>

    <!-- Stores -->
    <section class="stores" aria-labelledby="stores-title">
      <h2 id="stores-title">Visit a store</h2>
      <div class="store-grid">
        <article v-for="s in stores" :key="s.city" class="store">
          <h3>{{ s.city }}</h3>
          <p>{{ s.address }}</p>
          <p class="muted">{{ s.hours }}</p>
          <a :href="'tel:' + s.phone.replace(/\s/g, '')">{{ s.phone }}</a>
        </article>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Quick answers</h2>
      <details v-for="f in faqs" :key="f.q">
        <summary>{{ f.q }}</summary>
        <p>{{ f.a }}</p>
      </details>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { FREE_SHIPPING_AT, SHIPPING_FEE } from '@/stores/cart'

/* ---------- Mock data (replace with real details) ---------- */
const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

const channels = [
  { icon: 'mail-outline', label: 'Email', value: 'support@novastore.example', href: 'mailto:support@novastore.example' },
  { icon: 'call-outline', label: 'Phone', value: '+20 2 0000 0000', href: 'tel:+20200000000' },
  { icon: 'logo-whatsapp', label: 'WhatsApp concierge', value: '+20 100 000 0000', href: 'https://wa.me/', external: true },
]

const hours = [
  { days: 'Saturday to Thursday', time: '10:00 to 20:00' },
  { days: 'Friday', time: '14:00 to 20:00' },
]

const stores = [
  { city: 'Cairo', address: '14 Example Street, Zamalek', hours: 'Daily 11:00 to 22:00', phone: '+20 2 0000 0001' },
  { city: 'Alexandria', address: '8 Corniche Road, Smouha', hours: 'Daily 11:00 to 22:00', phone: '+20 3 0000 0002' },
  { city: 'Mansoura', address: '21 El Gomhoria Street', hours: 'Daily 11:00 to 21:00', phone: '+20 50 000 0003' },
]

const topics = [
  { value: 'order', label: 'Order status', needsOrder: true },
  { value: 'returns', label: 'Returns and exchanges', needsOrder: true },
  { value: 'product', label: 'Product or sizing question' },
  { value: 'payment', label: 'Payment or voucher' },
  { value: 'other', label: 'Something else' },
]

const faqs = [
  {
    q: 'How long does delivery take?',
    a: `Most orders arrive within 2 to 4 business days. Delivery is free over ${fmt(FREE_SHIPPING_AT)} EGP and costs ${SHIPPING_FEE} EGP below that.`,
  },
  {
    q: 'How do I return or exchange an item?',
    a: 'You have 14 days from delivery to return unworn items with their tags. Choose "Returns and exchanges" in the form above and include your order number.',
  },
  {
    q: 'Can I change or cancel an order?',
    a: 'Yes, until it has been dispatched. Message us as soon as possible with your order number and we will do our best to catch it.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Visa, Mastercard, Meeza and cash on delivery.',
  },
]

/* ---------- Form state ---------- */
const blank = () => ({ name: '', email: '', phone: '', topic: 'order', orderNo: '', message: '' })
const form = reactive(blank())
const touched = reactive({})
const attempted = ref(false)
const sending = ref(false)
const sentRef = ref('')

const needsOrder = computed(() => topics.find((t) => t.value === form.topic)?.needsOrder)

const errors = computed(() => ({
  name: form.name ? '' : 'Please enter your name.',
  email: !form.email
    ? 'Please enter your email.'
    : /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address, like name@example.com.',
  phone: !form.phone || /^\+?[\d\s-]{8,}$/.test(form.phone) ? '' : 'Enter digits only, with an optional + at the start.',
  message: form.message.length >= 10 ? '' : 'Tell us a little more (at least 10 characters).',
}))

const show = (field) => (attempted.value || touched[field]) && errors.value[field]

async function submit() {
  attempted.value = true
  if (Object.values(errors.value).some(Boolean)) {
    await nextTick()
    document.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  sending.value = true
  // Mock request: replace with your API call, e.g. await api.post('/contact', form)
  await new Promise((r) => setTimeout(r, 900))
  sentRef.value = 'NV-' + Math.floor(10000 + Math.random() * 90000)
  sending.value = false
}

function reset() {
  Object.assign(form, blank())
  Object.keys(touched).forEach((k) => delete touched[k])
  attempted.value = false
  sentRef.value = ''
}
</script>

<style scoped>
.contact-page {
  --ink: #111;
  --muted: #6f6a66;
  --line: #ebe6e2;
  --paper: #fbf8f6;
  --bar: #f5b71e;
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
}
a { color: inherit; }
button { font: inherit; color: inherit; cursor: pointer; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible,
textarea:focus-visible, summary:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* Header */
.crumbs { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
.crumbs a { text-decoration: none; }
.crumbs strong { color: var(--ink); }
h1 { font-size: clamp(32px, 5.5vw, 52px); font-weight: 500; text-transform: uppercase; letter-spacing: -.01em; margin: 0 0 16px; }
.lede { max-width: 56ch; font-size: 17px; line-height: 1.6; color: #3d3935; margin: 0; }
h2 { font-size: 24px; font-weight: 500; margin: 0 0 20px; }

/* Layout */
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 56px; align-items: start; margin-top: 40px; }

/* Form */
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.field { margin-bottom: 20px; }
label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.opt { font-weight: 400; color: var(--muted); }
input, select, textarea {
  width: 100%; border: 0; border-bottom: 2px solid transparent; background: #f2eeea;
  padding: 14px; font: inherit; font-size: 15px; color: var(--ink); border-radius: 0;
}
textarea { resize: vertical; min-height: 140px; line-height: 1.5; }
input[aria-invalid='true'], textarea[aria-invalid='true'] { border-bottom-color: #b91c1c; }
.err { font-size: 12px; color: #b91c1c; margin: 6px 0 0; }
.fine { font-size: 12px; color: var(--muted); margin: 14px 0 0; }

.btn-dark { display: inline-flex; align-items: center; justify-content: center; background: #000; color: #fff; border: 0; padding: 16px 32px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
.btn-dark:hover:not(:disabled) { background: #2a2a2a; }
.btn-dark:disabled { opacity: .6; cursor: default; }
.btn-light { border: 0; background: #ebe6e1; padding: 14px 24px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; }
.btn-light:hover { background: #e2dcd6; }

.sent { background: var(--paper); border-left: 4px solid var(--bar); padding: 32px 28px; }
.sent ion-icon { font-size: 36px; }
.sent h3 { font-size: 22px; font-weight: 500; line-height: 1.3; margin: 8px 0 10px; }
.sent p { font-size: 15px; line-height: 1.6; color: #3d3935; margin: 0 0 20px; }

/* Channels */
.channels { background: var(--ink); color: #fff; padding: 32px; position: sticky; top: 24px; }
.channels h2 { color: #fff; }
.channels h3 { font-size: 15px; font-weight: 500; margin: 32px 0 12px; }
.ch-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.ch-list a { display: flex; gap: 14px; align-items: center; padding: 14px 0; text-decoration: none; border-bottom: 1px solid #2c2c2c; }
.ch-list a:hover strong { color: var(--bar); }
.ch-list ion-icon { font-size: 22px; color: var(--bar); flex-shrink: 0; }
.ch-list strong { display: block; font-size: 14px; font-weight: 600; }
.ch-list small { font-size: 13px; color: #b9b3ad; }
.hours { margin: 0; display: grid; gap: 8px; }
.hours div { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; }
.hours dt { color: #b9b3ad; }
.hours dd { margin: 0; font-variant-numeric: tabular-nums; }
.tz { font-size: 12px; line-height: 1.5; color: #8d8781; margin: 14px 0 0; }

/* Stores */
.stores { margin-top: 72px; }
.store-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.store { background: var(--paper); padding: 24px; }
.store h3 { font-size: 20px; font-weight: 500; margin: 0 0 10px; }
.store p { font-size: 15px; line-height: 1.5; margin: 0 0 4px; }
.store .muted { color: var(--muted); font-size: 13px; margin-bottom: 14px; }
.store a { font-size: 14px; font-weight: 600; text-underline-offset: 3px; }

/* FAQ */
.faq { margin-top: 72px; max-width: 760px; }
details { border-bottom: 1px solid var(--line); }
summary { list-style: none; cursor: pointer; padding: 20px 32px 20px 0; font-size: 17px; font-weight: 500; position: relative; }
summary::-webkit-details-marker { display: none; }
summary::after { content: '+'; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); font-size: 22px; font-weight: 300; }
details[open] summary::after { content: '\2212'; }
details p { margin: 0 0 20px; font-size: 15px; line-height: 1.7; color: #3d3935; max-width: 62ch; }

/* Responsive */
@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; gap: 40px; }
  .channels { position: static; }
  .store-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; gap: 0; }
  .channels { padding: 24px 20px; }
  .btn-dark { width: 100%; }
}
</style>
