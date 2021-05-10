<template>
  <div class="hello">
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
  </div>
</template>

<script>
import { PsAccounts } from "prestashop_accounts_vue_components";
import { PsBilling } from "@prestashopcorp/prestashop_billing_vue_components";
import { computed, reactive } from "@vue/composition-api";

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
      shopUuid: computed(() => $store.state.app.shop.shopUuid)
    });
    return {state};
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
