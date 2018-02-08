'use strict';

require('./filters/search-category');
require('./filters/select-filter');

Nitro.module('filters', ['search-category', 'select-filter'], function(searchCategory) {

	var self = this,
		$buttonFilter = $('.combos-filter__buttom--filter');

	self.init = function() {
		searchCategory.loadCategories();

		self.actionBoxFilter();
		self.clickOutsideAnElement('combos-filter', function() {
			$buttonFilter.removeClass('combos-filter__buttom--active');
			$buttonFilter.closest('.combos-filter').find('.combos-filter__category').removeClass('combos-filter__category--active');
			$('.mask').removeClass('mask--active');
		});

		self.updateMobile();
		searchCategory.addGroupMobile();

		$(window).on('combos.filter', self.toggleBoxFilter);
	};

	self.actionBoxFilter = function() {
		$buttonFilter.on('click', function(event) {
			event.preventDefault();
			self.toggleBoxFilter();
		});
	};

	self.toggleBoxFilter = function() {
		$buttonFilter.toggleClass('combos-filter__buttom--active');
		$buttonFilter.closest('.combos-filter').find('.combos-filter__category').toggleClass('combos-filter__category--active');
		$('.mask').toggleClass('mask--active');
	};

	self.clickOutsideAnElement = function(className, callback) {
		$('body').click(function(e) {
			// Se o clique foi diretamente na sua div || (ou) se o clique foi feito em algum elemento dentro da sua div
			if( e.target.class === className || $(e.target).closest('.'+className).length) {
				return;
			}
			callback();
		});
	};

	self.updateMobile = function() {
		if($(window).width() <= 768) {
			$buttonFilter.text('filtrar combos');
		}
	};

	self.init();
});
