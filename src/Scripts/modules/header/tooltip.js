/* global $: true, Nitro: true */
'use strict';

require('Dust/header/mobile-banner.html');
require('Dust/header/tooltip.html');

Nitro.module('tooltip', function() {
	let self = this,
		mobileBanner = $('.home, .listagem:not(.smartbeer2)').find('.menu-mobile .menu-department'),
		desktopTooltip = $('.home, .listagem:not(.smartbeer2)').find('.top-navigation .item-cervejeira');

	this.init = () => {
		self.renderBanner();
		self.renderTooltip();
		self.createTag();
		self.showTooltip();
	};

	this.renderBanner = () => {
		let data = {
			upperText: 'Cerveja beeem gelada é na cervejeira Consul',
			bottomText: 'Conheça nossa linha completa'
		};

		dust.render('mobile-banner', data, function(err, out) {
			if (err) {
				throw new Error('Dust error: ' + err);
			}

			mobileBanner.prepend(out);
		});
	};

	this.renderTooltip = () => {
		let data = {
			upperText: 'Cerveja beeem gelada é na cervejeira Consul',
			bottomText: 'Conheça nossa linha completa'
		};

		dust.render('tooltip', data, function(err, out) {
			if (err) {
				throw new Error('Dust error: ' + err);
			}

			desktopTooltip.append(out);
		});
	};

	this.createTag = () => {
		let highLight = $('.home .tooltip, .listagem:not(.smartbeer2) .tooltip'),
			highLightMobile = $('.item-banner .tooltip-banner');

		let setTag = selector => {
			selector.find('a').on('click', () => {
				dataLayer.push({
					event: 'generic',
					category: '[SQUAD] Cervejeira - Conheça nossa linha completa',
					action: 'Clique Categoria Cervejeira',
					label: 'Conheça nossa linha completa'
				});
			});
		};

		setTag(highLight);
		setTag(highLightMobile);
	};

	this.showTooltip = () => {
		let highLight = $('.home .tooltip, .listagem:not(.smartbeer2) .tooltip');
		highLight.fadeIn(function() {
			setTimeout(() => {
				highLight.fadeOut(function() {});
			}, 15000);
		});
	};

	self.init();
});
