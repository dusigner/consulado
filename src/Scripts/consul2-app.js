
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

// Global
var URI = require('urijs');
var localStore = require('store');

window.URI = URI;
window.localStore = localStore;

require('expose-loader?store!modules/store/store');

//load modules individually
require('modules/vtex-events')();
require('modules/header');
// require('modules/footer');
require('modules/footer-2019');
require('modules/store/cluster');
require('modules/percentoff');
require('modules/descadastrar.emailCRM.js');
require('modules/store/vtex-login');
require('modules/prateleira');
require('modules/customLogin');
require('modules/isTelevendasCorp');
require('modules/store/callcenter');

const changeCallcenterLinks = () => {

	if( $('body').is('.neemu.listagem.busca.consul') && (window.location.search.indexOf('vtexcommercestable=1') > 0 || (window.getCookie && window.getCookie('MTC').indexOf('.vtexcommercestable.com.br') > 0 ))) {
		localStorage.removeItem('lastUrl');
		$('a[href*="//loja.consul.com.br/"]').attr('href', function() {
			return $(this).attr('href').replace('loja.consul.com.br', 'consul.vtexcommercestable.com.br');
		});
	}
	if(document.referrer.match('myvtex') || localStorage.lastUrl === 'myvtex'){
		localStorage.lastUrl = 'myvtex';

		$('a[href*="//loja.consul.com.br/"]').attr('href', function() {
			return $(this).attr('href').replace('loja.consul.com.br', 'consul.myvtex.com');
		});
		$('a[href*="//consul.vtexcommercestable.com.br/"]').attr('href', function() {
			return $(this).attr('href').replace('consul.vtexcommercestable.com.br', 'consul.myvtex.com');
		});
	}
};

Nitro.setup([/*'geo', */'cluster', 'percentoff', 'descadastrar.emailCRM', 'vtex-login', 'prateleira' /*, 'login.url'*/, 'redirect', 'customLogin', 'isTelevendasCorp', 'callcenter'], function() {

	var path = window.location.pathname;


	if (path === '/atendimento') {
		$(location).attr('href', '//consul.custhelp.com/');
	}

	if ('serviceWorker' in navigator && window.location.origin.indexOf(':30') < 0) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('/files/service-worker.js', { scope: '../' }).then(function(registration) {
				// Registration was successful
				console.info('ServiceWorker reegistration successful.', registration);
			}).catch(function(err) {
				// registration failed :(
				console.info('ServiceWorker registration failed: ', err);
			});
		});
	}

	changeCallcenterLinks();
});

$(window).load(changeCallcenterLinks);
