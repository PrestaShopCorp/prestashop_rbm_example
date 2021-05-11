<template>
  <div class="pt-2">
    <section v-if="!state.getDisplayModulePlans" key="display-module-plan">
      <div class="p-0 m-auto tw-container">
        <PsAccounts :force-show-plans="true">
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
import { ref, watch, computed, reactive } from "@vue/composition-api";
import { mapSagas } from "@/lib/store-saga";
import moduleLogo from "@/assets/icon-ps-metrics.png";
import { useQuery, useSubscription } from "@vue/apollo-composable";
import {
  accountQuery,
  subscriptionAccount,
  subscriptionLastSync,
  subscriptionStartSync,
  subscriptionFirstSync
} from "@/graphql";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
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
      loadingListProperties: computed(
        () => $store.getters.getLoadingListProperties
      ),
      accountConnected: computed(() => $store.getters.psAccountsIsOnboarded),
    });
    const variables = ref({ shopId: $store.state.app.shop.shopUuid });
    const sagas = mapSagas(
      {
        getListProperty: "getListProperty",
        setDisplayModulePlans: "setDisplayModulePlans",
        setAccount: "selectAccount",
        setPlan: "setPlan",
        setStartSync: "setStartSync",
        setLastSync: "setLastSync",
        setStartSyncedAt: "setStartSyncedAt",
        initBillingFree: "initBillingFree"
      },
      context
    );
    const { result: resultQuery } = useQuery(
      accountQuery,
      variables,
      {
        fetchPolicy: "network-only"
      }
    );
    const {
      result: resultSubscriptionAccount /* loading: loadingSubscriptionAccount, error: errorSubscriptionAccount */
    } = useSubscription(subscriptionAccount, variables, {
      fetchPolicy: "network-only"
    });

    const {
      result: resultSubscriptionFirstSync /* loading: loadingSubscriptionFirstSync,  error: errorSubscriptionFirstSync */
    } = useSubscription(subscriptionFirstSync, variables, {
      fetchPolicy: "network-only"
    });
    const {
      result: resultSubscriptionLastSync /* loading: loadingSubscriptionLastSync,  error: errorSubscriptionLastSync */
    } = useSubscription(subscriptionLastSync, variables, {
      fetchPolicy: "network-only"
    });

    const {
      result: resultSubscriptionStartSync /* loading: loadingSubscriptionLastSync,  error: errorSubscriptionLastSync */
    } = useSubscription(subscriptionStartSync, variables, {
      fetchPolicy: "network-only"
    });

    console.log('debugging 123');
    console.log(resultQuery, variables, state);

    sagas.initBillingFree();

    watch(resultQuery, data => {
      console.log('BEGIN watching resultQuery', data, state);
      if (
        state.accountConnected &&
        (data.account === null ||
          (data.account && data.account.plan && data.account.plan === null))
      ) {
        console.log('initing billing');
        sagas.initBillingFree();
        return;
      }

      if (
        (data.account === null ||
          (data.account && data.account.plan && data.account.plan === null)) &&
        !state.accountConnected
      ) {
        return;
      }

      // $segment.track("metrics_account", data.account);
      sagas.setAccount(data.account);
    });

    watch(resultSubscriptionAccount, data => {
      console.log('resultSubscriptionAccount', data);
      // $segment.track("metrics_upgrade_plan", data.accountUpgraded);
      sagas.setPlan(data.accountUpgraded);
    });

    watch(resultSubscriptionFirstSync, data => {
      // $segment.track(
      //   "metrics_first_sync_asked_at",
      //   data.accountFirstSync.first_sync_asked_at
      // );
      console.log('resultSubscriptionFirstSync', data);
      sagas.setStartSyncedAt(data.accountFirstSync.first_sync_asked_at);
    });

    watch(resultSubscriptionLastSync, data => {
      // $segment.track("metrics_last_sync_at", data.accountLastSync.last_sync_at);
      console.log('resultSubscriptionLastSync', data);
      sagas.setLastSync(data.accountLastSync.last_sync_at);
    });

    watch(resultSubscriptionStartSync, data => {
      // $segment.track(
      //   "metrics_start_sync_at",
      //   data.accountStartSync.start_sync_at
      // );
      console.log('resultSubscriptionStartSync', data);
      sagas.setStartSync(data.accountStartSync.start_sync_at);
    });

    const goToPlans = () => {
      sagas.setDisplayModulePlans(true);
    };
    const backToSettings = () => {
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
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
