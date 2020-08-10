'use strict';

require('vendors/jquery.cookie');

Nitro.module('select-voltage', function () {
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
				app.finalizationForSale(itemIds);
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
});
