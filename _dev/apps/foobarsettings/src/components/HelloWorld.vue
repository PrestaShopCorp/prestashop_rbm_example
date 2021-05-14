<template>
  <div class="pt-2">
    <section v-if="!state.getDisplayModulePlans" key="display-module-plan">
      <div class="p-0 m-auto tw-container">
        <PsAccounts :force-show-plans="true">
          <template v-slot:body>
            <div class="mt-4">
              <span>Configuration banner</span>
            </div>
          </template>
          <template v-slot:account-footer>
            <PsBilling
              :initialize="state.initialize"
              :account-api="state.accountApi"
              :module-name="state.moduleName"
              :module-logo="moduleLogo"
              :shop-uuid="state.shopUuid"
              @display-module-plans="goToPlans()"
            />
          </template>
        </PsAccounts>
      </div>
    </section>

    <section>
      <BillingPlans
        v-if="state.getDisplayModulePlans"
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
import { computed, reactive } from "@vue/composition-api";
import { mapSagas } from "@/lib/store-saga";
import moduleLogo from "@/assets/icon-ps-metrics.png";

export default {
  name: 'HelloWorld',
  components: {
    PsAccounts,
    PsBilling,
    BillingPlans,
  },
  setup(props, context) {
    const {
      root: { $store }
    } = context;
    const state = reactive({
      initialize: computed(() => $store.getters.loadingBilling),
      moduleName: computed(() => $store.state.app.moduleName),
      accountApi: computed(() => $store.state.app.controllersLinks.accounts),
      shopUuid: computed(() => $store.state.app.shop.shopUuid),
      getDisplayModulePlans: computed(
        () => $store.getters.getDisplayModulePlans
      ),
      accountConnected: computed(() => $store.getters.psAccountsIsOnboarded),
    });
    const sagas = mapSagas(
      {
        setDisplayModulePlans: "setDisplayModulePlans",
        initBillingFree: "initBillingFree"
      },
      context
    );

    // sagas.initBillingFree();

    const goToPlans = () => {
      console.log('hello world goToPlans');
      sagas.setDisplayModulePlans(true);
    };
    const backToSettings = () => {
      console.log('hello world backToSettings');
      sagas.setDisplayModulePlans(false);
    };

    return {
      ...sagas,
      state,
      goToPlans,
      backToSettings,
      moduleLogo
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  margin-bottom: 35px;
}
</style>
