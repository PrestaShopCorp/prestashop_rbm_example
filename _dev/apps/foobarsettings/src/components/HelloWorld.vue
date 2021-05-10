<template>
  <!-- <div class="hello">
    <h1>{{ msg }}</h1>
    <div>hello world</div>
    <PsAccounts :force-show-plans="true">
      <template v-slot:account-footer>
        <PsBilling
          :account-api="state.accountApi"
          :module-name="state.moduleName"
          :shop-uuid="state.shopUuid"
        />
      </template>
    </PsAccounts>
  </div> -->
  <div class="pt-2">
    <!-- <ConfigurationBanner class="mt-2 mb-4" :app="state.app" /> -->
    <section v-if="!state.getDisplayModulePlans" key="display-module-plan">
      <div class="p-0 m-auto tw-container">
        <PsAccounts :force-show-plans="true">
          <!-- <template v-slot:body>
            <div class="mt-4">
              <DataSource :loading="state.loadingListProperties" />
            </div>
          </template> -->
          <template v-slot:account-footer>
            <PsBilling
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
import { PsAccounts } from "prestashop_accounts_vue_components";
import { PsBilling } from "@prestashopcorp/prestashop_billing_vue_components";
import { ref, watch, computed, reactive } from "@vue/composition-api";
import { mapSagas } from "@/lib/store-saga";
import moduleLogo from "@/assets/icon-ps-metrics.png";
import { useQuery } from "@vue/apollo-composable";
import {
  accountQuery
} from "@/graphql";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    PsAccounts,
    PsBilling,
  },
  setup(props, context) {
    const {
      root: { $store }
    } = context;
    const state = reactive({
      moduleName: computed(() => $store.state.app.moduleName),
      accountApi: computed(() => $store.state.app.controllersLinks.accounts),
      shopUuid: computed(() => $store.state.app.shop.shopUuid),
      getDisplayModulePlans: computed(
        () => $store.getters.getDisplayModulePlans
      ),
      loadingListProperties: computed(
        () => $store.getters.getLoadingListProperties
      ),
    });
    const variables = ref({ shopId: $store.state.app.shop.shopUuid });
    const sagas = mapSagas(
      {
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

    watch(resultQuery, data => {
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
