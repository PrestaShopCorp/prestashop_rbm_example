<template>
  <div class="pt-2">
    <section v-if="displayModulePlans === false" key="display-module-plan">
      <div class="p-0 m-auto tw-container">
        <PsAccounts :force-show-plans="true">
          <template v-slot:body>
            <div class="mt-4">
              <span>Configuration banner</span>
            </div>
          </template>
          <template v-slot:account-footer>
            <PsBilling
              :initialize="initialize"
              :account-api="appInfo.controllersLinks.accounts"
              :module-name="appInfo.moduleName"
              :module-logo="moduleLogo"
              :shop-uuid="appInfo.shop.shopUuid"
              @display-module-plans="goToPlans()"
            />
          </template>
        </PsAccounts>
      </div>
    </section>

    <section v-else>
      <BillingPlans
        key="display-module-plan"
        @back-to-settings="backToSettings()"
      />
    </section>
  </div>
</template>

<script>
import BillingPlans from "@/components/panel/BillingPlans";
import { PsAccounts } from "prestashop_accounts_vue_components";
import { PsBilling } from "@prestashopcorp/prestashop_billing_vue_components";
import { mapGetters, mapActions, mapState } from 'vuex'
import moduleLogo from "@/assets/icon-ps-metrics.png";


// import { computed, reactive } from "@vue/composition-api";
// import { mapSagas } from "@/lib/store-saga";

export default {
  name: 'HelloWorld',
  components: {
    PsAccounts,
    PsBilling,
    BillingPlans,
  },
  computed: {
    ...mapState({
      appInfo: state => state.app
    }),
    ...mapGetters({
      initialize: 'loadingBilling',
      displayModulePlans: 'displayModulePlans',
    }),
  },
  data() {
    return {
      moduleLogo
    }
  },
  methods: {
    ...mapActions([
      'SET_DISPLAY_MODULE_PLANS'
    ]),
    goToPlans() {
      this.SET_DISPLAY_MODULE_PLANS(true)
    },
    backToSettings() {
      this.SET_DISPLAY_MODULE_PLANS(false)
    }
  },
  mounted() {
    this.$billingEmitter.emit('create:subscription', {data: 'asd'})
  },
  // setup(props, context) {
  //   // console.log(context)
  //   // context.root.$billingEmitter.emit('create:subscription', {data: 'asd'})
  //   // Vue.$billingEmitter.emit('create:subscription', {data: 'asd'})
  //   setTimeout(() => {
  //     console.log(context)
  //     context.root.$billingEmitter.emit('create:subscription', {data: 'asdddd'})
  //   }, 3000)
  //   const {
  //     root: { $store }
  //   } = context;
  //   const state = reactive({
  //     initialize: computed(() => $store.getters.loadingBilling),
  //     moduleName: computed(() => $store.state.app.moduleName),
  //     accountApi: computed(() => $store.state.app.controllersLinks.accounts),
  //     shopUuid: computed(() => $store.state.app.shop.shopUuid),
  //     getDisplayModulePlans: computed(
  //       () => $store.getters.displayModulePlans
  //     ),
  //     accountConnected: computed(() => $store.getters.psAccountsIsOnboarded),
  //   });
  //   const sagas = mapSagas(
  //     {
  //       setDisplayModulePlans: "setDisplayModulePlans",
  //       initBillingFree: "initBillingFree"
  //     },
  //     context
  //   );

  //   // sagas.initBillingFree();

  //   const goToPlans = () => {
  //     console.log('hello world goToPlans');
  //     sagas.setDisplayModulePlans(true);
  //   };
  //   const backToSettings = () => {
  //     console.log('hello world backToSettings');
  //     sagas.setDisplayModulePlans(false);
  //   };

  //   return {
  //     ...sagas,
  //     state,
  //     goToPlans,
  //     backToSettings,
  //     moduleLogo
  //   };
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  margin-bottom: 35px;
}
</style>
