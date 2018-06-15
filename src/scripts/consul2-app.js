
/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');


// Vendors
require('vendors/jquery.cookie');
require('vendors/jquery.inputmask');
require('vendors/jquery.debounce');
require('vendors/slick');
require('vendors/ajax.localstorage');
require('vendors/vtex-modal');
require('vendors/dust-helpers');

if (VERSION) {

	console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

	window._trackJs = window._trackJs || {};

	window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

// require('modules/_autoloader');

require('expose?store!modules/store/store');
require('expose?publishDataLayer!modules/bi/publish-data-layer');

//load modules individually
require('modules/vtex-events')();
require('modules/header');
require('modules/footer');
require('modules/store/cluster');
require('modules/percentoff');
require('modules/descadastrar.emailCRM.js');
require('modules/store/vtex-login');
require('modules/banners-controller');
require('modules/prateleira');
require('modules/customLogin');
require('controllers/landing-gae-compra-interno');

Nitro.setup([/*'geo', */'cluster', 'percentoff', 'descadastrar.emailCRM', 'vtex-login', 'prateleira' /*, 'login.url'*/, 'redirect', 'customLogin', 'landing-gae-compra-interno'], function() {
	var path = window.location.pathname;

	if (path === '/atendimento') {
		$(location).attr('href', '//consul.custhelp.com/');
	}

	if ('serviceWorker' in navigator && window.location.origin.indexOf(':30') < 0) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('/files/service-worker.js', { scope: '../' }).then(function(registration) {
				// Registration was successful
				console.log('ServiceWorker reegistration successful.', registration);
			}).catch(function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		});
	}
});