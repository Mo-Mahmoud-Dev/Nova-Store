import { createRouter, createWebHashHistory } from "vue-router";

import DefaultLayout from "../layouts/DefaultLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const routes = [
  // 1. صفحات الموقع العادية
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../views/Home.vue"),
        meta: { title: "Home" },
      },
      {
        path: "products",
        name: "products",
        component: () => import("../views/Products.vue"),
        meta: { title: "All Products" },
      },

      // ✅ المسارات القديمة بقت redirect لصفحة المنتجات مع الفلتر
      {
        path: "Man",
        name: "Man",
        redirect: { path: "/products", query: { filter: "men" } },
      },
      {
        path: "Woman",
        name: "Woman",
        redirect: { path: "/products", query: { filter: "women" } },
      },
      {
        path: "Accessories",
        name: "Accessories",
        redirect: { path: "/products", query: { filter: "accessories" } },
      },
      {
        path: "Sale",
        name: "Sale",
        redirect: { path: "/products", query: { filter: "sale" } },
      },

      {
        path: "cart",
        name: "cart",
        component: () => import("../views/Cart.vue"),
        meta: { title: "Shopping Bag" },
      },
      {
        path: "wishlist",
        name: "wishlist",
        component: () => import("../views/Wishlist.vue"),
        meta: { title: "Wishlist" },
      },
      {
        path: "checkout",
        name: "checkout",
        component: () => import("../views/Checkout.vue"),
        meta: { title: "Checkout" },
      },
      {
        path: "order-confirmation",
        name: "order-confirmation",
        component: () => import("@/views/OrderConfirmation.vue"),
        meta: { title: "Order Confirmed" },
      },
      {
        path: "account",
        name: "account",
        component: () => import("../views/Account.vue"),
        meta: { title: "My Account" },
      },
      {
        path: "privacy-policy",
        name: "privacy-policy",
        component: () => import("@/views/PrivacyPolicy.vue"),
        meta: { title: "Privacy Policy" },
      },
      {
        path: 'terms-of-service',
        name: 'terms-of-service',
        component: () => import('@/views/TermsOfService.vue'),
        meta: { title: "Terms Of Service" },
      },
      {
        path: 'contact-us',
        name: 'contact-us',
        component: () => import('@/views/ContactUs.vue'),
        meta: { title: "Contact Us" },
      },
    ],
  },

  // 2. صفحات تسجيل الدخول
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "Authentication",
        name: "Authentication",
        component: () => import("@/views/Authentication.vue"),
        meta: { title: "Sign In" },
      },
    ],
  },

  // 3. صفحة الخطأ 404 (لازم تفضل آخر حاجة)
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "Page Not Found" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 120 };
    return { top: 0 };
  },
});

// عنوان التاب لكل صفحة
const SITE_NAME = "Nova Store";

router.afterEach((to) => {
  const title = to.meta.title;
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
});

export default router;