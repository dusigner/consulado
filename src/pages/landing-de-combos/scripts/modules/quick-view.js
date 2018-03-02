'use strict';

require('vendors/jquery.cookie');
require('vendors/slick');
require('bootstrap/tooltip');

require('./../../templates/quick-view/products-list.html');
require('./../../templates/quick-view/product-description.html');
require('./../../templates/quick-view/product-image.html');
require('./../../templates/quick-view/product-modules.html');
require('./../../templates/quick-view/product-skus.html');

Nitro.module('quick-view', function () {
	var self = this,
		logicView,
		appLogicView,
		// integrationView,
		appIntegrationView,
		appSelectVoltage,
		selectVoltage;

	self.init = function () {
		logicView = new appLogicView();
		// integrationView = new appIntegrationView();
		selectVoltage = new appSelectVoltage();
	};

	appLogicView = function () {
		var app = this,
			buttonStepOne = $('.combos-prateleira .combos-finalization__button'),
			shelfContainer = $('.prateleira-combos');
			// idProducts = [],
			// productsObjects = [],
			// actionSku;

		app.init = function () {
			app.addShelfCounter();
			app.actionCombos();
			app.actionCloseQuikView();
			app.actionProductCombos();
		};

		app.actionCombos = function () {
			buttonStepOne.on('click', function() {
				var integrationView = new appIntegrationView(),
					quantityInactive = $(this).closest('.combos-prateleira').find('.combo-product--inactive').length,
					combosFinalization = $(this).closest('.combos-finalization'),
					indice = app.getIndiceCombo(combosFinalization);

				$(this).addClass('loading');

				if (quantityInactive <= 4) {
					app.initProduct();

					integrationView.init(this)
						.then(function() {
							$('.combos-finalization__button').removeClass('loading');
							// app.getProducts(this);
							app.actionTabProduct();
							app.toggleModalCombos();
							app.addSlickProductImage(0);
							app.loadCombosFinalization(indice);
							app.loadGeneralInformation(this);
							app.loadAccordionMobile();
							selectVoltage.init();

							// fake click para "contar" o primeiro como removido TODO: forma de ja vir considerado
							$('.combos-product-list__item:first').click();
						}.bind(this));
				}
			});
		};

		app.actionProductCombos = function() {
			$('.combo-product__link').on('click', function(e) {
				e.preventDefault();
			});

			$('.combo-product__title, .combo-product__link > img').on('click', function() {
				var self = $(this),
					integrationView = new appIntegrationView(),
					quantityInactive = $(this).closest('.combos-prateleira').find('.combo-product--inactive').length,
					combosFinalization = $(this).closest('.combos-finalization'),
					indice = app.getIndiceCombo(combosFinalization);

				self.closest('li').addClass('loading');

				if (quantityInactive <= 4) {
					app.initProduct();

					integrationView.init(this)
						.then(function() {
							app.actionTabProduct();
							app.toggleModalCombos();
							app.addSlickProductImage(0);
							app.loadCombosFinalization(indice);
							app.loadGeneralInformation(this);
							app.loadAccordionMobile();
							selectVoltage.init();

							$('.combos-product-list__item:nth-child('+ self.closest('li').attr('data-counter') +')').click();
						}.bind(this));
				}
			});
		};

		app.actionCloseQuikView = function() {
			$('.modal-quick-view__button-close').on('click', function () {
				app.toggleModalCombos();
				app.removeLoadingState();
				$('.product-quick-view__image').removeClass('slick-initialized slick-slider');
				$('body, html').removeClass('modal-quick-view__visible');
			});

			if ($(window).width() <= 768) {
				$('.combos-quick-view__title').on('click', function () {
					app.toggleModalCombos();
					app.removeLoadingState();
					$('.product-quick-view__image').removeClass('slick-initialized slick-slider');
					$('body, html').removeClass('modal-quick-view__visible');
				});
			}
		};

		app.actionSku = function() {
			$('.sku-quick-view-options > label').on('click', function () {
				var itemId = $(this).attr('data-itemid');

				$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').closest('.sku-quick-view-options').find('label').removeClass('sku-quick-view-options__checked');
				$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').addClass('sku-quick-view-options__checked');
				$('.sku-quick-view-options').find('[data-itemid=' + itemId + ']:not(.sku-quick-view__unavailable)').closest('.table-line').addClass('table-line--ok');
			});

			$('.sku-quick-view-options').each(function() {
				var skuList = $(this);
				var skuLabel = skuList.find('label');

				if (skuLabel.hasClass('sku-quick-view__unavailable') && skuLabel.length > 1) {
					skuLabel.not('.sku-quick-view__unavailable').click();
				}

				if (skuLabel.length === 1 && skuLabel.text() === 'Bivolt') {
					skuLabel.click();
				}
			});
		};

		app.actionTabProduct = function() {
			var tabs = $('.combos-product-list__item');

			tabs.on('click', function () {
				app.activeProduct(this);
				app.addTooltipProductInactive(this);
			});
		};

		app.activeProduct = function(product) {
			var tabs = $('.combos-product-list__item'),
				indice = app.getIndiceProduct(product);

			tabs.removeClass('combos-product-list__item--active');
			$(product).addClass('combos-product-list__item--active');
			$('.product-quick-view').removeClass('product-quick-view--active');
			$($('.product-quick-view').get(indice)).addClass('product-quick-view--active');
			app.addSlickProductImage(indice);
		};

		app.addShelfCounter = function() {
			shelfContainer.each(function() {
				$(this).find('li').each(function(index) {
					$(this).attr('data-counter', index + 1);
				});
			});
		};

		app.initProduct = function() {
			$('body, html').addClass('modal-quick-view__visible');
			$('.product-quick-view__item').removeClass('product-quick-view--active');
			$($('.product-quick-view__item').get(0)).addClass('product-quick-view--active');

			if ($('.modal-quick-view').hasClass('modal-quick-view--select-voltage')) {
				selectVoltage.toggleSelectVoltagem();
			}

			$('.table-line').removeClass('table-line--ok');
			$('.sku-quick-view-options__checked').removeClass('sku-quick-view-options__checked');
			$('.table-line__image-product img').remove();
			$('.table-line__title-product').text('');
			$('.sku-quick-view-options--select-voltage label').remove();
		};

		app.addTooltipProductInactive = function(product) {
			$('.combos-product-list__item').tooltip('destroy');
			if ($(product).hasClass('combos-product-list__item--inactive')) {
				$(product).data({
					title: 'Este produto foi removido do combo',
					placement: 'bottom',
					trigger: 'click'
				}).tooltip('show');
			}
		};

		app.addSlickProductImage = function(indice) {
			app.updateSlickCounter();

			$($('.product-quick-view__image').get(indice)).not('.slick-initialized').slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							arrows: false
						}
					}
				]
			});
		};

		app.updateSlickCounter = function() {
			$('.product-quick-view__image').on('init reInit afterChange', function(event, slick, currentSlide) {
				var i = (currentSlide ? currentSlide : 0) + 1;

				slick.slideCount > 1 ? $('.product-quick-view__image-counter').show().text(i + '/' + slick.slideCount) : $('.product-quick-view__image-counter').hide();
			});
		};

		app.toggleModalCombos = function() {
			$('.modal-quick-view').toggleClass('modal-quick-view--active');
			$('.mask-modal-combos').toggleClass('mask-modal-combos--active');
		};

		app.removeLoadingState = function() {
			buttonStepOne.removeClass('loading');
			shelfContainer.find('li.loading').removeClass('loading');
		};

		app.getIndiceProduct = function(product) {
			var result;
			$('.combos-product-list__item').map(function (indice, value) {
				if (value === $(product).get(0)) {
					result = indice;
				}
			});
			return result;
		};

		app.getIndiceCombo = function(combo) {
			var result;
			$('.combos-finalization').map(function (indice, value) {
				if (value === $(combo).get(0)) {
					result = indice;
				}
			});
			return result;
		};

		app.getIndice = function(items, item) {
			var result;
			items.map(function (indice, value) {
				if (value === $(item).get(0)) {
					result = indice;
				}
			});
			return result;
		};

		app.loadCombosFinalization = function(indice) {
			var finalization = $($('.combos-prateleira').get(indice)).find('.combos-finalization').html();

			$('.combos-finalization--quick-view > div').remove();

			if ($(window).width() <= 768) {
				if ($('.modal-quick-view__content > .combos-finalization--quick-view').length === 0) {
					var comboFinalizationMobile = $('.combos-finalization--quick-view').append(finalization);
					$($('.modal-quick-view__content').get(0)).append(comboFinalizationMobile);
				} else {
					$('.combos-finalization--quick-view').append(finalization);
				}
			} else {
				$('.combos-finalization--quick-view').append(finalization);
			}
		};

		app.loadGeneralInformation = function(button) {
			var tituloCombo = $(button).closest('.combos-prateleira').find('.combos-product-kit__title').html(),
				productName = $(button).closest('.combos-prateleira').find('.combo-product__title'),
				productPrice = $(button).closest('.combos-prateleira').find('.combo-product__price'),
				products = $('.product-quick-view');

			$($('.combos-quick-view__title').get(0)).html(tituloCombo);

			products.map(function (indice, value) {
				var name = $(productName.get(indice)).text(),
					price = $(productPrice.get(indice)).text();

				$(value).find('.product-quick-view__title').text(name);
				$(value).find('.product-quick-view__price').text('Por: ' + price);
			});
		};

		app.loadAccordionMobile = function() {
			var title 		= $('.quick-view-modules__title'),
				text 		= $('.quick-view-modules__content'),
				titleSpec 	= $('.quick-view-description__title');

			if ($(window).width() <= 768) {
				title.on('click', function() {
					$(this).toggleClass('active');
					$(text.get(app.getIndice(title , this))).slideToggle();
				});

				titleSpec.unbind('click').on('click', function() {
					var self = $(this);

					self.toggleClass('active');
					self.next('[class*="quick-view-table-"]').slideToggle();
				});
			}
		};

		app.loadSpecsMobile = function() {
			var title = $('.quick-view-description__title'),
				text = $('.quick-view-table-specification');

			if ($(window).width() <= 768) {
				title.unbind('click').on('click', function() {
					$(this).toggleClass('active');
					$(this).siblings(text).slideToggle();
				});
			}
		};

		app.init();
	};

	appIntegrationView = function () {
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
					logicView.actionSku();
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
	};

	appSelectVoltage = function () {
		var app = this;

		app.init = function () {
			app.actionSelectVoltagem();
			app.loadSelectVoltagem();
		};

		app.actionSelectVoltagem = function () {
			$('.combos-quick-view__header .combos-finalization__button, .modal-quick-view__content .combos-finalization__button').on('click', function () {
				app.toggleSelectVoltagem();
				app.hideSelectVoltagenInactive();
				app.actionBackSelectVoltagem();
				app.actionContinueSelectVoltagem();
				logicView.modalScrollTop();
			});
		};

		app.actionBackSelectVoltagem = function () {
			$('.select-voltage__button--back').on('click', function () {
				$('.combos-quick-view').removeClass('modal-quick-view--select-voltage');
				$('.modal-quick-view__container--select-voltage').hide();
				$('.modal-quick-view__container--product-list').show();
			});
		};

		app.actionContinueSelectVoltagem = function () {
			$('.select-voltage__button--continue').on('click', function () {
				var itemIds = [],
					quantityItems = $('.table-line__image-product img').length,
					quantitySelected = $('.table-line .sku-quick-view-options__checked').length;

				$('.table-line').map(function () {
					var itemid = $(this).find('.sku-quick-view-options__checked').attr('data-itemid'),
						seller = $(this).find('.sku-quick-view-options__checked').attr('data-seller');

					if(itemid !== undefined && itemid && itemid !== '') {
						itemIds.push({
							itemid: itemid,
							seller: seller
						});
					}
				});

				if(quantityItems === quantitySelected) {
					$.cookie('hideGae', true);
					$('.js-sku-selection-error').addClass('hide');
					$('.select-voltage__button--continue').addClass('loading');
					app.finalizationForSale(itemIds);
				} else {
					//TODO: ver com UX melhor forma de apresentar isso
					$('.js-sku-selection-error').removeClass('hide');
				}
			});
		};

		app.finalizationForSale = function (products) {
			var product = '',
				qty = '',
				seller = '',
				redirect;

			products.map(function (value, indice) {
				indice === 0 ? product += '?sku=' + value.itemid : product += '&sku=' + value.itemid;
				qty += '&qty=1';
				seller += '&seller='+value.seller;
				return value;
			});

			redirect = '/checkout/cart/add' + product + qty + seller + '&redirect=true&sc=' + store.salesChannel;

			$(location).attr('href', redirect);
		};

		app.toggleSelectVoltagem = function () {
			$('.combos-quick-view').toggleClass('modal-quick-view--select-voltage');
			$('.modal-quick-view__container--select-voltage').toggle();
			$('.modal-quick-view__container--product-list').toggle();
		};

		app.loadSelectVoltagem = function () {
			var imagens = $('.combos-product-list__item'),
				titles = $('.product-quick-view__title');
				// voltagens = $('.product-quick-view__item .sku-quick-view-options');

			$('.table-line').map(function (indice, value) {
				var image = $(imagens[indice]).html(),
					title = $(titles[indice]).text();

				if( !($(imagens[indice]).hasClass('combos-product-list__item--inactive')) ) {
					$(value).find('.table-line__image-product').html(image);
					$(value).find('.table-line__title-product').text(title);
				}
			});

		};

		app.hideSelectVoltagenInactive = function () {
			$('.table-line__title-product').closest('.table-line').show();
			$('.table-line__title-product').map(function () {
				if ($(this).is(':empty')) {
					$(this).closest('.table-line').hide();
				}
			});
		};
	};

	self.init();
});

/* 'use strict';

require('./quick-view/logic-view');

Nitro.module('quick-view', ['logic-view'], function (logicView) {
	logicView.init();

	$(window).on('quickView.modalScrollTop', function() {
		if($(window).width() <= 768) {
			$('html, body').animate({ scrollTop: 0 }, 1000, 'swing');
		} else {
			$('html, body').animate({ scrollTop: 350 }, 1000, 'swing');
		}
	});
});
 */
