<!--**
  * 2007-2021 PrestaShop and Contributors
  *
  * NOTICE OF LICENSE
  *
  * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
  * that is bundled with this package in the file LICENSE.txt.
  * It is also available through the world-wide-web at this URL:
  * https://opensource.org/licenses/AFL-3.0
  * If you did not receive a copy of the license and are unable to
  * obtain it through the world-wide-web, please send an email
  * to license@prestashop.com so we can send you a copy immediately.
  *
  * @author    PrestaShop SA <contact@prestashop.com>
  * @copyright 2007-2021 PrestaShop SA and Contributors
  * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
  * International Registered Trademark & Property of PrestaShop SA
  *-->
<template>
  <div class="p-0 m-auto tw-container" id="billing-plans">
    <b-card id="billing-plans-card" class="tw-mb-1" no-body>
      <template v-slot:header>Select your plan</template>
      <b-card-body>
        <PsPlans
          :module-infos="features"
          highlight-plan="default-advanced"
          :account-api="accountApi"
          :module-name="moduleName"
          :module-logo="moduleLogo"
          :shop-uuid="shopUuid"
          :email-support="emailSupport"
          @back-to-settings="backToSettings()"
        />
      </b-card-body>
      <template v-slot:footer>
        <b-button @click.prevent="backToSettings()">
          Back
        </b-button>
      </template>
    </b-card>
  </div>
</template>

<script>
import { PsPlans } from "@prestashopcorp/prestashop_billing_vue_components";

export default {
  components: {
    PsPlans
  },
  props:{
    accountApi:{
      type: String,
      default: ''
    },
    moduleName:{
      type: String,
      default: ''
    },
    moduleLogo:{
      type: String,
      default: ''
    },
    shopUuid:{
      type: String,
      default: ''
    },
    emailSupport: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    features() {
      // Return the module features
      // ex: return this.$store.state.settings.plans;
      return [
        {
          "title": "Lorem ipsum 1",
          "feature": [{
              "id": "default-free",
              "type": "icon",
              "value": true
            },{
              "id": "default-advanced",
              "type": "icon",
              "value": true
          }]
        },
        {
          "title": "Lorem ipsum 2",
          "bold": true,
          "feature": [{
              "id": "default-free",
              "type": "icon",
              "value": false
            },{
              "id": "default-advanced",
              "type": "icon",
              "value": true
          }]
        },
        {
          "title": "Lorem ipsum 3",
          "bold": true,
          "feature": [{
              "id": "default-free",
              "type": "text",
              "value": "lorem"
            },{
              "id": "default-advanced",
              "type": "text",
              "value": "ipsum",
              "bold": true,
          }]
        },
      ]
    }
  },
  methods: {
    backToSettings() {
      this.$emit("back-to-settings");
    }
  },
  created() {
    console.log(this)
  }
};
</script>
