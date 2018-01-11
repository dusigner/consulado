'use strict';

var CRM = require('modules/store/crm');
require('modules/gae-compra-interno/order.states');
require('modules/gae-compra-interno/order.warranty.gae');
require('../../templates/gae-compra-interno/warrantySpare.emptyOrders.html');


Nitro.controller('landing-gae-compra-interno', ['order.states', 'order.warranty.gae'], function(states, warranty) {
	var self = this,
		dateNow = new Date(),
		ordersPromises = [],
		allOrders = [],
		loading = '<div class="load"><div class="loading"></div></div>';

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
					$('#orders').append(loading);
				}
			});
		}
	};

	this.sortByDate = function(a, b) {
		return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
	};

	this.getData = function(e) {
		var data = {};

		data.currentState = states.get(e.state);

		data.orderId = e.orderId;
		data.orderIdFormatted = data.orderId.split('-').shift().replace(/[^0-9]/g, '');
		data.orderGroup = e.orderGroup;
		data.formattedDate = $.formatDatetimeBRL(e.creationDate);
		data.name = e.clientProfileData.firstName + ' ' + e.clientProfileData.lastName;
		data.address = e.shippingData.address;
		data.shippingMethod = (e.shippingData.logisticsInfo[0]) ? e.shippingData.logisticsInfo[0].selectedSla : '';
		data.payments = e.paymentData.payments;
		data.products = e.items;
		data.Installment = (e.paymentData.payments[0]) ? e.paymentData.payments[0].installments : '';
		data.boletoURL = (e.paymentData.payments[0]) ? e.paymentData.payments[0].url : '';
		data.hasGae = false;

		var orderDate = data.formattedDate.split('/');
		data.orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];

		data.products.forEach(function(e) {
			if (e.imageUrl) {
				e.imageUrl = e.imageUrl.replace('55-55', '500-500');
			}

			if (e.price) {
				e.price = _.formatCurrency(e.sellingPrice / 100);
			}

			if (e.bundleItems.length > 0) {
				data.hasGae = true;
			}

		});

		return data;
	};

	this.getStatus = function(order) {
		var currentOrder = CRM.getOrderById(order.orderId).then(function(result) {
			if (!result){
				return false;
			}

			$(result && result.Documents).each(function(i, e) {
				if (!e.finished) {
					order.currentState  = states.get( 'pedidoEntregue' );
				}
			});
		});

		// console.log('here', order);
		order.currentState.orderLabel = 'faturado'; // remover não esquecer
		if ($.diffDate(dateNow, order.orderDate) <= 334	&&
		order.currentState.orderLabel.toLowerCase() !== 'cancelado' &&
		order.currentState.orderLabel.toLowerCase() !== 'pedido cancelado' &&
		order.currentState.orderLabel.toLowerCase() !== 'aguardando pagamento' &&
		order.currentState.orderLabel.toLowerCase() !== 'preparando pedido' &&
		!order.hasGae) {
			ordersPromises.push(currentOrder);
			allOrders.push(order);
		}
	};

	this.renderEmptyOrders = function(order) {
		$('.load').remove();

		dust.render('warrantySpare.emptyOrders', order, function(err, out) {
			if (err) {
				throw new Error('My Orders Dust error: ' + err);
			}

			$('#orders').html(out);
		});
	};

	Order.list().done(function(orders) {
		if (orders.length > 0) {
			orders.reduce(function(prev, curr, i) {
				if (prev.orderGroup === curr.orderGroup) {
					delete orders[i - 1];

					//MERGE ITEMS
					$(prev.items).each(function(i, e) {
						curr.items.push(e);
					});

					//MERGE TOTALS
					$(prev.totals).each(function(i, e) {
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

			$(orders).each(function(i, e) {
				if (typeof e !== 'undefined') {
					var data = self.getData(e);

					self.getStatus(data);
				}
			});
		} else {
			$('.load').remove();

			self.renderEmptyOrders();
		}
	}, function() {
		var currentOrders = [];

		if (ordersPromises.length === 0) {
			self.renderEmptyOrders();
		} else {
			$(ordersPromises).each(function(index, promise) {
				promise.always(function(e) {
					currentOrders.push(e);


					if (ordersPromises.length === currentOrders.length) {
						warranty.setup(allOrders);
					}
				});
			});
		}
	});
});
