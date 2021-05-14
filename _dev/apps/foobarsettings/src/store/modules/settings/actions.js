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
  initBillingFree,
  retrieveToken
} from "@/connectors/app.api";

export default {
  // /* eslint-disable-next-line no-unused-vars */
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
      store.rootState.app.controllersLinks.accounts
    );
    if(response !== null){
      console.log('retrieveToken', response);
      yield put("setToken", response);
    }
  },
};
