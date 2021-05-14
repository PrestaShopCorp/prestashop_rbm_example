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

// const BILLING_API_LOCALHOST = "http://localhost:3000";

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

export function initBillingFree(url) {
  const requestParams = {
    action: "BillingFree",
    controller: "AdminAjaxSettings"
  };
  const form = prepareForm(requestParams);
  request.createApi();
  return request.api.post(url, form);
}

export function retrieveToken(url) {
  request.createApi();
  return request.api.get(`${url}&action=GetOrRefreshToken`);
}
