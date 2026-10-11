<template>
  <div class="tos-page">
    <!-- Header -->
    <header class="tos-head">
      <p class="crumbs">
        <RouterLink :to="{ name: 'home' }">Home</RouterLink> / <strong>Terms of service</strong>
      </p>
      <h1>Terms of Service</h1>
      <p class="lede">
        These terms explain how shopping at Nova Store works: what you can expect from us, and what we
        ask from you. Please read them before placing an order.
      </p>
      <p class="dates">
        <span>Last updated {{ lastUpdated }}</span>
        <span>Effective from {{ effectiveDate }}</span>
      </p>
    </header>

    <!-- Short version -->
    <section class="glance" aria-labelledby="glance-title">
      <h2 id="glance-title">The short version</h2>
      <dl>
        <div v-for="f in summary" :key="f.label">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.text }}</dd>
        </div>
      </dl>
      <p class="glance-note">This summary is for convenience. The full terms below are what apply.</p>
    </section>

    <div class="layout">
      <!-- Table of contents -->
      <nav class="toc" aria-label="Terms of service sections">
        <p class="toc-title">On this page</p>
        <ol>
          <li v-for="(s, i) in sections" :key="s.id">
            <a
              :href="'#' + s.id"
              :class="{ active: activeId === s.id }"
              :aria-current="activeId === s.id ? 'true' : undefined"
              @click.prevent="goTo(s.id)"
            >
              <span class="toc-num">{{ i + 1 }}.</span> {{ s.title }}
            </a>
          </li>
        </ol>
      </nav>

      <!-- Content -->
      <article class="content">
        <section v-for="(s, i) in sections" :id="s.id" :key="s.id" class="clause">
          <h2><span class="num">{{ i + 1 }}.</span> {{ s.title }}</h2>
          <p v-for="(p, n) in s.paragraphs" :key="n">{{ p }}</p>
          <ul v-if="s.items">
            <li v-for="(it, n) in s.items" :key="n">{{ it }}</li>
          </ul>
        </section>

        <aside class="contact">
          <h2>Questions about these terms?</h2>
          <p>
            Write to <a :href="'mailto:' + company.email">{{ company.email }}</a> or message our
            concierge on WhatsApp. We reply within one business day.
          </p>
          <p class="addr">{{ company.legalName }}, {{ company.address }}</p>
        </aside>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { FREE_SHIPPING_AT, SHIPPING_FEE } from '@/stores/cart'

/* ---------- Mock data (replace with your real, lawyer-reviewed copy) ---------- */
const company = {
  legalName: 'Nova Store for Fashion',
  address: '14 Example Street, Cairo, Egypt',
  email: 'support@novastore.example',
}

const lastUpdated = 'September 15, 2026'
const effectiveDate = 'October 1, 2026'

