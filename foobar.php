<?php
if (!defined('_PS_VERSION_'))
    exit;

require 'vendor/autoload.php';

use PrestaShop\PsAccountsInstaller\Installer\Exception\ModuleVersionException;
use PrestaShop\PsAccountsInstaller\Installer\Exception\ModuleNotInstalledException;
use ContextCore as Context;

class Foobar extends Module
{

    private $container;
    private $ajaxSettingsController;
    private $psVersionIs17;

    public function __construct()
    {
        $this->name = 'foobar';
        $this->tab = 'advertising_marketing';
        $this->version = '1.0.0';
        $this->author = 'Alex LU';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = [
            'min' => '1.6',
            'max' => _PS_VERSION_
        ];
        $this->psVersionIs17 = (bool) version_compare(_PS_VERSION_, '1.7', '>=');
        $this->ajaxSettingsController = 'AdminAjaxSettings';
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('foobar');
        $this->description = $this->l('My foobar is foobar.');

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');

        $this->template_dir = '../../../../modules/' . $this->name . '/views/templates/admin/';

        if ($this->container === null) {
            $this->container = new \PrestaShop\ModuleLibServiceContainer\DependencyInjection\ServiceContainer($this->name, $this->getLocalPath());
        }
    }

    public function install()
    {
        return parent::install() &&
            $this->getService('ps_accounts.installer')->install();
    }

    public function uninstall()
    {
        if (!parent::uninstall() ||
            !Configuration::deleteByName('FOOBAR')
        ) {
            return false;
        }

        return true;
    }

    public function getContent()
    {
        $facade = $this->getService('ps_accounts.facade');
        Media::addJsDef([
            'contextPsAccounts' => $facade->getPsAccountsPresenter()
                ->present($this->name),
        ]);

        $this->context->smarty->assign('pathSettingsVendor', $this->getPathUri() . 'views/js/chunk-vendors-foobar-settings.' . $this->version . '.js');
        $this->context->smarty->assign('pathSettingsApp', $this->getPathUri() . 'views/js/app-foobar-settings.' . $this->version . '.js');


        try {
            $psAccountsService = $facade->getPsAccountsService();

            $shopUuid = $psAccountsService->getShopUuidV4();
            $apiUrl = $psAccountsService->getAdminAjaxUrl();
            $email = $psAccountsService->getEmail();
            $emailIsValidated = $psAccountsService->isEmailValidated();

            Media::addJsDef([
                'storePsFoobar' => [
                    'context' => [
                        'moduleName' => $this->name,
                        'controllersLinks' => [
                            'accounts' => $apiUrl,
                            'settingsAjax' => $this->getAdminLink($this->ajaxSettingsController),
                        ],
                        'shop' => [
                            'shopUuid' => $shopUuid,
                        ],
                        'user' => [
                            'email' => $email,
                            'emailIsValidated' => $emailIsValidated,
                        ]
                    ]
                ]
            ]);

        } catch (ModuleNotInstalledException $e) {

            // You handle exception here

        } catch (ModuleVersionException $e) {

            // You handle exception here
        }

        return $this->context->smarty->fetch($this->template_dir . 'foobarSettings.tpl');
    }

    /**
     * Retrieve service
     *
     * @param string $serviceName
     *
     * @return mixed
     */
    public function getService($serviceName)
    {
        if ($this->container === null) {
            $this->container = new \PrestaShop\ModuleLibServiceContainer\DependencyInjection\ServiceContainer(
                $this->name,
                $this->getLocalPath()
            );
        }

        return $this->container->getService($serviceName);
    }

    /**
     * Adapter for getAdminLink from prestashop link class
     *
     * @param string $controller controller name
     * @param bool $withToken include or not the token in the url
     * @param array $sfRouteParams
     * @param array $params
     *
     * @return string
     */
    public function getAdminLink($controller, $withToken = true, $sfRouteParams = [], $params = [])
    {
        if ($this->psVersionIs17) {
            return Context::getContext()->link->getAdminLink($controller, $withToken, $sfRouteParams, $params);
        }

        $paramsAsString = '';
        foreach ($params as $key => $value) {
            $paramsAsString .= "&$key=$value";
        }

        return Tools::getShopDomainSsl(true) . __PS_BASE_URI__ . basename(_PS_ADMIN_DIR_) . '/' . Context::getContext()->link->getAdminLink($controller, $withToken) . $paramsAsString;
    }
}