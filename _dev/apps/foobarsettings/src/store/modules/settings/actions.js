/**
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
 */
import { call, put } from "@/lib/store-saga";
import {
  // gaLogOut,
  // selectAccountAnalytics,
  // getAvailableGoogleTags,
  // gaRefresh,
  // installModuleGA,
  getListProperty,
  initBillingFree,
  retrieveToken
} from "@/connectors/app.api";

export default {
  /* eslint-disable-next-line no-unused-vars */
  // *installModuleGA(store, payload) {
  //   yield put("setLoadingInstallModuleGA", true);
  //   const response = yield call(installModuleGA, payload);
  //   yield put("setResponseInstallGA", response);
  //   yield put("setLoadingInstallModuleGA", false);
  // },
  /* eslint-disable-next-line no-unused-vars */
  // *getLogOut(store, payload) {
  //   yield put("setLoadingLogOut", true);
  //   const response = yield call(
  //     gaLogOut,
  //     store.rootState.app.controllersLinks.settingsAjax
  //   );
  //   yield put("setLogOut", response);
  //   yield put("setGaIsOnboarded", response.googleLinked);
  //   yield put("setLoadingLogOut", false);
  //   return true;
  // },
  /* eslint-disable-next-line no-unused-vars */
  // *refreshAnalyticsAccount(store, payload) {
  //   yield put("setLoadingRefreshGA", true);
  //   const response = yield call(
  //     gaRefresh,
  //     store.rootState.app.controllersLinks.settingsAjax
  //   );
  //   yield put("setRefresh", response);
  //   yield put("setLoadingRefreshGA", false);
  //   return true;
  // },
  // /* eslint-disable-next-line no-unused-vars */
  // *selectAccountAnalytics(store, payload) {
  //   if (store.state.googleAccount.webPropertyId !== payload.webPropertyId) {
  //     yield put("setLoadingSelectAccountAnalytics", true);
  //     const response = yield call(
  //       selectAccountAnalytics,
  //       store.rootState.app.controllersLinks.settingsAjax,
  //       payload
  //     );
  //     yield put("selectAccountAnalytics", response);
  //     yield put("setLoadingSelectAccountAnalytics", false);
  //   }
  // },
  // /* eslint-disable-next-line no-unused-vars */
  // *getAvailableGoogleTags(store) {
  //   yield put("setLoadingAvailableGoogleTag", true);
  //   const response = yield call(
  //     getAvailableGoogleTags,
  //     store.rootState.app.controllersLinks.settingsAjax
  //   );
  //   yield put("setGTAAvailable", response.analytics);
  //   yield put("setGTMAvailable", response.manager);
  //   yield put("setLoadingAvailableGoogleTag", false);
  // },
  // /* eslint-disable-next-line no-unused-vars */
  *getListProperty(store) {
    yield put("setLoadingListProperty", true);
    const response = yield call(
      getListProperty,
      store.rootState.app.controllersLinks.settingsAjax
    );
    if (response.success) {
      yield put("setListPropertySuccess", response.listProperty);
      yield put("setListPropertyError", "");
    } else {
      yield put("setListPropertyError", response.error);
    }
    yield put("setLoadingListProperty", false);
    return Object.keys(response.listProperty).length;
  },
  *initBillingFree(store) {
    yield put("setLoadingBilling", true);
    const response = yield call(
      initBillingFree,
      store.rootState.app.controllersLinks.settingsAjax
    );
    console.log('initBillingFree', store, response);
    if (response.success) {
      yield put("setBillingSuccess", response.billing);
    } else {
      yield put("setBillingError", "error billing");
    }
    yield put("setLoadingBilling", false);
  },
  *setDisplayModulePlans(store, payload) {
    yield put("setDisplayModulePlans", payload);
  },
  *retrieveToken(store) {
    const response = yield call(
      retrieveToken,
      // store.state.controllersLinks.accounts
      store.rootState.app.controllersLinks.accounts
    );
    if(response !== null){
      console.log('retrieveToken', response);
      yield put("setToken", response);
    }
  },
  *selectAccount(store, payload) {
    yield put("setAccount", payload);
  },
  *setPlan(store, payload) {
    yield put("setPlan", payload);
  },
  *setStartSync(store, payload) {
    yield put("setStartSync", payload);
  },
  *setLastSync(store, payload) {
    yield put("setLastSync", payload);
  },
  *setStartSyncedAt(store, payload) {
    yield put("setStartSyncedAt", payload);
  }
};
