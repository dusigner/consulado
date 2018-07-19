/* global $: true, Nitro: true, dust */

'use strict';

require('Dust/product/upsell.html');
require('Dust/product/downgrade.html');


Nitro.module('upsell', function() {
	console.clear();

	const self = this;
	
	let 
		// pegando valores do produto atual
		urlUpgrade  = $('td.value-field.Link-do-Upgrade').text(),
		utlAtual = window.location.pathname,
		apiResponse,
		apiResponseUpgrade,
		apiResponseDowngrade;

	this.init = () => {
		var settingsDowngrade = {
			'url': `/api/catalog_system/pub/products/search/${utlAtual}`,
			'method': 'GET'
		};
		$.ajax(settingsDowngrade).then(function (responseDowngrade) {
			apiResponseDowngrade = responseDowngrade[0];		
			return responseDowngrade;
		});
		var settingsUpgrade = {
			'url': `/api/catalog_system/pub/products/search/${urlUpgrade}`,
			'method': 'GET'
		};
		$.ajax(settingsUpgrade).then(function (responseUpgrade) {
			apiResponseUpgrade = responseUpgrade[0];
			return responseUpgrade;
		}).done(function(){
			self.montandoModalMobile();
		});
	};


	this.montandoModalMobile = () => {
		apiResponse = {
			apiResponseDowngrade,
			apiResponseUpgrade
		};

		dust.render('upsell', apiResponse, function(err, out) {
			if (err) { 	throw new Error('upsell Dust error: ' + err); }
			$('#upsell').html(out).addClass('ativo');
		});

		$('body').on('click', '.btn-interessado-upgrade', function(){
			$('#modal-produto-upgrade').vtexModal();
		});
	};
	this.init();
});