const fmt = (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

const summary = [
  { label: 'Returns', text: '14 days from delivery, free exchanges' },
  { label: 'Delivery', text: `Free over ${fmt(FREE_SHIPPING_AT)} EGP, otherwise ${SHIPPING_FEE} EGP` },
  { label: 'Payment', text: 'Visa, Mastercard, Meeza or cash on delivery' },
  { label: 'Prices', text: 'Shown in EGP with 14% VAT included' },
]

const sections = [
  {
    id: 'acceptance',
    title: 'Accepting these terms',
    paragraphs: [
      'By browsing novastore.example, creating an account or placing an order, you agree to these Terms of Service and to our Privacy Policy. If you do not agree, please do not use the site.',
      'We may update these terms from time to time. The date at the top of this page shows the latest version, and orders you place after a change are governed by the updated terms.',
    ],
  },
  {
    id: 'account',
    title: 'Your account',
    paragraphs: [
      'You can browse and save items to your wishlist without an account. To check out you need to give us accurate contact and delivery details.',
    ],
    items: [
      'You must be at least 18 years old, or have a parent or guardian complete the purchase.',
      'You are responsible for keeping your login details private and for activity under your account.',
      'Tell us straight away if you suspect someone else has used your account.',
    ],
  },
  {
    id: 'orders',
    title: 'Orders and pricing',
    paragraphs: [
      'Adding an item to your bag does not reserve it. An order is confirmed when you receive our confirmation email, and a contract is formed when we dispatch your items.',
      'All prices are in Egyptian pounds (EGP) and include 14% VAT. Delivery charges are shown separately before you pay.',
      'We take care to keep prices and stock accurate. If we find a pricing or availability error after you order, we will contact you to either confirm the correct price or cancel the order with a full refund.',
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    paragraphs: [
      'We accept Visa, Mastercard, Meeza and cash on delivery. Card payments are processed by our payment partners over an encrypted connection, and we never store your full card number.',
      'For cash on delivery, please have the exact amount ready. We may decline cash on delivery for orders above a certain value or after repeated refused deliveries.',
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping and delivery',
    paragraphs: [
      `Orders of ${fmt(FREE_SHIPPING_AT)} EGP or more (after any voucher discount) ship free. Smaller orders carry a flat delivery fee of ${SHIPPING_FEE} EGP.`,
      'Delivery times shown at checkout are estimates. Delays caused by couriers, weather or public holidays are outside our control, but we will keep you informed.',
      'Risk in the items passes to you when they are delivered. Please check your parcel on arrival and report any damage within 48 hours.',
    ],
  },
  {
    id: 'returns',
    title: 'Returns and exchanges',
    paragraphs: [
      'You can return unworn items within 14 days of delivery for a refund or a free exchange.',
    ],
    items: [
      'Items must be unworn, unwashed and have their original tags and packaging.',
      'Underwear, swimwear and personalised items cannot be returned unless faulty.',
      'Refunds go back to your original payment method within 7 to 14 business days of us receiving the return. Cash on delivery refunds are made by bank transfer.',
      'If an item arrives faulty or not as described, contact us and we will cover the return cost.',
    ],
  },
  {
    id: 'vouchers',
    title: 'Vouchers and promotions',
    paragraphs: [
      'Voucher codes apply to the merchandise subtotal only, not to delivery. Only one code can be used per order, and codes cannot be combined with other offers unless stated.',
      'Codes have no cash value, may expire, and can be withdrawn if we believe they are being misused.',
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    paragraphs: [
      'The Nova Store name, logo, photography, product descriptions and site design belong to us or our licensors. You may view and print pages for personal use, but you may not copy, resell or republish them without written permission.',
    ],
  },
  {
    id: 'liability',
    title: 'Limits of our liability',
    paragraphs: [
      'We are responsible for losses that are a foreseeable result of our failing to take reasonable care. We are not liable for indirect losses, or for delays and failures caused by events outside our reasonable control.',
      'Nothing in these terms limits your statutory consumer rights under Egyptian law.',
    ],
  },
  {
    id: 'law',
    title: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of the Arab Republic of Egypt. Any dispute that we cannot settle together will be handled by the competent courts of Cairo.',
    ],
  },
]

/* ---------- Table of contents behaviour ---------- */
const activeId = ref(sections[0].id)
let observer

function goTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  activeId.value = id
  history.replaceState(null, '', '#' + id)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length) activeId.value = visible[0].target.id
    },
    { rootMargin: '-15% 0px -75% 0px' }
  )
  sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.tos-page {
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
a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

/* Header */
.crumbs { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
.crumbs a { text-decoration: none; }
.crumbs strong { color: var(--ink); }
h1 { font-size: clamp(32px, 5.5vw, 52px); font-weight: 500; text-transform: uppercase; letter-spacing: -.01em; margin: 0 0 16px; }
.lede { max-width: 60ch; font-size: 17px; line-height: 1.6; color: #3d3935; margin: 0 0 16px; }
.dates { display: flex; flex-wrap: wrap; gap: 4px 24px; font-size: 13px; color: var(--muted); margin: 0; }

/* Short version */
.glance { background: var(--paper); border-left: 4px solid var(--bar); padding: 28px 28px 22px; margin: 36px 0 56px; }
.glance h2 { font-size: 20px; font-weight: 500; margin: 0 0 18px; }
.glance dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 20px 32px; margin: 0; }
.glance dt { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
.glance dd { margin: 0; font-size: 15px; line-height: 1.45; font-weight: 500; }
.glance-note { font-size: 12px; color: var(--muted); margin: 20px 0 0; }

/* Layout */
.layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 64px; align-items: start; }

/* TOC */
.toc { position: sticky; top: 24px; }
.toc-title { font-size: 12px; color: var(--muted); margin: 0 0 12px; }
.toc ol { list-style: none; margin: 0; padding: 0; border-left: 1px solid var(--line); }
.toc a { display: block; padding: 8px 0 8px 16px; margin-left: -1px; border-left: 3px solid transparent; font-size: 14px; line-height: 1.35; color: var(--muted); text-decoration: none; }
.toc a:hover { color: var(--ink); }
.toc a.active { color: var(--ink); font-weight: 600; border-left-color: var(--bar); }
.toc-num { display: inline-block; min-width: 1.6em; font-variant-numeric: tabular-nums; }

/* Clauses */
.content { max-width: 70ch; }
.clause { scroll-margin-top: 24px; padding-bottom: 36px; margin-bottom: 36px; border-bottom: 1px solid var(--line); }
.clause h2 { font-size: 24px; font-weight: 500; line-height: 1.25; margin: 0 0 16px; }
.num { color: var(--muted); font-weight: 400; margin-right: 6px; font-variant-numeric: tabular-nums; }
.clause p, .clause li { font-size: 16px; line-height: 1.7; color: #2b2825; }
.clause p { margin: 0 0 14px; }
.clause ul { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
.clause li::marker { color: var(--bar); }

/* Contact */
.contact { background: var(--ink); color: #fff; padding: 32px; }
.contact h2 { font-size: 22px; font-weight: 500; margin: 0 0 12px; }
.contact p { font-size: 15px; line-height: 1.6; margin: 0 0 12px; color: #e8e4df; }
.contact a { color: var(--bar); }
.contact .addr { font-size: 13px; color: #a8a29c; margin: 16px 0 0; }

/* Responsive */
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; gap: 32px; }
  .toc { position: static; }
  .toc ol { display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 16px; }
}
@media (max-width: 560px) {
  .toc ol { grid-template-columns: 1fr; }
  .glance { padding: 22px 20px 18px; }
  .contact { padding: 24px 20px; }
}
</style>