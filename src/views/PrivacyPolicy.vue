<template>
  <div class="policy-page">
    <!-- Header -->
    <header class="policy-header">
      <p class="breadcrumb">
        <RouterLink to="/">Home</RouterLink> / Privacy Policy
      </p>
      <h1>Privacy Policy</h1>
      <p class="subtitle">
        What Nova Store collects, why we collect it, and the choices you have.
      </p>
      <p class="updated">Last updated {{ lastUpdated }}</p>
    </header>

    <div class="policy-layout">
      <!-- Table of contents -->
      <nav class="policy-toc" aria-label="On this page">
        <p class="toc-title">On this page</p>
        <ul>
          <li v-for="s in sections" :key="s.id">
            <a :href="`#${s.id}`" @click.prevent="scrollToSection(s.id)">{{ s.title }}</a>
          </li>
          <li>
            <a href="#contact" @click.prevent="scrollToSection('contact')">Contact us</a>
          </li>
        </ul>
      </nav>

      <!-- Policy content -->
      <article class="policy-content">
        <p class="lead">
          We collect only what we need to run your account and deliver your orders. We don't
          sell your personal data, and you can ask us to show, correct or delete it at any time.
        </p>

        <section v-for="s in sections" :id="s.id" :key="s.id" class="policy-section">
          <h2>{{ s.title }}</h2>

          <p v-if="s.intro">{{ s.intro }}</p>

          <ul v-if="s.items">
            <li v-for="(item, i) in s.items" :key="i">
              <template v-if="typeof item === 'string'">{{ item }}</template>
              <template v-else>
                <strong>{{ item.label }}.</strong> {{ item.text }}
              </template>
            </li>
          </ul>

          <p v-if="s.outro">{{ s.outro }}</p>
        </section>

        <section id="contact" class="policy-section">
          <h2>Contact us</h2>
          <p>
            Questions about this policy or your data? Email us at
            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
            and we will reply as soon as we can.
          </p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup>
// ---- Edit these two values before publishing ----
const contactEmail = 'privacy@your-domain.com'
const lastUpdated = 'October 3, 2026'

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    intro: 'We collect the following when you use Nova Store.',
    items: [
      {
        label: 'Account details',
        text: 'Your name, email address and password when you create an account or sign in.',
      },
      {
        label: 'Orders and delivery',
        text: 'Your shipping address, phone number and the items you buy, so we can deliver your order and handle returns.',
      },
      {
        label: 'Payments',
        text: 'Card and wallet payments are handled by our payment providers. We receive confirmation that you paid, not your full card number.',
      },
      {
        label: 'Cart and wishlist',
        text: 'The items you add to your cart or save to your wishlist.',
      },
      {
        label: 'Newsletter',
        text: 'Your email address, if you subscribe to updates.',
      },
      {
        label: 'Device and usage',
        text: 'Your browser, device type, approximate location and the pages you visit, collected through cookies and similar tools.',
      },
    ],
  },
  {
    id: 'how-we-use-it',
    title: 'How we use your information',
    items: [
      'Process and deliver your orders, including worldwide shipments.',
      'Manage your account, cart and wishlist.',
      'Send order updates and, if you opted in, newsletters and offers.',
      'Improve the store, fix problems and prevent fraud.',
      'Meet our legal and tax obligations.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    intro:
      "We don't sell your personal data. We share it only with companies that help us run the store, and only what they need to do their job.",
    items: [
      { label: 'Delivery partners', text: 'Your name, address and phone number.' },
      { label: 'Payment providers', text: 'The order amount and billing details.' },
      { label: 'Hosting and analytics providers', text: 'Usage data about how the store is used.' },
      { label: 'Authorities', text: 'Personal data, when the law requires us to provide it.' },
    ],
    outro:
      'Because we deliver worldwide and use providers in other countries, your data may be processed outside Egypt. When that happens, we take steps to keep it protected.',
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    intro:
      "We use cookies and your browser's local storage to keep you signed in, remember your cart and wishlist, and understand how the store is used. You can block or delete cookies in your browser settings, but some features, such as the cart, may stop working.",
  },
  {
    id: 'retention',
    title: 'How long we keep your data',
    intro:
      'We keep account and order information while your account is open, and for as long as the law requires us to keep financial records. When you delete your account, we remove or anonymise the personal data we no longer need.',
  },
  {
    id: 'your-rights',
    title: 'Your choices and rights',
    intro: 'You can ask us to:',
    items: [
      'Send you a copy of the personal data we hold about you.',
      'Correct information that is wrong or out of date.',
      'Delete your account and personal data.',
      'Stop sending you marketing emails. Every newsletter also has an unsubscribe link.',
    ],
    outro:
      "Where they apply, these rights follow Egypt's Personal Data Protection Law (Law No. 151 of 2020) and other data protection laws that cover you. To make a request, email us at the address in the contact section below.",
  },
  {
    id: 'security',
    title: 'Keeping your data safe',
    intro:
      'We use encrypted connections (HTTPS) and limit access to personal data to the people who need it. No online service is completely secure, so choose a strong, unique password and tell us right away if you suspect someone has accessed your account.',
  },
  {
    id: 'children',
    title: 'Children',
    intro:
      "Nova Store is not meant for children under 16, and we don't knowingly collect their personal data. If you think a child has given us their information, contact us and we will delete it.",
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    intro:
      'If we change this policy, we will update the date at the top of this page. For significant changes, we will also email you or show a notice in the store.',
  },
]

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}
</script>

