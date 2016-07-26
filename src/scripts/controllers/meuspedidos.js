var CRM = require('modules/store/crm');
require('modules/orders/order.states');
require('modules/orders/order.warranty');
require('../../templates/myorders.html');


Nitro.controller('meuspedidos', ['order.states', 'order.warranty'], function(states, warranty){

	'use strict';

	var template = 'myorders';

	var loading = '<div class="load"><div class="loading"></div></div>';

	var self = this, arrOrder = [];

	var Order = {

		list: function() {

			return $.ajax({

				url: '/api/checkout/pub/orders/',

				accept: 'application/vnd.vtex.ds.v10+json',

				crossDomain: true,

				type: 'GET',

				dataType: 'json',

				contentType: 'application/json; charset=utf-8',

				beforeSend: function() {
					$('.box-meuspedidos').append(loading);
				}

			});

		}

	};

	this.prepareRender = function( data ) {
		// data.orderId = 'v16039808wrpl-01';
		// If the request is not found show default message
		data.isMessage = true;

		var order = CRM.getOrderById( data.orderId ).then(function( result ) {
				data.tracking = [];
				if(! result) return false;

				$(result && result.Documents).each(function(i,e) {
					data.tracking[ i ] = {
						description: e.description,
						lastChange:  $.formatDatetimeBRL( e.lastChange )
					};
					data.isMessage = false;
				});

			}).then(function() {

				$('.box-meuspedidos').trigger('renderTracking', data);

			}, function () {

				$('.box-meuspedidos').trigger('renderTracking', data);

			});

			arrOrder.push(order);
	};

	this.listenRender = function() {
		$('.box-meuspedidos').on('renderTracking', function(event, data) {

			dust.render( template , data , function (err, out) {
				if (err) {
					throw new Error('My Orders Dust error: ' + err);
				}
				$('.box-meuspedidos').append(out);
			});
		});
	};

	this.getSla = function(selectedSla, slas) {
		var obj = slas.filter(function(e) {
			if(e.name === selectedSla)  return e.shippingEstimate;
		});
		return obj[0];
	};

	this.calculateSla = function( orderDate, currentSla ) {
		var isBusinessDay = ( currentSla.shippingEstimate && currentSla.shippingEstimate.indexOf('bd') ) ? true : false;
		var estimateDate;
		if( isBusinessDay ) {
			// Calculo para dias comerciais
			estimateDate = $.calculateBusinessDays( orderDate, currentSla.shippingEstimate.replace('bd','') );
			estimateDate = $.formatDatetimeBRL( estimateDate);
		} else {
			// Calculo para dias corridos
			estimateDate = $.calculateDays( orderDate, currentSla.shippingEstimate.replace('d','') );
			estimateDate = $.formatDatetimeBRL( estimateDate);
		}

		return estimateDate;
	};

	this.getData = function(e) {
			var totalName = {
				'Discounts': 'Descontos',
				'Shipping': 'Entrega',
				'Items': 'Subtotal',
				'Tax': 'Taxas'
			};

			var data = {};

			data.currentState  = states.get( e.state ) ;

			data.orderId				= e.orderId;
			data.orderIdFormatted 		= data.orderId.split('-').shift().replace(/[^0-9]/g, '');
			data.orderGroup				= e.orderGroup;
			data.orderDate				= $.formatDatetimeBRL( e.creationDate );
			data.name					= e.clientProfileData.firstName + ' '+ e.clientProfileData.lastName;
			data.address				= e.shippingData.address;
			data.shippingMethod 		= (e.shippingData.logisticsInfo[0]) ? e.shippingData.logisticsInfo[0].selectedSla : '';
			data.paymentType			= (e.paymentData.payments[0]) ? e.paymentData.payments[0].paymentSystemName : '';
			data.payments				= e.paymentData.payments;
			data.products 				= e.items;
			data.totals					= e.totals;
			data.totalPrice				= _.formatCurrency( e.value / 100 );
			if(data.paymentType) data.isBoleto = ( data.paymentType.toString().indexOf('Boleto') >= 0 && data.currentState.group === 'pagamento' ) ? true : false;
			data.Installment			= (e.paymentData.payments[0]) ? e.paymentData.payments[0].installments : '';
			data.boletoURL				= (e.paymentData.payments[0]) ? e.paymentData.payments[0].url : '';

			var slas = (e.shippingData.logisticsInfo[0]) ? e.shippingData.logisticsInfo[0].slas : '';
			var currentSla = self.getSla( data.shippingMethod, slas);

			data.orderEstimateDate = self.calculateSla( e.creationDate, currentSla );

			if( data.boletoURL ) {
				data.boletoURL = data.boletoURL.replace('{Installment}', data.Installment);
			}

			data.products.forEach(function(e) {
				if( e.imageUrl ) {
					e.imageUrl = e.imageUrl.replace('55-55','500-500');
				}
				if ( e.price ) {
					e.price = _.formatCurrency( e.sellingPrice / 100 );
				}
			});

			data.totals.forEach(function(e) {
				e.name 		= totalName[e.id];
				e.value 	= _.formatCurrency( e.value / 100 );
			});

			return data;
	};

	this.sortByDate = function(a, b) {
			return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
	};

	this.showMore = function() {
		$('.box-order-header').on('click', function() {
			if ( $(window).width() > 840 ) { return false;	}
			var element = $(this);
			if(element.hasClass('js-active')) {
			 	element.removeClass('js-active').next().stop().slideUp();
			} else {
				$('.box-order-header.js-active').not(this).removeClass('js-active').next().stop().slideUp();
				element.addClass('js-active').next().stop().slideDown();
			}
		});

		$('.show-more-txt').on('click', function() {
			if ( $(window).width() > 840 ) { return false;	}
			var boxData = $(this).parent().parent().find('.list-data span');
			var boxAddress = $(this).parent().parent().find('.list-address');

			$(this).toggleClass('active');

			if( $(this).hasClass('active') ) {
				$(this).html('Ver menos');
				boxData.show();
				boxAddress.show();
			} else {
				$(this).html('Ver mais');
				boxData.hide();
				boxAddress.hide();
			}

		});
	};

	Order.list().done(function( orders ) {
			$('.load').remove();

			self.listenRender();

			orders.reduce(function(prev, curr, i) {

				if( prev.orderGroup === curr.orderGroup ) {

					delete orders[i-1];

					//MERGE ITEMS
					$( prev.items ).each(function(i, e) {
						curr.items.push( e );
					});

					//MERGE TOTALS
					$( prev.totals ).each(function(i, e) {
						if (curr.totals[i]) {
							curr.totals[i].value += e.value;
						} else {
							curr.totals[i] = e;
						}
					});

					curr.value += prev.value;

				}

				return curr;
			});

			orders.sort(self.sortByDate).reverse();

					$( orders ).each(function(i,e) {

						if(typeof e !== 'undefined') {

						 	var data = self.getData( e );

						 	self.prepareRender( data );

						 }

					});
			}, function() {

				var currentOrders = [];

				$(arrOrder).each(function(index, promise) {

					promise.always(function(e) {
						currentOrders.push(e);
						if(arrOrder.length === currentOrders.length) {
							warranty.setup();
							self.showMore();
						}
					});

				});

			});
	});

$( document ).ajaxComplete(function( event, xhr, settings ) {

	'use strict';

	if ( settings.url === '/no-cache/profileSystem/getProfile' ) {
		sessionStorage.setItem('profileVtex', xhr.responseText );
	}

});
