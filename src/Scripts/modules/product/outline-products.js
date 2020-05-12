'use strict';
Nitro.module('outline-products', function() {
	this.init = function() {
		var _product_id = skuJson_0.productId;

		$('#BuyButton').after(`
		<div id="outlineProducts" class="outline-products">
			<div class="outline-products-description"></div>
			<div class="outline-products-changes">
				<h3 class="outline-products-changes--title">Produto fora de linha</h3>
				<p class="outline-products-changes--text">Confira as opções de produtos similares.</p>
				<p class="outline-products-changes--sub">O que mudou:</p>
				<ul class="outline-products-changes-items"></ul>
			</div>
		</div>
		`);

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
					var _skuChange = data[0][`O que mudou?`][0];
					var _skuChangeArray = _skuChange.split(',');

					var _skuDescription = data[0][`Mensagem: Descrição`][0];

					$('#outlineProducts .outline-products-description').append(`<span>${_skuDescription}</span>`);

					$.each(_skuChangeArray, function(key, value) {
						$('#outlineProducts .outline-products-changes-items').append(`<li><span>${value}</span></li>`);
					})
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