<style scoped>
.policy-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 96px;
  color: #1a1a1a;
}

/* ---- Header ---- */
.breadcrumb {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #8a8a8a;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #1a1a1a;
}

.policy-header h1 {
  font-size: 42px;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin: 0 0 8px;
}

.subtitle {
  color: #6b6b6b;
  font-size: 15px;
  margin: 0 0 6px;
}

.updated {
  color: #8a8a8a;
  font-size: 13px;
  margin: 0 0 32px;
}

/* ---- Layout ---- */
.policy-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 64px;
  align-items: start;
  padding-top: 32px;
  border-top: 1px solid #e5e2dd;
}

/* ---- Table of contents ---- */
.policy-toc {
  position: sticky;
  top: 120px; /* clears the sticky navbar */
}

.toc-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 12px;
}

.policy-toc ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 1px solid #e5e2dd;
}

.policy-toc a {
  display: block;
  padding: 6px 0 6px 16px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  font-size: 14px;
  line-height: 1.4;
  color: #6b6b6b;
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.policy-toc a:hover,
.policy-toc a:focus-visible {
  color: #1a1a1a;
  border-left-color: #1a1a1a;
  outline: none;
}

/* ---- Content ---- */
.policy-content {
  max-width: 68ch;
  font-size: 16px;
  line-height: 1.7;
}

.lead {
  font-size: 19px;
  line-height: 1.6;
  margin: 0 0 48px;
}

.policy-section {
  scroll-margin-top: 120px;
  margin-bottom: 44px;
}

.policy-section h2 {
  font-size: 22px;
  font-weight: 500;
  margin: 0 0 12px;
}

.policy-section p {
  margin: 0 0 14px;
  color: #3d3d3d;
}

.policy-section ul {
  margin: 0 0 14px;
  padding-left: 20px;
  color: #3d3d3d;
}

.policy-section li {
  margin-bottom: 8px;
  padding-left: 4px;
}

.policy-section strong {
  color: #1a1a1a;
  font-weight: 600;
}

.policy-section a {
  color: #1a1a1a;
  text-underline-offset: 3px;
}

.policy-section a:hover {
  text-decoration-thickness: 2px;
}

/* ---- Responsive ---- */
@media (max-width: 860px) {
  .policy-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .policy-toc {
    position: static;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e2dd;
  }

  .policy-header h1 {
    font-size: 34px;
  }
}
</style>
