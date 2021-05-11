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
import dayjs from "dayjs";

export default {
  // setLogOut(state, payload) {
  //   state.googleLinked = payload.googleLinked;
  // },
  // setRefresh(store, payload) {
  //   store.refreshGA = payload;
  // },
  // selectAccountAnalytics(state, payload) {
  //   state.googleAccount = payload.googleAccount;
  // },
  // setGTAAvailable(state, payload) {
  //   state.GTAAvailable = payload;
  // },
  // setGTMAvailable(state, payload) {
  //   state.GTMAvailable = payload;
  // },
  // setLoadingLogOut(store, payload) {
  //   store.loadingLogout = payload;
  // },
  // setLoadingAvailableGoogleTag(store, payload) {
  //   store.loadingAvailableGoogleTag = payload;
  // },
  // setLoadingSelectAccountAnalytics(store, payload) {
  //   store.loadingSelectAccountAnalytics = payload;
  // },
  // setLoadingRefreshGA(store, payload) {
  //   store.loadingRefreshGA = payload;
  // },
  // setLoadingInstallModuleGA(store, payload) {
  //   store.loadingInstallModuleGA = payload;
  // },
  // setResponseInstallGA(store, payload) {
  //   store.responseInstallGA = payload;
  //   if (payload.ps_googleanalytics.status) {
  //     store.gaModule.isInstalled = true;
  //     store.gaModule.isEnabled = true;
  //   }
  // },
  setLoadingListProperty(store, payload) {
    store.loadingListProperty = payload;
  },
  setListPropertySuccess(store, payload) {
    store.listPropertySuccess = payload;
  },
  setListPropertyError(store, payload) {
    store.listPropertyError = payload;
  },
  setLoadingBilling(store, payload) {
    store.loadingBilling = payload;
  },
  setBillingSuccess(store, payload) {
    store.billingSuccess = payload;
  },
  setBillingError(store, payload) {
    store.billingError = payload;
  },
  setDisplayModulePlans(store, payload) {
    store.displayModulePlans = payload;
  },
  setToken(store, payload) {
    sessionStorage.setItem("metricsToken", payload.token);
  },
  setAccount(store, payload) {
    store.accounts = { ...payload };
    if (payload.first_sync_asked_at !== -1) {
      store.syncStatus = "scheduled";
    }
    if (payload.last_sync_at !== -1) {
      store.syncStatus = "done";
    }
    if (payload.start_sync_at !== -1) {
      store.syncStatus = "syncing";
    }

    if (
      payload.start_sync_at !== -1 &&
      (dayjs().isAfter(dayjs(payload.start_sync_at), "day") ||
        dayjs().isSame(dayjs(payload.start_sync_at), "day"))
    ) {
      store.syncStatus = "done";
    }
  },
  setStartSync(store, payload) {
    store.accounts.start_sync_at = payload;
    store.syncStatus = "syncing";
  },
  setLastSync(store, payload) {
    store.accounts.last_sync_at = payload;
    store.accounts.next_sync_at = dayjs(payload)
      .add(1, "day")
      .startOf("day")
      .add(1, "hours")
      .valueOf();
    store.syncStatus = "done";
  },
  setStartSyncedAt(store, payload) {
    store.accounts.first_sync_asked_at = payload;
    store.syncStatus = "scheduled";
  },
  setPlan(store, payload) {
    store.accounts.plan = payload.plan;
    if (payload.plan !== "default-free") {
      document.cookie = `1f7f8a936d0bf02d1a36ae49bb4f010c=${JSON.stringify(
        payload
      )};expires=-1;path=/`;
    }
  }
};
