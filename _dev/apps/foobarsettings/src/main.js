import Vue from 'vue';
import App from './App.vue';
import i18n from "@/lib/i18n";
import psAccountsVueComponents from "prestashop_accounts_vue_components";
import psBillingVueComponents from "@prestashopcorp/prestashop_billing_vue_components";
import VueCompositionAPI from "@vue/composition-api";
import StoreSaga from "@/lib/store-saga";
import store from "@/store";
import "@/assets/_global.scss";
import "@/assets/_settings.scss";
import "@/assets/index.css";

Vue.use(VueCompositionAPI);
Vue.use(psAccountsVueComponents);
Vue.use(StoreSaga, { store });
Vue.use(psBillingVueComponents, {store, i18n});

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
