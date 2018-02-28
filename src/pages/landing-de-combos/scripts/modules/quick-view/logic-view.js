'use strict';

require('vendors/slick');
require('bootstrap/tooltip');

require('./integration-view');
require('./select-voltage');

Nitro.module('logic-view', ['integration-view', 'select-voltage'], function (integrationView, selectVoltage) {
	var app = this,
		buttonStepOne = $('.combos-prateleira .combos-finalization__button');
		// idProducts = [],
		// productsObjects = [],
		// actionSku;

	app.init = function () {
		app.actionCombos();
		app.actionCloseQuikView();
	};

	app.actionCombos = function () {
		buttonStepOne.on('click', function () {
			var quantityInactive = $(this).closest('.combos-prateleira').find('.combo-product--inactive').length,
				combosFinalization = $(this).closest('.combos-finalization'),
				indice = app.getIndiceCombo(combosFinalization);

			$(this).addClass('loading');

			if (quantityInactive <= 4) {
				app.initProduct();

				integrationView.init(this)
					.then(function() {
						$('.combos-finalization__button').removeClass('loading');
						$(window).trigger('quickView.modalScrollTop');
						// app.getProducts(this);
						app.actionTabProduct();
						app.toggleModalCombos();
						app.addSlickProductImage(0);
						app.loadCombosFinalization(indice);
						app.loadGeneralInformation(this);
						app.loadAccordionMobile();
						selectVoltage.init();
					}.bind(this));
			}

		});
	};

	app.actionCloseQuikView = function () {
		$('.modal-quick-view__button-close').on('click', function () {
			app.toggleModalCombos();
			$('.product-quick-view__image').removeClass('slick-initialized slick-slider');
		});

		if($(window).width() <= 768) {
			$('.combos-quick-view__title').on('click', function () {
				app.toggleModalCombos();
				$('.product-quick-view__image').removeClass('slick-initialized slick-slider');
			});
		}
	};

	app.actionTabProduct = function () {
		var tabs = $('.combos-product-list__item');

		tabs.on('click', function () {
			app.activeProduct(this);
			app.addTooltipProductInactive(this);
		});
	};

	app.activeProduct = function (product) {
		var tabs = $('.combos-product-list__item'),
			indice = app.getIndiceProduct(product);

		tabs.removeClass('combos-product-list__item--active');
		$(product).addClass('combos-product-list__item--active');
		$('.product-quick-view').removeClass('product-quick-view--active');
		$($('.product-quick-view').get(indice)).addClass('product-quick-view--active');
		app.addSlickProductImage(indice);
	};

	app.initProduct = function () {
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

	app.addTooltipProductInactive = function (product) {
		$('.combos-product-list__item').tooltip('destroy');

		if ($(product).hasClass('combos-product-list__item--inactive')) {
			$(product).data({
				title: 'Este produto foi removido do combo',
				placement: 'bottom',
				trigger: 'click'
			}).tooltip('show');
		}
	};

	app.addSlickProductImage = function (indice) {
		$($('.product-quick-view__image').get(indice)).not('.slick-initialized').slick({
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1
		});
	};

	app.toggleModalCombos = function () {
		$('.modal-quick-view').toggleClass('modal-quick-view--active');
		$('.mask-modal-combos').toggleClass('mask-modal-combos--active');
	};

	app.getIndiceProduct = function (product) {
		var result;

		$('.combos-product-list__item').map(function (indice, value) {
			if (value === $(product).get(0)) {
				result = indice;
			}
		});

		return result;
	};

	app.getIndiceCombo = function (combo) {
		var result;

		$('.combos-finalization').map(function (indice, value) {
			if (value === $(combo).get(0)) {
				result = indice;
			}
		});

		return result;
	};

	app.getIndice = function (items, item) {
		var result;

		items.map(function (indice, value) {
			if (value === $(item).get(0)) {
				result = indice;
			}
		});

		return result;
	};

	app.loadCombosFinalization = function (indice) {
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

	app.loadGeneralInformation = function (button) {
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
		var title = $('.quick-view-modules__title'),
			text = $('.quick-view-modules__content');

		if ($(window).width() <= 768) {
			title.on('click', function() {
				$(this).toggleClass('active');
				$(text.get(app.getIndice(title , this))).slideToggle();
			});
		}
	};
});
