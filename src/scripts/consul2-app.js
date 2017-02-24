/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

if (VERSION) {

    console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

    window._trackJs = window._trackJs || {};

    window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

require('modules/_autoloader');

//load modules individually
require('modules/vtex-events')();
require('modules/store/geo');
require('modules/header');
require('modules/footer');
require('modules/percentoff');
require('modules/vendas.pj');
require('modules/descadastrar.emailCRM.js');
require('modules/store/login.url');

Nitro.setup(['geo', 'percentoff', 'vendas.pj', 'descadastrar.emailCRM', 'login.url'], function() {

    $('.helperComplement').remove();

});
