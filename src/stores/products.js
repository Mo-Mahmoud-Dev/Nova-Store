import { defineStore } from "pinia";
import products from "../data/products";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: products,
    loading: false,
    error: null,
  }),

  getters: {
    // جلب المنتجات التي تمتلك الشارة Featured
    featuredProducts: (state) => {
      return state.products.filter((product) => product.tag === "Featured");
    },

    // جلب المنتجات التي تمتلك الشارة New
    newArrivals: (state) => {
      return state.products.filter((product) => product.tag === "New");
    },

    // (إضافة مفيدة) جلب المنتجات الأكثر مبيعاً
    bestSellers: (state) => {
      return state.products.filter((product) => product.tag === "Best Seller");
    },

    // (إضافة مفيدة) جلب المنتجات حسب القسم (مثل: Clothing, Shoes, Accessories)
    getProductsByType: (state) => {
      return (type) => state.products.filter((product) => product.type === type);
    },
  },
});