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
import request from "@/utils/request";
import forEach from "lodash/forEach";

const BILLING_API_LOCALHOST = "http://localhost:3000";

function prepareForm(params) {
  const form = new FormData();
  form.append("ajax", true);
  form.append("action", params.action);
  form.append("controller", params.controller);
  forEach(params.data, (value, key) => {
    form.append(key, value);
  });
  return form;
}

export default {};

// export function gaLogOut(url) {
//   const requestParams = {
//     action: "LogOut",
//     controller: "AdminAjaxSettings"
//   };
//   const form = prepareForm(requestParams);
//   request.createApi();
//   return request.api.post(url, form);
// }

// export function selectAccountAnalytics(url, params) {
//   const requestParams = {
//     action: "SelectAccountAnalytics",
//     controller: "AdminAjaxSettings",
//     data: {
//       webPropertyId: params.webPropertyId,
//       viewId: params.viewId,
//       username: params.username,
//       webPropertyName: params.webPropertyName
//     }
//   };
//   const form = prepareForm(requestParams);
//   request.createApi();
//   return request.api.post(url, form);
// }

// export function getAvailableGoogleTags(url) {
//   const requestParams = {
//     action: "GetExistingGoogleTags",
//     controller: "AdminAjaxSettings"
//   };
//   const form = prepareForm(requestParams);
//   request.createApi();
//   return request.api.post(url, form);
// }

// export function gaRefresh(url) {
//   const requestParams = {
//     action: "RefreshGA",
//     controller: "AdminAjaxSettings"
//   };
//   const form = prepareForm(requestParams);
//   request.createApi();
//   return request.api.post(url, form);
// }

export function getListProperty(url) {
  const requestParams = {
    action: "ListProperty",
    controller: "AdminAjaxSettings"
  };
  const form = prepareForm(requestParams);
  request.createApi();
  return request.api.post(url, form);
}

// export function installModuleGA(url) {
//   request.createApi();
//   return request.api.post(url);
// }

// export function toggleDashboardModules(url) {
//   const requestParams = {
//     action: "ToggleDashboardModules",
//     controller: "AdminAjaxDashboard"
//   };
//   const form = prepareForm(requestParams);
//   request.createApi();
//   return request.api.post(url, form);
// }

export function initBillingFree(url) {
  const requestParams = {
    action: "BillingFree",
    controller: "AdminAjaxSettings"
  };
  const form = prepareForm(requestParams);
  request.createApi();
  return request.api.post(url, form);
}

export function getCustomer(shopId) {
  request.createApi();
  return request.api.get(`${BILLING_API_LOCALHOST}/shops/${shopId}`);
}
export function createCustomer(shopId, payload) {
  request.createApi();
  return request.api.post(`${BILLING_API_LOCALHOST}/shops/${shopId}`, payload);
}
export function getSubscription(shopId, moduleName) {
  request.createApi();
  return request.api.get(
    `${BILLING_API_LOCALHOST}/shops/${shopId}/subscriptions/${moduleName}`
  );
}
export function createFreeSubscription(shopId, moduleName) {
  const payload = {
    module: moduleName,
    plan_id: "default-free"
  };
  request.createApi();
  return request.api.post(
    `${BILLING_API_LOCALHOST}/shops/${shopId}/subscriptions/${moduleName}`,
    payload
  );
}

export function retrieveToken(url) {
  request.createApi();
  return request.api.get(`${url}&action=GetOrRefreshToken`);
}
