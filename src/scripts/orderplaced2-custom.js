 /* global VERSION: true, Nitro: true, $: true */

'use strict';

$(window).on('load', function() {

	require('modules/helpers');

	if (VERSION) {

		// console.log('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

		window._trackJs = window._trackJs || {};

		window._trackJs.version = VERSION;
	}

	//load Nitro Lib
	require('vendors/nitro');

	// require('modules/checkout.phones');
	require('modules/checkout.termoColeta');

	Nitro.setup(['checkout.termoColeta'], function(termoColeta) {

		var self = this,
			$body = $('body');

		this.init = function() {
			this.orderPlacedUpdated();

			if (window.hasher) {
				window.hasher.changed.add(function(current) {
					return self[current] && self[current].call(self);
				});
			}

			return window.crossroads && window.crossroads.routed.add(function(request) {
				//console.log('crossroads', request, data);
				return self[request] && self[request].call(self);
			});
		};

		this.isOrderPlaced = function() {
			return $body.hasClass('body-order-placed');
		};

		//event
		this.orderPlacedUpdated = function(e, orderPlaced) {

			if (self.isOrderPlaced()) {
				console.info('orderPlacedUpdated', orderPlaced);

				self.infoBoleto();
				self.replaceOrderId();
				self.reorderDivs();

				// phones.setup();
				termoColeta.setup();
			}
		};

		this.replaceOrderId = function() {
			$('.orderid').each(function() {
				var span = $(this).find('span:last');
				span.text(span.text().split('-').shift().replace(/[^0-9]/g, ''));
			});
		};

		this.reorderDivs = function() {
			$('.payment-info').removeClass('span5').addClass('span4');
			$('.shipping-info').removeClass('span2').addClass('span4');
			$('.total-info').removeClass('span3').addClass('span4');
		};

		this.infoBoleto = function() {

			var bankInvoice = $('.bank-invoice-print');
			if (bankInvoice.length > 0) {
				$('.orderplaced-alert-content h4').text('Falta pouco! Efetue o pagamento do boleto e finalize seu pedido.');
			}
		};

		this.init();

		$(window).on('orderPlacedReady.vtex', this.orderPlacedUpdated);

	});

});

