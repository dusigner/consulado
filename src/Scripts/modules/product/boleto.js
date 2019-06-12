/* global $: true, Nitro: true, dust:true, _:true */
'use strict';

// require('Dust/price.html');

Nitro.module('boleto', function() {

	this.init = function() {
		var prodSelos = $('.prod-selos:first');
		var promoDiscountBoleto = {};
		var promoDiscountCartao = {};
		promoDiscountBoleto.value = [0];
		promoDiscountCartao.value = [0];

		// Nova solução de troca de selos por promoções
		// A ideia é que o nome da promoção seja o mesmo
		// nome da imagem, Assim não teremos problemas com cache
		prodSelos.find('.flag[class*="-selo-"]').each(function(i, e) {
			var elFlag = $(e);
			var flagName = elFlag.attr('class').replace('flag', '').trim();

			elFlag.css({
				'background-image'    : 'url(/arquivos/' + flagName + '.png)',
				'background-position' : 'center center',
				'background-repeat'   : 'no-repeat'
			});
		});

		prodSelos.find('[class*="boleto"]').each(function(i, e) {
			var promoName = $(e).text();
			var promoValue = parseInt(promoName.match(/\d+/ig));
			if (!isNaN(promoValue) && promoValue > 0) {
				promoDiscountBoleto.value.push(promoValue);
			}
		});

		prodSelos.find('[class*="cartao"]').each(function(i, e) {
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

		var priceCash = function(price, type) {
			if(type === 'boleto') {
				return _.intAsCurrency(price - (price * (cmcDiscountBoleto / 100)));
			} else {
				return _.intAsCurrency(price - (price * (cmcDiscountCartao / 100)));
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
				valPercentage = Math.floor((sku.listPrice - sku.bestPrice) / sku.listPrice * 100);

				if (valPercentage >= 20) {
					sku.valPercentage = valPercentage;
					if (cmcDiscountCartao >= cmcDiscountBoleto) {
						sku.cashPercentage = valPercentage + cmcDiscountCartao;
					}else {
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
							${priceCash(sku.bestPrice, 'cartao')} <span>À vista</span>
						</p>
					`;
				}
				else {
					// boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span></span><span class="gray">, por</span> ' + priceCash(sku.bestPrice, 'boleto') + '</p>';
					boletoInfo = `
						<p class="discount-boleto">
							${priceCash(sku.bestPrice, 'boleto')} <span>À vista</span>
						</p>
					`;
				}

				/*console.log('cmcDiscountCartao', cmcDiscountCartao);
				console.log('cmcDiscountBoleto', cmcDiscountBoleto);*/

				setTimeout(function() {
					$('.discount-boleto').remove();
					$('.product-with-5-off').remove();

					$('.valor-de.price-list-price').after(boletoInfo);

					if (cmcDiscountCartao || cmcDiscountBoleto) {
						$prodPreco.addClass('product-has-5-off');
						$prodPreco.find('.valor-por').before(`
							<span class="product-with-5-off">
								${cmcDiscountCartao >= cmcDiscountBoleto ? cmcDiscountCartao : cmcDiscountBoleto}% OFF
							</span>
						`);
					}
				}, 0);
			}
		});

		if (prodAvailable.length > 0) {
			var isDiscountOff,
				boletoInfo;
			/**
			* Se o desconto de cartão for maior ou igual que o desconto no boleto
			* E se a loja for PF e não PJ
			* Mostra o desconto de cartão
			* Caso contrário, mostra o desconto do boleto
			*/
			if (cmcDiscountCartao >= cmcDiscountBoleto) {
				isDiscountOff = (cmcDiscountCartao > 0) ? ' (' + cmcDiscountCartao + '% OFF)' : '';
				// boletoInfo = '<p class="discount-boleto"><span class="bloco">1x no cartão de crédito</span><span>' + isDiscountOff + '</span><span class="gray">, por</span> ' + priceCash(prodAvailable[0].bestPrice, 'cartao') + '</p>';
				boletoInfo = `
					<p class="discount-boleto">
						${priceCash(prodAvailable[0].bestPrice, 'cartao')} <span>À vista</span>
					</p>
				`;
			} else {
				isDiscountOff = (cmcDiscountBoleto > 0) ? ' (' + cmcDiscountBoleto + '% OFF)' : '';
				// boletoInfo = '<p class="discount-boleto"><span class="bloco"><span class="gray">ou</span> à vista no boleto</span><span>' + isDiscountOff + '</span><span class="gray">, por</span> ' + priceCash(prodAvailable[0].bestPrice, 'boleto') + '</p>';
				boletoInfo =  `
					<p class="discount-boleto">
						${priceCash(prodAvailable[0].bestPrice, 'boleto')} <span>À vista</span>
					</p>
				`;
			}

			if (cmcDiscountCartao || cmcDiscountBoleto) {
				$prodPreco.addClass('product-has-5-off');
				$prodPreco.find('.valor-por').before(`
					<span class="product-with-5-off">
						${cmcDiscountCartao >= cmcDiscountBoleto ? cmcDiscountCartao : cmcDiscountBoleto}% OFF
					</span>
				`);
			}

			/*console.log('cmcDiscountCartao', cmcDiscountCartao);
			console.log('cmcDiscountBoleto', cmcDiscountBoleto);*/
			$('.valor-de.price-list-price').after(boletoInfo);

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

	if( store && store.isPersonal ) {
		this.init();
	}
});
