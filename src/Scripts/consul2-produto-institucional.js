/* global $: true, Nitro: true */
'use strict';

import { pushDataLayer } from 'modules/_datalayer-inline';
import 'modules/produto-institucional/benefits';
import 'modules/produto-institucional/produto-institucional';
import 'modules/produto-institucional/specifications';
import 'modules/produto-institucional/main-banner-datalayer';
import 'modules/produto-institucional/video-bem-pensado';
import 'modules/produto-institucional/characteristics-block';
import 'dataLayers/dataLayer-produto-institucional';
import 'modules/product/sku-fetch';
import 'modules/product/selos';
import 'modules/product/sku-select-v3';
import 'modules/product/voltage-modal';
import 'modules/product/boleto';
import 'modules/product/notify-me';
import 'modules/product/deliveryTime';
import 'modules/product/outline-products';

Nitro.controller(
	'produto-institucional',
	[
		'beneficios',
		'produto-institucional',
		'specifications',
		'main-banner-datalayer',
		'video-bem-pensado',
		'characteristics',
		'dataLayer-produto-institucional',
		'sku-fetch',
		'selos',
		'sku-select-v3',
		'voltage-modal',
		'boleto',
		'deliveryTime',
		'notify-me',
		'outline-products'
	],

	function () {
		const fixedBar = {
			init: function () {
				fixedBar.carouselMobile();
				fixedBar.anchor();
			},

			carouselMobile: function () {
				if ($(window).width() < 700) {
					$('.navigation-sticked-list').slick({
						arrows: false,
						dots: false,
						infinite: false,
						mobileFirst: true,
						slidesToScroll: 1,
						slidesToShow: 1,
						variableWidth: true,
						responsive: [{
							breakpoint: 300,
							settings: {
								slidesToScroll: 1,
								slidesToShow: 2,
							}
						}]
					});
				}
			},

			anchor: function () {
				$('.navigation-sticked-link[href^="#"]').on('click', function (e) {
					e.preventDefault();

					const label = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();

					$('.navigation-sticked-link').removeClass('active');
					$(this).addClass('active');

					let hash = $(this).attr('href'),
						targetOffset = $(hash).offset().top;

					$('html, body').animate({
						scrollTop: targetOffset - 56
					}, 500);

					pushDataLayer(
						'PDP_institucional',
						'barra_fixada',
						`${label}`
					);
				});

				$('.navigation-sticked-cta[href^="#"]').on('click', function (e) {
					e.preventDefault();

					let hash = $(this).attr('href'),
						targetOffset = $(hash).offset().top;

					$('html, body').animate({
						scrollTop: targetOffset - 56
					}, 500);

					pushDataLayer(
						'PDP_institucional',
						'barra_fixada',
						'clique_botao_eu_quero'
					);
				});
			},
		};

		(function (window, document, $) {
			$(function () {
				fixedBar.init();
			});
		})(window, document, jQuery);
	}
)

$(document).ready(function () {
	// Check if element is on the screen
	// Necessário para checagem de viability
	$.fn.isOnScreen = function (x, y) {
		if (x == null || typeof x == 'undefined') x = 1;
		if (y == null || typeof y == 'undefined') y = 1;

		var win = $(window);

		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var height = this.outerHeight();
		var width = this.outerWidth();

		if (!width || !height) {
			return false;
		}

		var bounds = this.offset();
		bounds.right = bounds.left + width;
		bounds.bottom = bounds.top + height;

		var visible = !(
			viewport.right < bounds.left ||
			viewport.left > bounds.right ||
			viewport.bottom < bounds.top ||
			viewport.top > bounds.bottom
		);

		if (!visible) {
			return false;
		}

		var deltas = {
			top: Math.min(1, (bounds.bottom - viewport.top) / height),
			bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
			left: Math.min(1, (bounds.right - viewport.left) / width),
			right: Math.min(1, (viewport.right - bounds.left) / width)
		};

		return (
			deltas.left * deltas.right >= x && deltas.top * deltas.bottom >= y
		);
	};
});

