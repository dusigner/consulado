/* global $: true, Nitro: true, dust */
'use strict';

require('Dust/supermodel.html');

Nitro.module('supermodel', function() {

	var API_ENDPOINT = '/api/catalog_system/pub/products/search',
		$holder = $('.select-color'),
		supermodel = $('#caracteristicas .value-field.Nome-modelo-prateleira').text(),
		field = $holder.data('product-field');

	//console.log('supermodel', supermodel);

	if (!supermodel || supermodel === '') {
		return;
	}

	this.processItens = function(data) {

		return data && data.filter(function(product) {
			return product && product.Cor;
		}).map(function(product) {

			return {
				name: product.Cor[0],
				style: $.replaceSpecialChars(product.Cor[0]),
				link: product.link,
				active: +product.productId === +window.skuJson.productId
			};
		});

	};

	this.render = function(data) {

		dust.render('supermodel', {
			supermodels: data
		}, function(err, out) {
			if (err) {
				throw new Error('Supermodel Dust error: ' + err);
			}

			$holder.html(out).show();
		});
	};

	$.ajax({
		url: API_ENDPOINT,
		data: {
			fq: 'specificationFilter_' + field + ':' + supermodel.substr(0, 6) + '*'
		},
		dataType: 'json',
		localCache: true
	})
	.then(function(data) {
		return data && data.length > 1 ? data : [];
	})
	.then(this.processItens)
	.done(this.render);

});
