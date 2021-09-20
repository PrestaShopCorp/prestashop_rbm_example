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
            <!-- <PsBilling
              @display-module-plans="goToPlans()"
            /> -->
          </template>
        </PsAccounts>
      </div>
    </section>

    <section v-else>
      <BillingPlans
        :account-api="appInfo.controllersLinks.accounts"
        :module-name="appInfo.moduleName"
        :module-logo="moduleLogo"
        :shop-uuid="appInfo.shop.shopUuid"
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

export default {
  name: 'HelloWorld',
  components: {
    PsAccounts,
    PsBilling,
    BillingPlans,
  },
  computed: {
    ...mapState({
      appInfo: state => state.app,
      billingInfo: state => state.billing
    }),
    ...mapGetters({
      initialize: 'loadingBilling',
      displayModulePlans: 'displayModulePlans',
    }),
  },
  provide() {
    return {
      emailSupport: this.appInfo.user.emailSupport
    }
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
    if (localStorage.getItem('customer_sub_created') !== 'ok') {
      this.$billingEmitter.emit('init:billing', {
        'CREATE_CUSTOMER': {
          created_from_ip: this.appInfo.user.created_from_ip,
        },
        'CREATE_SUBSCRIPTION': {
          // this should be dynamic. Change this to the module name passed from php module perhaps
          planId: 'default-free'
        }
      })
      localStorage.setItem('customer_sub_created', 'ok')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  margin-bottom: 35px;
}
</style>
