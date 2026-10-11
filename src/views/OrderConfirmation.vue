<template>
  <div class="confirm-page">
    <section v-if="order" class="box">
      <ion-icon name="checkmark-circle-outline" class="tick"></ion-icon>
      <h1>Thank you, {{ firstName }}</h1>
      <p class="lead">Your order <strong>{{ order.number }}</strong> is confirmed. We sent the details to {{ order.customer.email }}.</p>

      <dl class="facts">
        <div><dt>Delivery</dt><dd>{{ order.delivery.label }}<small>{{ order.delivery.eta }}</small></dd></div>
        <div><dt>Ship to</dt><dd>{{ order.address }}</dd></div>
        <div><dt>Payment</dt><dd>{{ order.payment }}</dd></div>
      </dl>

      <ul class="items">
        <li v-for="i in order.items" :key="i.id">
          <img :src="i.image" :alt="i.title" />
          <span>{{ i.title }} <small>× {{ i.qty }}</small></span>
          <span>{{ fmt(i.price * i.qty) }} EGP</span>
        </li>
      </ul>

      <div class="total"><span>Total</span><strong>{{ fmt(order.total) }} EGP</strong></div>

      <RouterLink to="/products" class="btn-dark">Continue shopping</RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'

const router = useRouter()
const order = useOrderStore().lastOrder
const firstName = computed(() => order?.customer.name.split(' ')[0] || '')
const fmt = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })

onMounted(() => {
  if (!order) router.replace('/')
})
</script>

<style scoped>
.confirm-page { background: #fbf8f6; min-height: 70vh; padding: 56px 24px 80px; font-family: 'Inter', system-ui, sans-serif; color: #111; }
.box { max-width: 680px; margin: 0 auto; background: #fff; padding: 40px; text-align: center; }
.tick { font-size: 48px; color: #2e7d32; }
h1 { font-size: 32px; font-weight: 500; text-transform: uppercase; margin: 8px 0 12px; }
.lead { color: #6f6a66; margin: 0 0 28px; line-height: 1.6; }
.facts { display: grid; gap: 16px; text-align: left; margin: 0 0 24px; padding: 20px; background: #fbf8f6; }
.facts div { display: grid; grid-template-columns: 90px 1fr; gap: 12px; font-size: 14px; }
.facts dt { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #6f6a66; }
.facts dd { margin: 0; }
.facts small { display: block; color: #6f6a66; }
.items { list-style: none; padding: 0; margin: 0; text-align: left; }
.items li { display: grid; grid-template-columns: 52px 1fr auto; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid #ebe6e2; font-size: 14px; }
.items img { width: 52px; aspect-ratio: 3 / 4; object-fit: cover; background: #f0ece8; }
.items small { color: #6f6a66; }
.total { display: flex; justify-content: space-between; align-items: baseline; padding: 20px 0 28px; font-size: 14px; text-transform: uppercase; }
.total strong { font-size: 24px; font-weight: 500; }
.btn-dark { display: inline-block; background: #000; color: #fff; padding: 16px 32px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; }
.btn-dark:hover { background: #2a2a2a; }
@media (max-width: 640px) { .box { padding: 28px 20px; } .facts div { grid-template-columns: 1fr; gap: 2px; } }
</style>
