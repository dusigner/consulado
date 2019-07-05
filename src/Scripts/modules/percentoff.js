/* global $: true, Nitro: true, _: true */
'use strict';

import promoDestaque from './_promo-destaque';
import setSKUselector from './listagem/buyButton';

Nitro.module('percentoff', 'buy-button', function() {

	this.init = function() {
		$('.box-produto:not(.list-percent)').each(function() {
			var self = $(this),
				valPercentage = self.data('percent'),
				txtPercentage = self.find('.off'),
				valProd = self.find('.por .val').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
				promoDiscountBoleto = {},
				promoDiscountCartao = {},
				percentage;
			promoDiscountBoleto.value = [0];
			promoDiscountCartao.value = [0];

			// Init Promo destaque - dias das mães
			promoDestaque(self);

			// Nova solução de troca de selos por promoções
			// A ideia é que o nome da promoção seja o mesmo
			// nome da imagem, Assim não teremos problemas com cache
			self.find('.FlagsHightLight .flag[class*="-selo-"]').each(function(i, e) {
				var elFlag = $(e);
				var flagName = elFlag.attr('class').replace('flag', '').trim();

				elFlag.css({
					'background-image'    : 'url(/arquivos/' + flagName + '.png)',
					'background-position' : 'center center',
					'background-repeat'   : 'no-repeat'
				});
			});

			self.find('.FlagsHightLight [class*="boleto"]').each(function(i, e) {
				var promoName = $(e).text();
				var promoValue = parseInt(promoName.match(/\d+/ig));
				if (!isNaN(promoValue) && promoValue > 0) {
					promoDiscountBoleto.value.push(promoValue);
				}
			});

			self.find('.FlagsHightLight [class*="cartao"]').each(function(i, e) {
				var promoName2 = $(e).text();
				var promoValue2 = parseInt(promoName2.match(/\d+/ig));
				if (!isNaN(promoValue2) && promoValue2 > 0) {
					promoDiscountCartao.value.push(promoValue2);
				}
			});

			var cmcDiscountBoleto = promoDiscountBoleto.value.reduce(function(prev, curr) {
				return prev + curr;
			});

			var cmcDiscountCartao = promoDiscountCartao.value.reduce(function(prev, curr) {
				return prev + curr;
			});

			if (valPercentage !== null && valPercentage !== 0) {
				percentage = Math.floor(parseFloat(valPercentage.replace(',', '.').replace(' ', '').replace('%', '')));
				if (percentage >= 20) {
					txtPercentage.text(percentage + '% OFF').show();
				}
			}

			// var total = parseFloat($(this).data('price').replace('R$ ', '').replace('.', '').replace(',', '.'));
			// $(this).find('span').text( $.formatNumber( total * (1 - discount) ) ).end().addClass('on');

			/**
			 * Se o desconto de cartão for maior ou igual que o desconto no boleto
			 * E se a loja for PF e não PJ
			 * Mostra o desconto de cartão
			 * Caso contrário, mostra o desconto do boleto
			 */
			if (cmcDiscountCartao >= cmcDiscountBoleto) {
				self.find('.discount-boleto')
					// .text('1x no cartão de crédito: R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountCartao / 100))));
					.html('R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountCartao / 100))) + ' <span>À vista</span>');
			}
			else {
				self.find('.discount-boleto')
					// .text('R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountBoleto / 100))) + ' à vista no boleto');
					.html('R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscountBoleto / 100))) + ' <span>À vista</span>');
			}

			if (cmcDiscountCartao || cmcDiscountBoleto) {
				self.addClass('product-has-5-off');
				self.find('.por .off').after(`
					<span class="product-with-5-off">
						+${cmcDiscountCartao >= cmcDiscountBoleto ? cmcDiscountCartao : cmcDiscountBoleto}
						% OFF à vista
					</span>
				`);
			}

			self.addClass('list-percent');
		});

		setSKUselector();
	};

	if (store && store.isPersonal) {
		this.init();
	}

});
