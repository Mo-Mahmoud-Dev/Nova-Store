import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import ProductsPopup from '@/components/ProductsPopup.vue';

import "./assets/styles/main.scss";
const app = createApp(App);
app.component('ProductsPopup', ProductsPopup);
app.use(createPinia());
app.use(router);

app.config.globalProperties.$base = import.meta.env.BASE_URL

app.mount("#app");