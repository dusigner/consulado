'use strict';

require('Dust/product/upgrade.html');
require('Dust/product/downgrade.html');

Nitro.module('upsell', function() {

	const self = this;

	let
		showNotAvaiable = $('td.value-field.Condicao-Indisponivel').text(),
		urlUpgradetd = $('td.value-field.Link-do-Upgrade'),
		urlUpgrade = $('td.value-field.Link-do-Upgrade').text(),
		uri = window.location.href,
		currentUrl = window.location.pathname,
		verifyDowngrade = uri.indexOf('downgrade'),
		verifyAutoModal = uri.indexOf('campaign-upsell'),
		template = 'upgrade',
		apiResponse,
		apiResponseUpgrade,
		apiResponseDowngrade;
	(verifyDowngrade > 0) && (template = 'downgrade', currentUrl = uri.split('downgrade=')[1]);

	this.init = () => {
		let setAPI = {
			'url': `/api/catalog_system/pub/products/search/${currentUrl}`,
			'method': 'GET'
		};
		$.ajax(setAPI).then(function (responseDowngrade) {
			apiResponseDowngrade = responseDowngrade[0];
			return responseDowngrade;
		}).done(function(){
			let setAPI = {
				'url': `/api/catalog_system/pub/products/search/${urlUpgrade}`,
				'method': 'GET'
			};
			$.ajax(setAPI).then(function (responseUpgrade) {
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
			diferential03: apiResponseDowngrade['Diferencial 03'][0],
			available: skuJson.available
		},dust.render(template, apiResponse, function(err, out) {
			if (err) { 	throw new Error('upsell Dust error: ' + err); }
			$('#upsell').html(out);
		});
		self.openCloseAndMobile();
		self.tag();
		self.formatPrice();
	};

	this.openCloseAndMobile = () => {
		// Abre o modal de upgrade
		$('.btn-interessado-upgrade').click(function() {
			$('#modal-produto-upgrade').vtexModal();
		});
		// Abre modal se for campanha automatica
		(verifyAutoModal > 0) && $('#modal-produto-upgrade').vtexModal();
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
		let priceBar; // pega e formata o preço do produto upgrade
		(verifyDowngrade > 0) ? priceBar = Number(apiResponseDowngrade.items[0].sellers[0].commertialOffer.Price) : priceBar = Number(apiResponseUpgrade.items[0].sellers[0].commertialOffer.Price);
		(priceBar < 1 && apiResponseUpgrade.items[1]) ? priceBar = Number(apiResponseUpgrade.items[1].sellers[0].commertialOffer.Price) : '';
		(verifyDowngrade > 0 && priceBar < 1) ? priceBar = Number(apiResponseDowngrade.items[1].sellers[0].commertialOffer.Price) : '';
		$('.title-price-upgrade span, .corpo-produtos-modal .oportunidadePro span, .price-mobile-upgrade').html(`R$ ${_.formatCurrency( priceBar )}`);

		(priceBar < 1) && $('#upsell').remove(); // Se nenhum preco estiver disponivel nao exibe o upsell

		let // formata o preco do pruduto atual dentro do modal
			priceCurrentmodal = Number($('.voce-esta-vendo span').text());

		
		// Check if current product is available. If not, set price with unavailable message
		if (priceCurrentmodal) {
			$('.voce-esta-vendo span').html(`R$ ${_.formatCurrency( priceCurrentmodal )}`);

		} else { 

			$('.voce-esta-vendo span').html('Indisponível');
		}

		let // Pega, formata e subtrai os valores dos produtos na Barra fixa
			priceCurrent = $('.prod-preco .skuBestPrice').text().replace(/\D/gmi, ''),
			priceUpgrade = $('.title-price-upgrade span').text().replace(/\D/gmi, ''),
			priceDifference = Number(priceUpgrade) - Number(priceCurrent);
		$('.textupgrade span, .info-product-mobile > span').html(`POR + R$ ${_.formatCurrency( priceDifference / 100)}`);
	};

	this.tag = () => {
		$('.tag').click(function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: $(this).attr('data-category'),
				action: $(this).attr('data-action'),
				label: $(this).attr('data-label')
			});
		});
	};

	const
		isCheckedAndUnavailable = (showNotAvaiable === 'Sim' && skuJson.available === false),
		isNotChecketAndAvailable = (showNotAvaiable === '' && skuJson.available === true),
		availableUpsell = (isCheckedAndUnavailable || isNotChecketAndAvailable),
		hasBeenRegistred = urlUpgradetd.length >= 1 || verifyDowngrade > 0;

	availableUpsell && hasBeenRegistred && this.init();
});
