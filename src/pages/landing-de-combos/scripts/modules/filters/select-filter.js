'use strict';

require('./search-category');

Nitro.module('select-filter', ['search-category'], function(searchCategory) {
	var	app = this,
		categoryItem = $('.combos-category__item'),
		breadCrumbItems = $('.combos-bread-crumb__items'),
		active = {
			category : 'combos-category__item--active',
			breadCrumb : 'combos-bread-crumb__item--active'
		},
		button = {
			clear : $('.combos-filter__buttom--clear'),
			search : $('.combos-filter__buttom--search'),
		};

	app.init = function() {
		app.actionSearch();
		app.actionRemoveItemBreadCrumb();
		app.actionClearCombos();
	};

	app.actionSearch = function() {
		button.search.on('click', function() {
			$('.combos-bread-crumb__item').remove();
			$('.prateleira-combos').closest('.combos-prateleira').show();

			app.searchCombos();
			app.checkShelfState();

			$('.combos-bread-crumb__item').addClass(active.breadCrumb);
			app.actionRemoveItemBreadCrumb();

			$(window).trigger('combos.filter');
		});
	};

	app.actionRemoveItemBreadCrumb = function() {
		$('.combos-bread-crumb__icon-close').on('click', function() {
			var refId = $(this).closest('.combos-bread-crumb__item').attr('ref');

			$('#' + refId).attr('checked', false);
			$('.prateleira-combos').closest('.combos-prateleira').show();

			app.searchCombos();
			app.checkShelfState();

			$(this).closest('.combos-bread-crumb__item').remove();
		});
	};

	app.actionClearCombos = function() {
		button.clear.on('click', function() {
			$('.combos-category__checkbox').attr('checked', false);

			categoryItem.removeClass(active.category);

			$('.prateleira-combos').closest('.combos-prateleira').show();
			breadCrumbItems.html('');

			app.searchCombos();
			app.checkShelfState();

			$(window).trigger('combos.filter');
		});
	};

	app.addBreadCrumb = function( $checkBox ) {
		var listBreadCrumb = $('<li>').addClass('combos-bread-crumb__item').attr({
				'data-category': $checkBox.attr('data-category'),
				'ref': $checkBox.find('.combos-category__checkbox').attr('id')
			}),
			iconBreadCrumb = $('<a>').addClass('combos-bread-crumb__icon-close');

		listBreadCrumb.text( $checkBox.find('label').text() );
		listBreadCrumb.append( iconBreadCrumb );
		breadCrumbItems.append( listBreadCrumb );
	};

	app.checkShelfState = function() {
		setTimeout(function() {
			var	shelfStates = [];

			$('.combos-prateleira').each(function() {
				var shelfStyle = $(this).attr('style');
				shelfStates.push(shelfStyle);
			});

			var stateOfShelfs = function() {
				var testState = shelfStates.every(function(value) { return 'display: none;' === value; });

				return testState;
			};

			if (stateOfShelfs() === true) {
				$('<div class="container combos-page__warning"><p class="combos-page__warning-text">Infelizmente não encontramos nenhum combo com esses produtos selecionados, mas não deixe de conferir as ofertas do nosso site.</p></div>').insertAfter($('.combos-page__title:not(.is-appended)').addClass('is-appended'));
			} else {
				$('.combos-page__title').removeClass('is-appended');
				$('.combos-page__warning').remove();
			}
		}, 600);
	};

	app.searchCombos = function() {
		var $checkBoxes = $('.combos-category__checkbox');

		$checkBoxes.filter(':checked').each(function() {
			var $list = $(this).parent('li');

			app.addBreadCrumb($list);
			searchCategory.searchCategoryPrateleiras( $list.attr('data-category') );
		});
	};

	app.init();

	return app;
});
