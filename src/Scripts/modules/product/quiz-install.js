/* global $: true, Nitro: true */

'use strict';

Nitro.module('quiz-install', function() {
	var self = this;

	this.startQuiz = function() {
		$('.btn-quiz').on('click', function(e) {
			e.preventDefault();
			var nextSteep = $(this).attr('rel');
			$('#quiz-install .current').removeClass('current');
			$(nextSteep).addClass('current');
		});
	};

	this.restartQuiz = function() {
		$('.btn-voltar').on('click', function(e) {
			e.preventDefault();
			$('#quiz-install .current').removeClass('current');
			$('.quiz-intro.steep').addClass('current');
		});
	};

	this.buyQuizInstall = function() {
		$('.btn-quiz-comprar').on('click', function(e) {
			e.preventDefault();

			var buyButton = $('#BuyButton a.buy-button'),
				buyButtonLink = buyButton.attr('href'),
				modalBuyButton = $('#modal-sku .buy-button'),
				skuInstall = $(this).attr('rel');

			if ($('.skuselector-specification-label').hasClass('checked')) {
				$(location).attr('href', buyButtonLink + '&' + skuInstall);

				console.log('###########', buyButtonLink + '&' + skuInstall);
			} else {
				buyButton.trigger('click');

				$(window).on('skuSelected.vtex', function() {
					modalBuyButton.attr('href', modalBuyButton.attr('href') + '&' + skuInstall);
				});
			}
		});
	};

	this.setup = function() {
		self.startQuiz();
		self.restartQuiz();
		self.buyQuizInstall();
	};

	if ($('body').is('.quiz')) {
		self.setup();
	}
});
