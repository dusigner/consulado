/* global $: true, Nitro: true, dust:true, _:true */
'use strict';

// require('Dust/price.html');

import dynamicStamps from '../_dynamic-stamps';

Nitro.module('boleto', function() {
	this.init = function() {
		var prodSelos = $('.prod-selos:first');
		var promoDiscountBoleto = {};
		var promoDiscountCartao = {};
		promoDiscountBoleto.value = [0];
		promoDiscountCartao.value = [0];

		// Nova solução de troca de selos por promoções
		dynamicStamps(prodSelos, '.flag[class*="-selo-"]');

		prodSelos.find('[class*="boleto"]').each(function(i, e) {
			var promoName = $(e).text();
			var promoValue = parseInt(promoName.match(/\d+/gi));
			if (!isNaN(promoValue) && promoValue > 0) {
				promoDiscountBoleto.value.push(promoValue);
			}
		});

		prodSelos.find('[class*="cartao"]').each(function(i, e) {
			var promoName2 = $(e).text();
			var promoValue2 = parseInt(promoName2.match(/\d+/gi));
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

		var priceCash = function(price, type) {
			if (type === 'boleto') {
				return _.intAsCurrency(price - price * (cmcDiscountBoleto / 100));
			} else {
				return _.intAsCurrency(price - price * (cmcDiscountCartao / 100));
			}
		};

		var appendOff = function(el, value) {
			el.after('<span class="tag"> ' + value + '% OFF</span>');
		};

		//create helper function for price template
		dust.filters.priceCash = priceCash;

		//% OFF TEXTO PREÇO
		var $prodPreco = $('.prod-preco'),
			prodAvailable = $.grep(window.skuJson.skus, function(n) {
				return n.available;
			}),
			valPercentage;

		$.each(window.skuJson.skus, function(i, sku) {
			sku.valPercentage = sku.cashPercentage = false;

			if (sku.available && sku.listPrice > sku.bestPrice) {
				valPercentage = Math.floor(((sku.listPrice - sku.bestPrice) / sku.listPrice) * 100);

				if (valPercentage >= 20) {
					sku.valPercentage = valPercentage;
					if (cmcDiscountCartao >= cmcDiscountBoleto) {
						sku.cashPercentage = valPercentage + cmcDiscountCartao;
					} else {
						sku.cashPercentage = valPercentage + cmcDiscountBoleto;
					}
				}
			}
		});

		if ($prodPreco.find('.valor-de').length > 0 && prodAvailable[0].valPercentage >= 20) {
			appendOff($('.prod-galeria'), prodAvailable[0].valPercentage);
		}

		// A VISTA NO BOLETO
		$('.discount-boleto, .skuPrice').remove();

		$(document).on('skuSelected.vtex', function(e, productId, sku) {
			$('.discount-boleto, .skuPrice').remove();

			if (sku.available) {
				var boletoInfo;
				/**
				 * Se o desconto de cartão for maior ou igual que o desconto no boleto
				 * E se a loja for PF e não PJ
				 * Mostra o desconto de cartão
				 * Caso contrário, mostra o desconto do boleto
				 */
				if (cmcDiscountCartao >= cmcDiscountBoleto) {
					// boletoInfo = '<p class="discount-boleto"><span class="bloco">1x no cartão de crédito</span><span></span><span class="gray">, por</span> ' + priceCash(sku.bestPrice, 'cartao') + '</p>';
					boletoInfo = `
						<p class="discount-boleto">
							À vista por <strong>${priceCash(sku.bestPrice, 'cartao')}</strong> <span>(${cmcDiscountCartao}% desconto)</span>
						</p>
					`;
				} else {
					// boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span></span><span class="gray">, por</span> ' + priceCash(sku.bestPrice, 'boleto') + '</p>';
					boletoInfo = `
						<p class="discount-boleto">
							À vista por <strong>${priceCash(sku.bestPrice, 'boleto')}</strong> <span>(${cmcDiscountBoleto}% desconto)</span>
						</p>
					`;
				}

				// Etiqueta que exibe a porcentagem do desconto
				setTimeout(function() {
					$('.discount-boleto').remove();
					$('.product-with-discount').remove();

					$('.valor-por.price-best-price').after(boletoInfo);

					if (cmcDiscountCartao || cmcDiscountBoleto) {
						$prodPreco.addClass('product-has-discount');

						// $prodPreco.find('.valor-por').after(`
						// 	<span class="product-with-discount">
						// 		${cmcDiscountCartao >= cmcDiscountBoleto ? cmcDiscountCartao : cmcDiscountBoleto}% OFF
						// 	</span>
						// `);
					}
				}, 0);
			}
		});

		if (prodAvailable.length > 0) {
			//var isDiscountOff;
			var boletoInfo;
			/**
			 * Se o desconto de cartão for maior ou igual que o desconto no boleto
			 * E se a loja for PF e não PJ
			 * Mostra o desconto de cartão
			 * Caso contrário, mostra o desconto do boleto
			 */
			if (cmcDiscountCartao >= cmcDiscountBoleto) {
				//isDiscountOff = cmcDiscountCartao > 0 ? ' (' + cmcDiscountCartao + '% OFF)' : '';
				// boletoInfo = '<p class="discount-boleto"><span class="bloco">1x no cartão de crédito</span><span>' + isDiscountOff + '</span><span class="gray">, por</span> ' + priceCash(prodAvailable[0].bestPrice, 'cartao') + '</p>';
				boletoInfo = `
					<p class="discount-boleto">
						À vista por <strong>${priceCash(prodAvailable[0].bestPrice, 'cartao')}</strong> <span>(${cmcDiscountCartao}% desconto)</span>
					</p>
				`;
			} else {
				//isDiscountOff = cmcDiscountBoleto > 0 ? ' (' + cmcDiscountBoleto + '% OFF)' : '';
				// boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span>' + isDiscountOff + '</span><span class="gray">, por</span> ' + priceCash(prodAvailable[0].bestPrice, 'boleto') + '</p>';
				boletoInfo = `
					<p class="discount-boleto">
						À vista por <strong>${priceCash(prodAvailable[0].bestPrice, 'boleto')}</strong> <span>(${cmcDiscountBoleto}% desconto)</span>
					</p>
				`;
			}

			// Etiqueta que exibe a porcentagem do desconto
			if (cmcDiscountCartao || cmcDiscountBoleto) {
				$prodPreco.addClass('product-has-discount');

				// setTimeout(() => {
				// 	$prodPreco.find('.valor-por').after(`
				// 		<span class="product-with-discount">
				// 			${cmcDiscountCartao >= cmcDiscountBoleto ? cmcDiscountCartao : cmcDiscountBoleto}% OFF
				// 		</span>
				// 	`);
				// }, 100);
			}

			$('.valor-por.price-best-price').after(boletoInfo);

			/*
			 * oh yeah, vtex hack!
			 * template price.html has more variables, but price plugin doesn't
			 * get data from global sku, so this overhide the plugin function.
			 */
			var price = $('.plugin-preco').data('price');

			if (price) {
				var getSku = price.getSku;

				price.getSku = function() {
					var sku = getSku();

					sku.valPercentage = prodAvailable[0].valPercentage;
					sku.cashPercentage = prodAvailable[0].cashPercentage;

					return sku;
				};
			}
		}
	};

	if (store && store.isPersonal) {
		this.init();
	}
});
