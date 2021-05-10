<?php

/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */


class AdminAjaxSettingsController extends ModuleAdminController
{
    /**
     * @var Ps_metrics
     */
    public $module;

    /**
     * Load JsonHelper to avoid jsonEncode issues on AjaxDie
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Init Billing Free
     *
     * @return void
     */
    public function ajaxProcessBillingFree()
    {

        /** @var PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts $accounts */
        $accounts = $this->module->getService('ps_accounts.facade');
        $billingService = $accounts->getPsBillingService();

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip_address = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) { //whether ip is from proxy
            $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else { //whether ip is from remote address
            $ip_address = $_SERVER['REMOTE_ADDR'];
        }

        $result = $billingService->subscribeToFreePlan($this->module->name, 'metrics-free', false, $ip_address);

        if (empty($result)) {
            $this->ajaxDie($this->jsonEncode([
                'success' => false,
            ]));
        }

        $this->ajaxDie($this->jsonEncode([
            'success' => true,
            'billing' => $result,
        ]));
    }

    /**
     * Encode the data to json and check and force the return to empty string if false
     *
     * @param mixed $data
     *
     * @return string
     */
    public function jsonEncode($data)
    {
        $json = json_encode($data);
        if (empty($data)) {
            $json = json_encode($data, JSON_FORCE_OBJECT);
        }

        if (false !== $json) {
            return $json;
        }

        $this->loggerHelper->addLog('[PS_METRICS] Unable to encode Json', 3);

        return '';
    }

}
