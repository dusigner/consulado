
'use strict';

require('Dust/product/upgrade.html');
require('Dust/product/downgrade.html');


Nitro.module('upsell', function() {
	console.clear();
	
	const self = this;
	
	let 
		urlUpgradetd       = $('td.value-field.Link-do-Upgrade'),
		urlUpgrade         = $('td.value-field.Link-do-Upgrade').text(),
		
		uri   = window.location.href,
		currentUrl = window.location.pathname,
		verifyDowngrade = uri.indexOf('downgrade'),
		template = 'upgrade',
		apiResponse,
		apiResponseUpgrade,
		apiResponseDowngrade;

	if (verifyDowngrade > 0) {
		template = 'downgrade';
		currentUrl = uri.split('downgrade=')[1];
	}
		

	this.init = () => {
		var getDowngrade = {
			'url': `/api/catalog_system/pub/products/search/${currentUrl}`,
			'method': 'GET'
		};
		$.ajax(getDowngrade).then(function (responseDowngrade) {
			apiResponseDowngrade = responseDowngrade[0];		
			return responseDowngrade;
		}).done(function(){		
			var getUpgrade = {
				'url': `/api/catalog_system/pub/products/search/${urlUpgrade}`,
				'method': 'GET'
			};
			$.ajax(getUpgrade).then(function (responseUpgrade) {
				apiResponseUpgrade = responseUpgrade[0];
				return responseUpgrade;
			}).done(function(){
				self.renderUpsell();
			});			
		});		
	};	

	this.renderUpsell = () => {
		
		apiResponse = {
			apiResponseDowngrade,
			apiResponseUpgrade,
			diferential01: apiResponseDowngrade['Diferencial 01'][0],				      
			diferential02: apiResponseDowngrade['Diferencial 02'][0],
			diferential03: apiResponseDowngrade['Diferencial 03'][0]		
		};
		
			
		dust.render(template, apiResponse, function(err, out) {
			if (err) { 	throw new Error('upsell Dust error: ' + err); }
			console.log('🙌', apiResponse);	
			$('#upsell').html(out);
		});	

		self.opencloseAndMobile();
		self.tag();
		self.formatPrice();
	};
	
	this.opencloseAndMobile = () => {
		// Abre o modal de upgrade
		$('.btn-interessado-upgrade').click(function() {			
			$('#modal-produto-upgrade').vtexModal();			
		});
		// fecha barra fixa
		$('.close-fixed, .icon-open-upgrade').click(function() {
			$('#upsell').toggleClass('active');
			$('.icon-open-upgrade').toggleClass('active');
		});
		// verifica device
		if ($(window).width() <= 768) {
			$(document).ready(function(){
				$('.product-upgrade').addClass('mobile');		
				$('.upgrade-mobile').removeClass('hide');			
				$('#upsell').addClass('mobile');
			});	
		}
	};

	this.formatPrice = () => {
		// pega e formata o preço do produto upgrade
		let
			priceBar         = Number(apiResponseUpgrade.items[0].sellers[0].commertialOffer.Price);
		(priceBar < 1 && apiResponseUpgrade.items[1]) ? priceBar = Number(apiResponseUpgrade.items[1].sellers[0].commertialOffer.Price) : '';
		(verifyDowngrade > 0) ? priceBar = Number(apiResponseDowngrade.items[0].sellers[0].commertialOffer.Price) : '';
		(verifyDowngrade > 0 && priceBar < 1) ? priceBar = Number(apiResponseDowngrade.items[1].sellers[0].commertialOffer.Price) : '';
		$('.title-price-upgrade span, .corpo-produtos-modal .oportunidadePro span, .price-mobile-upgrade').html(`R$ ${_.formatCurrency( priceBar )}`);

		// Se nenhum preco estiver disponivel nao exibe o upsell
		(priceBar < 1) && $('#upsell').remove();

		// formata o preco do pruduto atual dentro do modal
		let
			priceCurrentmodal         = Number($('.voce-esta-vendo span').text());
		$('.voce-esta-vendo span').html(`R$ ${_.formatCurrency( priceCurrentmodal )}`);
		
		// Pega, formata e subtrai os valores dos produtos na Barra fixa
		let
			priceCurrent = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
			priceUpgrade    = $('.title-price-upgrade span').text().replace(/\D/gmi, ''),
			priceDifference     = Number(priceUpgrade) - Number(priceCurrent);
		$('.textupgrade span, .info-product-mobile > span').html(`POR + R$ ${_.formatCurrency( priceDifference / 100)}`);
		
	};

	this.tag = () => {
		//Tagueamento datalayer
		$('.btn-interessado-upgrade').click(function() {
			//Tagueamento datalayer
			if( !$(this).hasClass('voltar') ){
				dataLayer.push({
					event: $(this).attr('data-event'),
					category: $(this).attr('data-caegory'),
					action: $(this).attr('data-action'),
					label: $(this).attr('data-label')
				});
			}else{	
				dataLayer.push({
					event: $(this).attr('data-event'),
					category: 'ver produto anterior',
					action: $(this).attr('data-action'),
					label: $(this).attr('data-label')
				});
			}	
		});
		

		//Tagueamento dataLayer
		$('.close-fixed').click(function(){
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'barra',
				label: 'Sair'
			});
		});

		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});

		//Tagueamento dataLayer
		$('.aceitarounao a').click(function(){
			var action = $(this).text();
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: action
			});
		});

		//Tagueamento datalayer
		$('#vtex-modal-produto-upgrade .modal-header .close').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'de um Upgrade',
				action: 'Modal',
				label: 'Sair'
			});
		});		

		//Tagueamento datalayer
		$('.btn-interessado-downgrade').click(function(){	
			dataLayer.push({
				event: 'visualTracking',
				category: 'ver produto anterior',
				action: 'barra',
				label: 'Ver produto novamente'
			});
		});	
	};
	
	(urlUpgradetd.length >= 1 || verifyDowngrade > 0) && this.init();

});