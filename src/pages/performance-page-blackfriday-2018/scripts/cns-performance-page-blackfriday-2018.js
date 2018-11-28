/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Consul Black Friday 2018
 *
 */
'use strict';

import 'vendors/nitro';

import './modules/tabs';
import './modules/shelfs';
import './modules/counter';
import './modules/prodStock';
import './modules/fast-buy';

Nitro.setup(['prodStock', 'tabs', 'shelfs', 'counter', 'fast-buy'], function(prodStock) {
	this.init = () => {
		prodStock.buildProductStock();
		this.tag();
	};

	this.tag = () => {
		$('.offers__section .offers__item').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: $(this).text()
			});
		});

		$('.counter__offer').find('a').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: $(this).parents('.shelf__item').find('.shelf__title').text()
			});
		});
		
		$('.shelfs__section .tabs__nav-item').find('a').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: $(this).text()
			});
		});

		$('.shelfs__section .shelf__image').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: ($(this).attr('title') + ' | Imagem')
			});
		});

		$('.shelfs__section .shelf__buy-fast').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: ($(this).siblings('.shelf__title').text() + ' | Compra rápida')
			});
		});

		$('.shelfs__section .shelf__buy-button').on('click', function() {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: ($(this).siblings('.shelf__title').text() + ' | Ver produto')
			});
		});

		$('.shelfs__disclaimer-btn').on('click', function() { 
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Home',
				action: 'Black Friday ',
				label: $(this).text()
			});
		});
	};

	this.init();
});
