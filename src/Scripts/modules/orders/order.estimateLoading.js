'use strict';
Nitro.module('order.estimateLoading', function() {


	var self = this;

	/**
	 * Initial setup for each status order
	 * @param {Object} order
	 */
	this.setup = function(order) {
		//console.log('ORDER', order);
		var $boxOrder = $('#' + order.orderGroup),
			shipping = {};

		order.statusOrder =
			$boxOrder.find('.order-status-wrapper');

		if (order.statusOrder.is('.processando-pagamento')) {

			shipping.orderPercent = 25;
			shipping.deliveryStatus = 'Pedido Realizado';
			self.calculateShipping(order, shipping);

		} else if (order.statusOrder.is('.aguardando-pagamento')) {

			shipping.orderPercent = 50;
			shipping.deliveryStatus = 'Pagamento em aprovação';
			self.calculateShipping(order, shipping);

		} else if (order.statusOrder.is('.preparando-entrega')) {

			shipping.orderPercent = 75;
			shipping.deliveryStatus = 'Pagamento aprovado';
			self.calculateShipping(order, shipping);

		} else if (order.statusOrder.is('.enviado')) {

			shipping.orderPercent = 100;
			self.calculateShipping(order);
			$boxOrder
				.find('.order-loading-estimate .delivery').show();

		}

	};

	/**
	 * Get the days left for the delivery
	 * @param {Integer} diff
	 * @return {Integer} daysLeft
	 */
	this.daysLeft = function(diff) {
		var daysLeft = '';
		if (diff === 5) {
			daysLeft = '';
		} else if (diff === 1) {
			daysLeft = ' - Falta: ' + (diff) + ' dia';
		} else {
			daysLeft = ' - Faltam: ' + (diff) + ' dias';
		}
		return daysLeft;
	};

	/**
	 * Get the scheduling date
	 * @param {Object} order
	 * @return {Date} scheduling Date
	 */
	this.schedulingDate = function(order) {
		var schedulingDate;
		$(order.shippingData.logisticsInfo).each(function(i, e) {
			if (e.slas) {
				$(e.slas).each(function(x, y) {
					if (y.shippingEstimateDate !== null) {
						schedulingDate = y.shippingEstimateDate;
					}
				});
			}
		});
		return schedulingDate;
	};


	/**
	 * Get selected sla info
	 * @param {object} order
	 * @return {object} shippingEstimate
	 */
	this.shippingSla = function(order) {
		var shippingEstimate;
		$(order.shippingData.logisticsInfo).each(function(i, e) {
			if (e.selectedSla) {
				var selectedSla = e.selectedSla;
				shippingEstimate = e.slas && e.slas.filter(function(value) {
					return value.name === selectedSla;
				});
			}
		});
		return shippingEstimate;
	};

	/**
	 * Calculate the percent for the loading bar
	 * @param {Object} shipping
	 * @param {Integer} orderPercent
	 * @param {Integer} percent
	 */
	this.percentShipping = function(shipping, orderPercent) {
		if (shipping.diff >= shipping.totalDays) {
			shipping.diff = shipping.totalDays;
		}
		var percent = (100 / shipping.totalDays) * shipping.diff;

		if (orderPercent !== undefined) {
			percent = orderPercent;
		} else if (shipping.diff >= 0 && shipping.diff <= 5) {
			percent = 75 + (shipping.diff * 5);
		}
		return percent;
	};

	/**
	 * Render in the html a loanding bar for each order
	 * @param {Object} order
	 * @param {Object} shipping
	 */
	this.renderLoading = function(order, shipping) {
		var $boxOrder = $('#' + order.orderGroup);

		if ($boxOrder.find('.order-loading-estimate').length > 1) {
			return false;
		}

		var boxLoading =
			'<div class="order-loading-estimate">' +

			'<div class="box-loading-gray"></div>' +
			'<div class="box-loading" style="width: {percent}%"></div>' +
			'<span class="realizado">{deliveryStatus}</span>' +
			'<div class="delivery"><span class="deliveryTitle">{deliveryTitle}</span>' +
			'<span class="deliveryDate"> {deliveryDate}</span>' +
			'<span class="daysLeft">{daysLeft}</span></div>' +
			'</div>';

		$(boxLoading.render({
			percent: shipping.percent,
			deliveryTitle: 'Previsão:',
			deliveryDate: $.formatDatetimeBRL(shipping.deliveryDate),
			daysLeft: shipping.daysLeft,
			deliveryStatus: shipping.deliveryStatus
		})).insertAfter($boxOrder
			.find('.order-status-info'));

		if (shipping.isSchedule) {
			$boxOrder
				.find('.order-loading-estimate .delivery').show();
		}

		//console.log('shipping', shipping);
	};


	/**
	 * Count weekend days
	 * @param {Date} dat
	 * @param {Integer} totalDays
	 * @return {Integer} weekend
	 */
	this.countWeekend = function(dat, totalDays) {
		var weekend = 0;
		for (var x = 1; x <= totalDays; x++) {
			dat = new Date(dat.setDate(dat.getDate() + 1));
			if (dat.getDay() === 0 || dat.getDay() === 6) {
				weekend++;
			}

			if (x === totalDays) {
				var end = 1;
				if (dat.getDay() === 6) {
					end = 2;
				}
				weekend = weekend + end;
			}
		}
		return weekend;
	};

	/**
	 * Calculate the delivery and days left with based shipping methods
	 * @param {Object} order
	 * @param {Object} shipping
	 */
	this.calculateShipping = function(order, shipping) {
		shipping = shipping || {};

		// Set the last order changed date and the default total day
		shipping.lastChange = $.formatDatetime(order.creationDate);
		shipping.currentDate = $.formatDatetime();
		shipping.isSchedule = false;
		shipping.totalDays = 5;

		// If this order has scheduling date
		shipping.schedulingDate = self.schedulingDate(order);
		shipping.selectedSla = self.shippingSla(order);

		if (shipping.selectedSla) {
			shipping.totalDays = parseInt(shipping.selectedSla[0].shippingEstimate.replace('bd', ''));
			shipping.isSchedule = true;
		}

		// Set the shipping estimate date
		var customDate = new Date(shipping.lastChange);
		var weekendDays = self.countWeekend(customDate, shipping.totalDays);

		shipping.totalDays = shipping.totalDays + weekendDays;
		shipping.deliveryDate = customDate.setDate(customDate.getDate() + shipping.totalDays);

		// if is scheduling date
		if (shipping.schedulingDate) {
			shipping.lastChange = $.formatDatetime(shipping.schedulingDate);
			shipping.totalDays = $.diffDate(shipping.lastChange, shipping.currentDate);
			shipping.isSchedule = true;

			customDate = new Date(shipping.lastChange);
			shipping.deliveryDate = customDate.setDate(customDate.getDate());
		}

		// Calculate the percent for the shipping
		shipping.diff = $.diffDate(shipping.deliveryDate, shipping.currentDate);
		shipping.percent = self.percentShipping(shipping, shipping.orderPercent);
		shipping.daysLeft = self.daysLeft(shipping.diff);

		self.renderLoading(order, shipping);
	};

});
