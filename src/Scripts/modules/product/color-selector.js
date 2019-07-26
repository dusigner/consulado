/**
 *
 * @fileOverview Product color selector
 *
 */
'use strict';

import 'popper.js';
import 'bs/src/dropdown';
import 'modules/input-box';
import 'Dust/product/color-selector.html';

import { getProductVariety } from 'helpers/getProductVariety';

Nitro.module('color-selector', ['input-box'], function() {
	const $holder = $('.-js-product-color'),
		productReference = $('.productReference').text();

	this.build = (prodModels, condition) => {
		this.render(this.processItens(prodModels, condition));
	};

	this.processItens = (data, condition) => {
		return (
			data &&
			data
				.filter(function(product) {
					if (condition) {
						return product && product.Cor && product.Estado[0] === condition;
					} else {
						return product && product.Cor;
					}
				})
				.map(function(product) {
					return {
						name: product.Cor[0],
						productName: product.productName,
						style: $.replaceSpecialChars(product.Cor[0]),
						link: product.link,
						active: +product.productId === +window.skuJson.productId
					};
				})
		);
	};

	this.render = data => {
		if (data && data.length > 1) {
			data.colorsLength = data.length;
			dust.render('color-selector', { supermodels: data }, function(err, out) {
				if (err) {
					throw new Error('Supermodel Dust error: ' + err);
				}
				const itemActive = data.filter(obj => obj.active === true);
				$(window).trigger('color.selector.ready', [itemActive[0].name]);

				$holder.html(out).show();

				$('.input-box-dropdown-item').click(function(e) {
					e.preventDefault();
					const itemClicked = data.filter(item => item.link === $(this).attr('href'));

					$(window).trigger('color.selector.selected', [itemClicked[0]]);
				});
			});
		}
	};

	// Pega todos produtos que possuem os 6 primeiros catarcteres do modelo iguais ao modelo passado no parâmetro
	/**
	 * Get all products that includes the 6 first characters equal of the model inside the parameter
	 * @param {string} model the model code of the product to search similar products
	 * @returns an array of objects that contains data of similar products
	 */
	this.getProdVariety = model => getProductVariety(model).then(res => res);

	this.setup = () => {
		productReference &&
			productReference !== '' &&
			this.getProdVariety(productReference).then(res => {
				this.build(res);
			});

		$(window).on('color.selector.selected', (event, product) => {
			dataLayer &&
				dataLayer.push({
					event: 'generic',
					category: `[SQUAD] Botão Escolher cor: ${product.name} ${product.productName}`,
					action: 'Escolher cor do Produto ',
					label: 'Botão escolher cor do produto '
				});
		});
	};

	this.setup();
});
