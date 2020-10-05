'use strict';

import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('specifications', function () {
	self.init = () => {
		self.selector();
		self.specs();
		self.dataLayerSpecsLinks();
		self.scrollUser();
	},

	// Função responsável por controlar o seletor das especificações do produto com caixa ou sem caixa.

	self.selector = () => {
		const elementSelector = $('.specs__measure-selector'),
			elementBox = $('.specs__measure-box h4');

		elementSelector.find('a:first').addClass('active');
		$(`.specs__measure-box h4[data-selector=${elementSelector.find('a:first').attr('data-selector')}]`).addClass('active');

		elementSelector.find('a').on('click', function () {
			elementSelector.find('a').removeClass('active');
			elementBox.removeClass('active');

			$(this).addClass('active');
			$(`.specs__measure-box h4[data-selector=${$(this).attr('data-selector')}]`).addClass('active');
		});
	},

	// Função responsável por controlar o efeito de exibir ou não as especificações do produto em dispositivos móveis.

	self.specs = () => {
		$('.specs__see-more__button').bind('click', function (e) {
			e.preventDefault();

			$('.specs__container').toggleClass('active');
			$('.specs__see-more').toggleClass('active');

			if ($('.specs__see-more').hasClass('active')) {
				$(this).addClass('see-less').html('Veja menos');
			} else {
				$(this).removeClass('see-less').html('Veja mais');

				let hash = $('.specs__see-more__button[href^="#"]').attr('href'),
					targetOffset = $(hash).offset().top;

				$('html, body').animate({
					scrollTop: targetOffset - 56
				}, 500);
			}
		});

	},

	self.dataLayerSpecsLinks = () => {
		$('.specs__links-content-element').on('click', function(e) {
			const label = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_institucional',
				'especificacoes_tecnicas',
				`download_${label}`
			);
		});
	}

	var counterms;

	self.userTime = () => {
		var countms = 0;
		var val = 0;

		counterms = setInterval(function () {
			countms = countms + 1 / 100;
			if (countms >= 1) {
				if (val === 0) {
					val += 1;
					pushDataLayer(
						'PDP_institucional',
						'especificacoes_tecnicas',
						`viability_especificacoes_1_segundo`
					);
				}
			}
			if (countms >= 4) {
				if (val === 1) {
					val += 1;
					pushDataLayer(
						'PDP_institucional',
						'especificacoes_tecnicas',
						`viability_especificacoes_4_segundos`
					);
				}
			}
			if (countms >= 10) {
				if (val === 2) {
					val += 1;
					pushDataLayer(
						'PDP_institucional',
						'especificacoes_tecnicas',
						`viability_especificacoes_10_segundos`
					);
					clearInterval(counterms);
				}
			}
		}, 10);
	}

	self.scrollUser = () => {
		let isActive = true;

		$(window).scroll(function (event) {
			var $scroll = $(window).scrollTop();
			var $scrollSpecification = $('#specifications-lp').offset().top;

			if ($scroll > $scrollSpecification - 600) {
				if (!$('body').hasClass('is--scroll')) {
					isActive = false;
					$('body').addClass('is--scroll');
					self.userTime();
				}
			} else {
				$('body').removeClass('is--scroll');
				isActive = true;
				clearInterval(counterms);
			}
		});
	}

	self.init();
})
