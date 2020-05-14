'use strict';

import floatToCurrency from 'components/float-to-currency';

Nitro.module('outline-products', function() {
	this.init = function() {
		var $product_id = skuJson_0.productId;

		$('#BuyButton').after(`
		<div id="outlineProducts" class="outline-products">
			<div class="outline-products-description">
				<p id="outlineProducts-description"></p>
			</div>
			<div class="outline-products-changes">
				<h3 class="outline-products-changes--title">Produto fora de linha</h3>
				<p class="outline-products-changes--text">Confira as opções de produtos similares.</p>
				<p class="outline-products-changes--sub">O que mudou:</p>
				<ul class="outline-products-changes-items"></ul>
			</div>
			<a class="outline-products-item" id="outlineProducts-link" href="">
				<div class="outline-products-item-image">
					<img id="outlineProducts-image" src="" alt="product">
				</div>
				<div class="outline-products-item-info">
					<div class="outline-products-item-info--name">

					</div>
					<div class="outline-products-item-info--price">
						<h3 id="outlineProducts-priceOf"></h3>
						<h3 id="outlineProducts-price"></h3>
					</div>
					<div class="outline-products-item-info--priceBillet">
						<h3 id="outlineProducts-priceBillet"></h3>
					</div>
				</div>
			</a>
		</div>
		`);

		var $sku = '';

		$.ajax({
			type: 'GET',
			async: true,
			url:
            `/api/catalog_system/pub/products/search?fq=productId:${$product_id}`,
			success: function (data) {
				if ( data[0][`Produtos Substitutos`] ) {
					console.log(data[0]);

					$('body').addClass('product-outline-accept')

					$sku = data[0][`Produtos Substitutos`];
					var $skuChange = data[0][`O que mudou?`][0];
					var $skuChangeArray = $skuChange.split(',');

					var $skuDescription = data[0][`Mensagem: Descrição`][0];

					$('#outlineProducts .outline-products-description #outlineProducts-description').html($skuDescription);

					$.each($skuChangeArray, function(key, value) {
						$('#outlineProducts .outline-products-changes-items').append(`<li><span>${value}</span></li>`);
					})
				}
			}
		})
		setInterval(function () {
			if ( $sku.length) {
				if ( !$('body').hasClass('product-outline') ) {
					$('body').addClass('product-outline')
					$.ajax({
						async: true,
						type: 'GET',
						url:
                        `/api/catalog_system/pub/products/search?fq=skuId:${$sku}`,
						success: function (data) {
							var $data = data[0];

							console.log(data);
							var $productName = $data.productTitle;
							var $productLink = $data.link;
							var $productReference = $data.productReference;
							var $productImage = $data.items[0].images[0].imageUrl;
							var $productPrice = floatToCurrency($data.items[0].sellers[0].commertialOffer.Price);
							var $productPriceOf = floatToCurrency($data.items[0].sellers[0].commertialOffer.ListPrice);
							var $productPriceBillet = floatToCurrency($data.items[0].sellers[0].commertialOffer.Price / 12);

							console.log($productPrice, $productPriceOf, $productPriceBillet)

							// image/link
							$('#outlineProducts-link').attr('href', $productLink);
							$('#outlineProducts-image').attr('src', $productImage);
							// name
							$('.outline-products-item-info--name').append(`
								<h2 id="outlineProducts-name">${$productName}
								<span id="outlineProducts-reference">${$productReference}</span>
								</h2>
							`);
							// price
							$('#outlineProducts-priceOf').html(`De ${$productPriceOf}`);
							$('#outlineProducts-price').html(`Por ${$productPrice}`);
							$('#outlineProducts-priceBillet').html(`ou ${$productPrice} em até 12x de ${$productPriceBillet} s/ juros`);
						}
					})
				}
			}
		}, 100);
	};
	this.init();
});
