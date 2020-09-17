'use strict';

import floatToCurrency from 'components/float-to-currency';

Nitro.module('outline-products', function () {
	var self = this

	this.init = function () {
		this.htmlProductsOutline();
		this.searchProductInfo();
		this.toggleDescriptionMobile();
		this.loadProducts();
	};

	this.htmlProductsOutline = () => {
		$('#BuyButton').after(`
		<div id="outlineProducts" class="outline-products">
			<h3 class="outline-products-changes--title is--mobile">Produto fora de linha</h3>
			<div class="outline-products-description">
				<p id="outlineProducts-description"></p>
				<p class="outline-products-description-text">
					Descrição do produto
					<span id="outlineProducts-description-mobile"></span>
				</p>
			</div>
			<div class="outline-products-changes">
				<h3 class="outline-products-changes--title is--desktop">Produto fora de linha</h3>
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
	};

	this.searchProductInfo = () => {
		var $product_id = skuJson_0.productId;

		var $sku = '';

		$.ajax({
			type: 'GET',
			async: true,
			url:
				`/api/catalog_system/pub/products/search?fq=productId:${$product_id}`,
			success: function (data) {
				if (data[0][`Produtos Substitutos`]) {
					// console.log(data[0]);

					$('body').addClass('product-outline-accept')



					$sku = data[0][`Produtos Substitutos`];

					var $skuChange = data[0][`O que mudou?`][0];
					var $skuChangeArray = $skuChange.split(',');

					var $skuDescription = data[0][`Mensagem: Descrição`][0];

					$('#outlineProducts .outline-products-description #outlineProducts-description').html($skuDescription);
					if ($(window).width() < 1024) {
						$('#outlineProducts .outline-products-description #outlineProducts-description-mobile').html($skuDescription);
					}

					$.each($skuChangeArray, function (key, value) {
						$('#outlineProducts .outline-products-changes-items').append(`<li><span>${value}</span></li>`);
					})
				} else {
					self.loadProducts();
				}
			}
		})

		setInterval(function () {
			if ($sku.length) {
				if (!$('body').hasClass('product-outline')) {
					$('body').addClass('product-outline')
					$.ajax({
						async: true,
						type: 'GET',
						url:
							`/api/catalog_system/pub/products/search?fq=skuId:${$sku}`,
						success: function (data) {
							var $data = data[0];
							if ($data.items[0].sellers[0].commertialOffer.Price > 0) {
								// console.log('foi');
								var $productName = $data.productTitle;
								var $productLink = $data.link;
								var $productReference = $data.productReference;
								var $productImage = $data.items[0].images[0].imageUrl;
								var $productPrice = floatToCurrency($data.items[0].sellers[0].commertialOffer.Price);
								var $productPriceOf = floatToCurrency($data.items[0].sellers[0].commertialOffer.ListPrice);
								var $productPriceBillet = floatToCurrency($data.items[0].sellers[0].commertialOffer.Price / 12);

								// console.log($productPrice, $productPriceOf, $productPriceBillet)

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
							} else {
								// console.log('foi2');
								var $productName2 = $data.productTitle;
								var $productLink2 = $data.link;
								var $productReference2 = $data.productReference;
								var $productImage2 = $data.items[1].images[0].imageUrl;
								var $productPrice2 = floatToCurrency($data.items[1].sellers[0].commertialOffer.Price);
								var $productPriceOf2 = floatToCurrency($data.items[1].sellers[0].commertialOffer.ListPrice);
								var $productPriceBillet2 = floatToCurrency($data.items[1].sellers[0].commertialOffer.Price / 12);

								// console.log($productPrice, $productPriceOf, $productPriceBillet)

								// image/link
								$('#outlineProducts-link').attr('href', $productLink2);
								$('#outlineProducts-image').attr('src', $productImage2);
								// name
								$('.outline-products-item-info--name').append(`
									<h2 id="outlineProducts-name">${$productName2}
									<span id="outlineProducts-reference">${$productReference2}</span>
									</h2>
								`);
								// price
								$('#outlineProducts-priceOf').html(`De ${$productPriceOf2}`);
								$('#outlineProducts-price').html(`Por ${$productPrice2}`);
								$('#outlineProducts-priceBillet').html(`ou ${$productPrice2} em até 12x de ${$productPriceBillet2} s/ juros`);
							}
						}
					})
				}
			}
		}, 100);
	}

	this.toggleDescriptionMobile = () => {
		if ($(window).width() < 1024) {
			$('body').on('click', '.outline-products-description-text', function () {
				$(this).toggleClass('is--active');
				$('#outlineProducts-description-mobile').toggleClass('is--active');
			})
		}
	}


	this.loadProducts = () => {
		$('.select.skuList.item-dimension-Voltagem input').on('change', function () {
			if ($(this).hasClass('item_unavaliable')) {
				$('body').removeClass('produto-disponivel');
				$('body').addClass('produto-indisponivel');

			}
			else {
				$('body').addClass('produto-disponivel');
				$('body').removeClass('produto-indisponivel');
			}
		});
		if (skuJson.available === true) {
			$('.secure').show();
			$('body').addClass('produto-disponivel');
		} else {
			if (!$('body').hasClass('product-outline-accept')) {
				$('body').addClass('produto-indisponivel');
				$('.portal-notify-me-ref .subtitle-page').html('Confira as opções de produtos similares ou seja avisado quando estifer disponível');
				$('.calc-frete').hide();
				$('.secure').hide();
				$('.cta-containers').hide();
				$('.prod-more-info').hide();
			}
		}

		if ($('.select-voltage .item-dimension-Voltagem span input').length >= 2) {
			$('.prod-sku-options').show();
			$('.select-color').hide();
		}

		// Esconder/Aparecer barra de preço e comprar em determinada posição da tela
		if ($(window).width() <= 1024) {

			if (!$('body').hasClass('produto-indisponivel')) {
				$('.product-info-bar').css('display', 'none');
				$(window).scroll(function (e) {
					e.preventDefault();
					var _pos = $(window).scrollTop();

					if ($('body').hasClass('produto-indisponivel') || (_pos >= ($('#BuyButton').offset().top + 32))) {
						$('.product-info-bar').addClass('formas-pagamento-is--active');

					} else {
						$('.product-info-bar').removeClass('formas-pagamento-is--active');
						$('.formas-pagamento-container').removeClass('is--active');
					}
				})
			}
		}
	}

	this.init();
});
