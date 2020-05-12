'use strict';
Nitro.module('outlineProducts', function() {
	this.init = function() {
		var _product_id = skuJson_0.productId;
		alert('t caueeeesteee');
		var _sku = '';
		$.ajax({
			type: 'GET',
			async: true,
			url:
            `/api/catalog_system/pub/products/search?fq=productId:${_product_id}`,
			success: function (data) {
				if ( data[0][`Produtos Substitutos`] ) {
					console.log(data[0]);
					_sku = data[0][`Produtos Substitutos`];
					var _skuChange = data[0][`O que mudou?`][0]
					var _skuChangeArray = _skuChange.split(',');
					$.each(_skuChangeArray, function(key, value) {
						$('#relacionados-top .relacionados-title')
							.append(`<span>${value}</span>`)
					})
					console.log(_sku, _skuChangeArray);
				}
			}
		})
		setInterval(function () {
			if ( _sku.length) {
				if ( !$('body').hasClass('is--product') ) {
					$('body').addClass('is--product')
					$.ajax({
						async: true,
						type: 'GET',
						url:
                        `/api/catalog_system/pub/products/search?fq=skuId:${_sku}`,
						success: function (data) {
							console.log(data);
							var _name = data[0].productName;
							$('#relacionados-top .relacionados-title').append(`<span>nomee: ${_name}</span>`);
						}
					})
				}
			}
		}, 100);
	};
	this.init();
});
