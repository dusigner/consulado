 /* global VERSION: true, Nitro: true, $: true */

'use strict';

$(window).on('load', function() {

	require('modules/helpers');

	if (VERSION) {

		console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

		window._trackJs = window._trackJs || {};

		window._trackJs.version = VERSION;
	}

	//load Nitro Lib
	require('vendors/nitro');

	require('expose?store!modules/store/store');

	require('modules/checkout/checkout.phones');
	require('modules/checkout/checkout.termoColeta');
	require('modules/checkout/checkout.cotas');

	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');

	Nitro.setup(['checkout.phones', 'checkout.termoColeta', 'checkout.cotas'], function(phones, termoColeta, cotas) {

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
				return self[request] && self[request].call(self);
			});
		};

		this.isOrderPlaced = function() {
			return $body.hasClass('body-checkout-confirmation');
		};

		//event
		this.orderPlacedUpdated = function(e, orderPlaced) {
			if (self.isOrderPlaced()) {
				console.info('orderPlacedUpdated', orderPlaced);

				$('.cconf-myorders-button').attr('href','/minhaconta/pedidos');

				self.infoBoleto();
				self.replaceOrderId();

				phones.setup();
				termoColeta.setup();
				cotas.updateCotasEletrodomesticos();
				highlightVoltage($('.cconf-product-table .w-80-ns p'));
			}
		};

		this.replaceOrderId = function() {
			$('.orderid').each(function() {
				var span = $(this).find('span:last');
				span.text(span.text().split('-').shift().replace(/[^0-9]/g, ''));
			});
		};

		this.infoBoleto = function() {
			var $bankInvoice = $('#print-bank-invoice');
			if ($bankInvoice.length > 0) {
				$('.cconf-alert .db').text('Falta pouco! Efetue o pagamento do boleto e finalize seu pedido.');

				$('.cconf-payment article.fl .lh-copy').append($bankInvoice.clone());
			}
		};

		this.init();

		$(window).on('orderPlacedReady.vtex', this.orderPlacedUpdated);

	});

});