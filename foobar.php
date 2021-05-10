<?php
if (!defined('_PS_VERSION_'))
    exit;

require 'vendor/autoload.php';

use PrestaShop\PsAccountsInstaller\Installer\Exception\ModuleVersionException;
use PrestaShop\PsAccountsInstaller\Installer\Exception\ModuleNotInstalledException;

class Foobar extends Module
{

    private $container;

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
}