/**
 *
 * @fileOverview This is a product stock manager to performance page
 *
 */
'use strict';

Nitro.module('prodStock', [], function() {
	/*
	* This method get all .shelf__item current visibles and genereate stock values into each one
	*/
	this.buildProductStock = (callback) => {
		const $shelfsShowing = $('.shelfs__section .tabs__content .tabs__pane.is-active .shelf__item');

		let params = '?',
			currentProductsIDs = [],
			prodsWithStock = [];

		/* get productId from DOM to currentProductsIDs Array */
		$.each($shelfsShowing, (idx, el) => currentProductsIDs.push($(el).attr('data-idproduto')));

		/* Build ajax parameters */
		currentProductsIDs.forEach((el) => {
			params += `fq=productId:${el}&`;
		});

		let currentProdStock ;

		/* Ajax to get products from API*/
		this.getProdSearchAPI(params).then(res => {

			/* Iterates products */
			res.map(function(el) {
				currentProdStock = 0;

				/* Iterate Item skus */
				for (const item of el.items) {
					currentProdStock += item.sellers[0].commertialOffer.AvailableQuantity;
				}

				/* Add product objects to an array */
				prodsWithStock.push({
					productID: el.productId,
					stock: currentProdStock > 500 ? 500 : currentProdStock
				});
			});

			/* Render stock on products */
			for (const item of prodsWithStock) {
				$('.shelfs__section .tabs__content .tabs__pane.is-active [data-idproduto="'+ item.productID +'"] .shelf__stock')
					.addClass('loaded').html(`Últimos <span>${item.stock}</span> em estoque`);
			}

			callback && callback();
		});
	};

	/**
	 * Get product information using the VTEX Search API to render stock information on shelf elements
	 * @param {String} params a string with the products that will be searched on VTEX Search API
	 * @returns an array of objects with each product information
	 */
	this.getProdSearchAPI = (params) => {
		return $.ajax({
			'url': '/api/catalog_system/pub/products/search/' + params,
			'method': 'GET'
		}).then(res => {
			return res;
		});
	};
});
