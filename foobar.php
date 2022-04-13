<?php
if (!defined('_PS_VERSION_'))
    exit;

require 'vendor/autoload.php';

use ContextCore as Context;

class Foobar extends Module
{

    private $container;
    private $psVersionIs17;
    private $emailSupport;

    public function __construct()
    {
        $this->name = 'foobar';
        $this->tab = 'advertising_marketing';
        $this->version = '1.0.0';
        $this->author = 'Alex LU';
        $this->emailSupport = 'mail@support.org';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = [
            'min' => '1.6',
            'max' => _PS_VERSION_
        ];
        $this->psVersionIs17 = (bool) version_compare(_PS_VERSION_, '1.7', '>=');
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('foobar');
        $this->description = $this->l('My foobar is foobar.');

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');

        $this->template_dir = _PS_MODULE_DIR_ . $this->name . '/views/templates/admin/';

        if ($this->container === null) {
            $this->container = new \PrestaShop\ModuleLibServiceContainer\DependencyInjection\ServiceContainer($this->name, $this->getLocalPath());
        }
    }

    public function install()
    {
        return parent::install() && $this->getService('ps_accounts.installer')->install();
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

    /**
     * Get the isoCode from the context language, if null, send 'en' as default value
     *
     * @return string
     */
    public function getLanguageIsoCode()
    {
        return $this->context->language !== null ? $this->context->language->iso_code : 'en';
    }

    public function getContent()
    {
        $facade = $this->getService('ps_accounts.facade');
        Media::addJsDef([
            'contextPsAccounts' => $facade->getPsAccountsPresenter()
                ->present($this->name)
        ]);
        $this->context->smarty->assign('pathSettingsVendor', $this->getPathUri() . 'views/js/chunk-vendors-foobar-settings.' . $this->version . '.js');
        $this->context->smarty->assign('pathSettingsApp', $this->getPathUri() . 'views/js/app-foobar-settings.' . $this->version . '.js');
        try {

            $rbm_facade = $this->getService('ps_rbm.facade');

            Media::addJsDef([
                'storePsFoobar' => [
                    'context' => array_merge($rbm_facade->present([
                        'versionPs' => _PS_VERSION_,
                        'versionModule' => $this->version,
                        'moduleName' => $this->name,
                        'emailSupport' => $this->emailSupport,
                        'isoCode' => $this->getLanguageIsoCode(),
                        'ipAddress' => (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : '',
                        'moduleTosUrl' => $this->getTosLink(),
                    ]),
                    [
                        // 'quantity' => 15000,
                        //'isSandbox' => true,
                        // 'planIdSelected' => null,
                        // 'byPassSelection' => true,
                    ]
                    )
                ]
            ]);

        } catch (Exception $e) {
            // You handle exception here
        }

        return $this->context->smarty->fetch($this->template_dir . 'foobarSettings.tpl');
    }

    /**
     * Get the Tos URL from the context language, if null, send default link value
     *
     * @return string
     */
    public function getTosLink()
    {
        $iso_lang = $this->getLanguageIsoCode();
        switch ($iso_lang) {
            case 'fr':
                $url = 'https://www.prestashop.com/fr/prestashop-account-cgu';
                break;
            default:
                $url = 'https://www.prestashop.com/en/prestashop-account-terms-conditions';
                break;
        }

        return $url;
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