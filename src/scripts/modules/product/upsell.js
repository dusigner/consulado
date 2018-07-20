/* global $: true, Nitro: true, dust */

'use strict';

require('Dust/product/upsell.html');
require('Dust/product/downgrade.html');
require('../bi/upselldataLayer');


Nitro.module('upsell', 'upselldataLayer', function() {
	console.clear();

	const self = this;
	
	let 
		// pegando valores do produto atual	
		urlUpgradetd       = $('td.value-field.Link-do-Upgrade'),
		urlUpgrade         = $('td.value-field.Link-do-Upgrade').text(),
		
		uri   = window.location.href,
		urlAtual = window.location.pathname,
		verifyDowngrade = uri.split('downgrade=')[1],
		// template = 'upsell',
		apiResponse,
		apiResponseUpgrade,
		apiResponseDowngrade;

		// if (uri.indexOf('downgrade') !== -1) {
		// 	console.log('🤞');
		// 	template = 'downgrade';
		// 	urlAtual = verifyDowngrade;
		// }

		// uri.indexOf('downgrade') !== -1 ? urlAtual = verifyDowngrade template = 'downgrade' : '';

		console.log('urlAtual', urlAtual, 'template');

	this.init = () => {
		var settingsDowngrade = {
			'url': `/api/catalog_system/pub/products/search/${urlAtual}`,
			'method': 'GET'
		};
		$.ajax(settingsDowngrade).then(function (responseDowngrade) {
			apiResponseDowngrade = responseDowngrade[0];		
			return responseDowngrade;
		}).done(function(){
			self.renderUpsell();
		});
		var settingsUpgrade = {
			'url': `/api/catalog_system/pub/products/search/${urlUpgrade}`,
			'method': 'GET'
		};
		$.ajax(settingsUpgrade).then(function (responseUpgrade) {
			apiResponseUpgrade = responseUpgrade[0];
			return responseUpgrade;
		}).done(function(){
			self.renderUpsell();
		});
	};	

	this.renderUpsell = () => {
		apiResponse = {
			apiResponseDowngrade,
			apiResponseUpgrade				
		};	
		dust.render('upsell', apiResponse, function(err, out) {
			if (err) { 	throw new Error('upsell Dust error: ' + err); }
			console.log('🙌', apiResponse);	
			$('#upsell').html(out);
		});	
		self.valordiferenca();
		self.openclose();
		self.responsivo();
		self.responsivo();
		// upselldataLayer.setup();
	};
	
	this.openclose = () => {
		// Abre o modal de upgrade
		$('.btn-interessado-upgrade').click(function() {			
			$('#modal-produto-upgrade').vtexModal();			
		});
		// fecha barra fixa
		$('.close-fixed, .icon-open-upgrade').click(function() {
			$('#upsell').toggleClass('ativo');
			$('.icon-open-upgrade').toggleClass('ativo');
		});			
	};

	this.valordiferenca = () => {
		// pega e formata o preço do produto upgrade
		let
			priceBarra         = Number($('.title-price-upgrade span').text()),
			priceBarraFormt    = _.formatCurrency( priceBarra );
		$('.title-price-upgrade span, .corpo-produtos-modal .oportunidadePro span, .price-mobile-upgrade').html(`R$ ${priceBarraFormt}`);

		// formata o preco do pruduto atual dentro do modal
		let
			priceatulmodal         = Number($('.voce-esta-vendo span').text()),
			priceatulmodalFormat    = _.formatCurrency( priceatulmodal );
		$('.voce-esta-vendo span').html(`R$ ${priceatulmodalFormat}`);
		
		// Pega, formata e subtrai os valores dos produtos na barra fixa
		let
			valorProdatualcalc = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
			valorProupgrade    = $('.title-price-upgrade span').text().replace(/\D/gmi, ''),
			valordiferenca     = Number(valorProupgrade) - Number(valorProdatualcalc),
			price              = `POR + R$ ${_.formatCurrency( valordiferenca / 100)}`;
		$('.textupgrade span, .info-product-mobile > span').html( price );
	};

	this.responsivo = () => {
		if ($(window).width() <= 768) {
			$(document).ready(function(){
				$('.product-upgrade').removeClass('hide').addClass('mobile');			
				$('.upgrade-mobile').removeClass('hide');			
				$('#upsell').addClass('mobile');			
			});	
		} else {
			$(document).ready(function(){				
				$('.product-upgrade').removeClass('hide');		
			});				
		}
	};
	
	this.init();

});