'use strict';

require('./../../../templates/quick-view/products-list.html');
require('./../../../templates/quick-view/product-description.html');
require('./../../../templates/quick-view/product-image.html');
require('./../../../templates/quick-view/product-modules.html');
require('./../../../templates/quick-view/product-skus.html');
require('./../../../templates/quick-view/product-table-dimention.html');

require('./logic-view');

Nitro.module('integration-view',  function () {
	var app = this,
		objectProduct = [],
		dfd = jQuery.Deferred();

	app.init = function (button) {
		app.loadProductsList(button);
		app.getProductList()
			.then(function(){
				app.loadProductImage();
				app.loadProductSku();
				app.loadProductDescription();
				app.loadProductModules();
				app.loadProductTableDimention();

				return;
			})
			.then(function() {
				dfd.resolve();
			});

		return dfd.promise();
	};

	app.getProductList = function () {
		var list = $('.combos-product-list__item'),
			dfd = jQuery.Deferred();

		objectProduct = [];

		var promises = list.map(function (index) {
			return app.getProductById($(this).attr('data-idproduto'))
				.then(function(result) {
					objectProduct[index] = result;
					return result;
				});
		});


		//"promiseAll"
		$.when.apply($, promises)
			.always(function() {
				dfd.resolve(objectProduct);
			});

		return dfd.promise();
		// console.log(objectProduct);
	};

	app.getProductById = function (productId) {
		var urlOrigin = window.origin || window.location.origin,
			apiUrl = urlOrigin + '/api/catalog_system/pub/products/search?fq=productId:' + productId;

		return $.ajax({
			'url': apiUrl,
			'type': 'GET'
		}).then(function (data) {
			return data[0];
		}).fail(function (data) {
			return data;
		});
	};

	// app.getSkuById = function (skuId) {
	// 	var response;

	// 	return response;
	// };

	app.addProductsList = function (data) {
		dust.render('products-list', data, function (err, out) {
			if (err) {
				throw new Error('Lista de produtos Quick View Dust error: ' + err);
			}

			$('.combos-product-list__items').html(out);
		});
	};

	app.loadProductsList = function (button) {
		var tabs = $('.combos-product-list__item'),
			arrayListProductsImage = app.getProductsList(button),
			objectListProductsImage = {};

		objectListProductsImage = {
			productListItem: arrayListProductsImage
		};

		app.addProductsList(objectListProductsImage);

		tabs.removeClass('combos-product-list__item--active');
		$($('.combos-product-list__item').get(0)).addClass('combos-product-list__item--active');
	};

	app.getProductsList = function (button) {
		var productsImage = $(button).closest('.combos-prateleira').find('.combo-product__link > img'),
			arrayListProductsImage = [];

		productsImage.map(function () {
			arrayListProductsImage.push({
				imageUrl: $(this).attr('src'),
				idproduto: $(this).closest('.combos-prateleira__product-item').attr('data-idproduto'),
				classInactive: $(this).closest('.combos-prateleira__product-item').hasClass('combo-product--inactive') ? 'combos-product-list__item--inactive' : ''
			});
		});

		return arrayListProductsImage;
	};

	app.addProductImage = function (data, indice) {
		dust.render('product-image', data, function (err, out) {
			if (err) {
				throw new Error('Imagem produto Quick View Dust error: ' + err);
			}
			// $($('.product-quick-view__thumbs').get(indice)).html(out);
			$($('.product-quick-view__image').get(indice)).html(out);
		});
	};

	app.loadProductImage = function () {
		var objectProductImage = {},
			arrayProductImage = [];

		objectProduct.map(function (product, indice) {
			arrayProductImage = app.getProductImage(product.items[0].images);

			objectProductImage = {
				productImage: arrayProductImage
			};

			app.addProductImage(objectProductImage, indice);
		});
	};

	app.getProductImage = function (images) {
		var arrayProductImage = [];

		images.map(function (value) {
			arrayProductImage.push({
				imageUrl: value.imageUrl,
				imageText: value.imageText
			});
		});

		return arrayProductImage;
	};

	app.addProductSku = function (data, indice) {
		dust.render('product-skus', data, function (err, out) {
			if (err) {
				throw new Error('Sku produto Quick View Dust error: ' + err);
			}

			$($('.product-quick-view .sku-quick-view-options').get(indice)).html(out);
			$($('.sku-quick-view-options--select-voltage').get(indice)).html(out);

		});
	};

	app.actionSku = function () {
		$('.sku-quick-view-options > label').on('click', function () {
			var itemId = $(this).attr('data-itemid');

			$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').closest('.sku-quick-view-options').find('label').removeClass('sku-quick-view-options__checked');
			$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').addClass('sku-quick-view-options__checked');
			$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').closest('.table-line').addClass('table-line--ok');
		});
	};

	app.loadProductSku = function () {
		var objectProductSku = {},
			arrayProductSku = [];

		objectProduct.map(function (product, indice) {

			vtexjs.catalog.getProductWithVariations(product.productId).done(function(product){
				arrayProductSku = app.getProductSku(product.skus);
				objectProductSku = {
					productSku: arrayProductSku
				};
				app.addProductSku(objectProductSku, indice);
				app.actionSku();
			});

		});
	};

	app.getProductSku = function (items) {
		var arrayProductSku = [];

		items.map(function (value) {
			var resObj = {
				itemid: value.sku,
				Voltagem: value.dimensions.Voltagem,
				seller: value.sellerId
			};

			//Flagando sku inativo no layout
			if(!value.available) {
				$.extend(resObj, {isUnavailable: true});
				$.extend(resObj, {isUnavailable: true});
			}

			arrayProductSku.push(resObj);
		});

		//Coloca outra voltagem sem estoque caso exista só uma no cadastro 👌👌👌
		if(arrayProductSku.length === 1 && /^110|^220/.test(arrayProductSku[0].Voltagem)) {
			var singleSku = arrayProductSku[0],
				resObj = {
					itemid: singleSku.sku,
					seller: singleSku.sellerId,
					Voltagem: null,
					isUnavailable: true
				};

			if(/^110/.test(singleSku.Voltagem)) {
				resObj.Voltagem = '220V';
			} else if(/^220/.test(singleSku.Voltagem)) {
				resObj.Voltagem = '110V';
			}

			arrayProductSku.push(resObj);
		}

		return arrayProductSku;
	};

	app.addProductModules = function(data, indice) {
		dust.render('product-modules', data, function(err, out) {
			if (err) {
				throw new Error('Módulos produto Quick View Dust error: ' + err);
			}

			$($('.quick-view-modules').get(indice)).html(out);
		});
	};

	app.loadProductModules = function () {
		var objectProductModules = {},
			arrayProductModules = [];

		objectProduct.map(function (product, indice) {
			if (product['Caracteristícas Técnicas']) {
				arrayProductModules = app.getProductModules(product);

				objectProductModules = {
					productModules: arrayProductModules
				};

				app.addProductModules(objectProductModules, indice);
			}
		});
	};

	app.getProductModules = function (product) {
		var arrayProductModules = [],
			modulesTitle = ['Título modulo 01', 'Título modulo 02', 'Título modulo 03', 'Título modulo 04', 'Título modulo 05'],
			modulesText = ['Texto modulo 01', 'Texto modulo 02', 'Texto modulo 03', 'Texto modulo 04',  'Texto modulo 05'];

		modulesTitle.map(function(value, indice) {
			try {
				arrayProductModules.push({
					title: product[value][0],
					text: product[modulesText[indice]][0]
				});

			} catch(Error) {
				// console.log(Error);
			}
		});

		return arrayProductModules;
	};

	app.addProductTableDimention = function(data, indice) {

		dust.render('product-table-dimention', data, function(err, out) {
			if (err) {
				throw new Error('Table dimention Quick View Dust error: ' + err);
			}

			$($('.quick-view-table-dimention').get(indice)).html(out);
		});
	};

	app.loadProductTableDimention = function () {
		var objectProductTableDimention = {},
			dimentation = {};

		objectProduct.map(function (product, indice) {
			try {
				vtexjs.catalog.getProductWithVariations(product.productId).done(function(product){
					dimentation = product.skus[0].measures;

					objectProductTableDimention.width = dimentation.width;
					objectProductTableDimention.height = dimentation.height;
					objectProductTableDimention.length = dimentation.length;
					objectProductTableDimention.weight = dimentation.weight;

					app.addProductTableDimention(objectProductTableDimention, indice);
				});
			} catch (Error) {
				// console.log(Error);
			}
		});
	};

	app.addProductDescription = function (data, indice) {
		dust.render('product-description', data, function (err, out) {
			if (err) {
				throw new Error('Descrição produto Quick View Dust error: ' + err);
			}

			$($('.quick-view-table-specification').get(indice)).html(out);
		});
	};

	app.loadProductDescription = function () {
		var objectProductDescription = {},
			arrayProductDescription = [];

		objectProduct.map(function (product, indice) {
			if (product['Caracteristícas Técnicas']) {
				arrayProductDescription = app.getProductDescription(product['Caracteristícas Técnicas'], product);

				objectProductDescription = {
					productDescription: arrayProductDescription
				};

				app.addProductDescription(objectProductDescription, indice);
			}
		});
	};

	app.getProductDescription = function (specificationName, product) {
		var arrayProductDescription = [];

		specificationName.map(function (value) {
			if (product[value][0]) {
				arrayProductDescription.push({
					title: value,
					text: product[value][0]
				});
			}
		});

		return arrayProductDescription;
	};
});
