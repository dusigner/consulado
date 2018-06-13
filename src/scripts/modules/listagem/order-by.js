'use strict';

var helper = require('modules/filters-helper');

Nitro.module('order-by', function () {

	var _self = this,
		$listOrders = $('ul.order-by'),
		$filterOptions = $('#O:first option'),
		$listMore = $('#list-more'),
		$orderTitle = $('.order-title'),
		ignoreFilters = ['OrderByNameASC', 'OrderByNameDESC', 'OrderByReviewRateDESC'],
		page = 1;

	$(window).on('filter', helper.setRel.bind(this));

	// PREPARE DATA TO OBJECT -> RENDER
	this.setup = function(){
		if($filterOptions.length > 0){

			var $filters = $filterOptions.filter(function() {
				return $(this).val() !== '' && ignoreFilters.indexOf($(this).val()) === -1;
			}).map(function() {

				var self = $(this);

				return '<li><a href="javascript:void()" title="' + self.text() + '" data-order="&O=' + self.val() + '">' + self.text() + '</a></li>';
			}).get().join('');

			$listOrders.append($filters);

			$listOrders.find('li a').click(function(e){
				e.preventDefault();
				console.log('clicou no order-by ul li a');
				_self.order($(this));
			});

		}
	};

	this.order = function($orderElement) {
		var orderValue = $orderElement.data('order');
		console.log('orderValue>'+orderValue);
		$('.selected').removeClass('selected');
		$orderElement.addClass('selected');

		$orderTitle.addClass('loading');

		$orderTitle.find('em').text($orderElement.text());

		$orderTitle.add('.order-by').removeClass('active');

		_self.request(orderValue);
	};

	// RENDER HTML & ACTION FUNCTIONS
	/*this.render = function(){
		dust.render('order', orderBy, function(err, out) {

			if (err) {
				throw new Error('Filters Dust error: ' + err);
			}

			// console.log(out);

			$container.html(out);
			helper.filters.removeClass('hide');
			$('.filters__order').removeClass('hide');

			$('.order__item a').click(function(e) {
				e.preventDefault();

				var orderValue = $(this).data('order');

				$orderBtn.find('span').html(': ' + $(this).text());

				_self.request(orderValue);

			});

		});
	};*/

	this.request = function(orderValue){
		$.ajax({
			url: helper.url() + page + helper.rel + orderValue,
			localCache: true,
			cacheTTL: 1,
			cacheKey: 'order' + page + helper.rel + orderValue + vtxctx.categoryId,
			dataType: 'html',
			beforeSend: function(){
				helper.vitrineHolder.addClass('loading');
				helper.vitrine.removeClass('loaded');
			}
		})
		.done(function(data) {
			if( data ) {
				console.log('ordervalue', orderValue);
				$(window).trigger('filter', [helper.rel + orderValue, true]);

				$('.vitrine > .prateleira').remove();

				helper.vitrine.addClass('loaded').append( data );

				$(window).trigger('changedFilter');

				Nitro.module('prateleira');
			}
		})
		.always(function() {
			helper.vitrineHolder.removeClass('loading');
			$orderTitle.removeClass('loading');
			$listMore.show();
		});
	};

	this.setup();


});