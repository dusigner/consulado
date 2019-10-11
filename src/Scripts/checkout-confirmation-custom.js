/* global VERSION: true, Nitro: true, $: true */

'use strict';

$.ajax({
	async: false,
	url: '//io.vtex.com.br/front-libs/bootstrap/2.3.2/js/bootstrap.min.js',
	dataType: 'script'
});

$(window).on('load', function() {
	require('modules/helpers');

	if (VERSION) {
		console.info(
			'%c %c %c Jussi | %s Build Version: %s %c %c ',
			'background:#dfdab0;padding:2px 0;',
			'background:#666; padding:2px 0;',
			'background:#222; color:#bada55;padding:2px 0;',
			(window.jsnomeLoja || '').replace(/\d/, '').capitalize(),
			VERSION,
			'background:#666;padding:2px 0;',
			'background:#dfdab0;padding:2px 0;'
		);

		window._trackJs = window._trackJs || {};

		window._trackJs.version = VERSION;
	}

	//load Nitro Lib
	require('vendors/nitro');

	require('vendors/jquery.cookie');
	require('expose-loader?store!modules/store/store');

	require('modules/checkout/checkout.phones');
	require('modules/checkout/checkout.termoColeta');
	require('modules/checkout/checkout.cotas');

	var CRM = require('modules/store/crm.js');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');

	Nitro.setup(['checkout.phones', 'checkout.termoColeta', 'checkout.cotas'], function(phones, termoColeta, cotas) {
		const self = this,
			$body = $('body');

		this.init = function() {
			this.orderPlacedUpdated();
			this.orderReinput();

			if (window.hasher) {
				window.hasher.changed.add(function(current) {
					return self[current] && self[current].call(self);
				});
			}

			return (
				window.crossroads &&
				window.crossroads.routed.add(function(request) {
					return self[request] && self[request].call(self);
				})
			);
		};

		this.orderData = [];

		this.isOrderPlaced = function() {
			return $body.hasClass('body-checkout-confirmation');
		};

		//event
		this.orderPlacedUpdated = function(/*e, orderPlaced*/) {
			if (self.isOrderPlaced()) {
				// console.info('orderPlacedUpdated', orderPlaced);

				$('.cconf-myorders-button').attr('href', '/minhaconta/pedidos');

				self.infoBoleto();
				self.replaceOrderId();

				phones.setup();
				termoColeta.setup();
				cotas.updateCotasEletrodomesticos();
				highlightVoltage($('.cconf-product-table .w-80-ns p'));
			}

			$(document).ajaxStop(() => self.updateRecurrenceItem());
		};

		this.replaceOrderId = function() {
			$('.orderid').each(function() {
				var span = $(this).find('span:last');
				span.text(
					span
						.text()
						.split('-')
						.shift()
						.replace(/[^0-9]/g, '')
				);
			});
		};

		var urlconfir = window.location.href,
			absolutoconfirm = urlconfir.split('/')[urlconfir.split('/').length - 1],
			pedidoconfir = absolutoconfirm.replace('?og=', '');
		// console.log(pedidoconfir);

		$.getJSON('/api/checkout/pub/orders/order-group/' + pedidoconfir, function(res) {
			// console.info(res);

			var entregaEscolhida = res[0].shippingData.logisticsInfo[0].selectedSla;
			var arrTiposDeEntrega = Object.keys(res[0].shippingData.logisticsInfo[0].slas);

			for (var i = 0; i < arrTiposDeEntrega.length; i++) {
				var entregas = res[0].shippingData.logisticsInfo[0].slas[i];

				if (entregas.id === entregaEscolhida) {
					var startag = entregas.deliveryWindow ? new Date(entregas.deliveryWindow.startDateUtc) : '',
						endag = entregas.deliveryWindow ? new Date(entregas.deliveryWindow.endDateUtc) : '';
				}
			}

			var starHor = startag ? startag.getUTCHours() : '',
				andHor = endag ? endag.getUTCHours() : '',
				$wrapper = document.querySelector('#app-container .ph3-ns .pv4 .mb0 span:nth-child(2)'),
				HTMLTemporario = $wrapper.innerHTML,
				HTMLNovo = ' das: <i>' + starHor + '</i> às: <i>' + andHor + '</i>';

			HTMLTemporario = HTMLTemporario + HTMLNovo;
			$wrapper.innerHTML = HTMLTemporario;
		});

		this.infoBoleto = function() {
			setTimeout(function() {
				var $btnPrintBankInvoice = $('#app-top #print-bank-invoice');
				var $btnPrintBankInvoiceCopy = $btnPrintBankInvoice.clone();

				$btnPrintBankInvoiceCopy.addClass('js-print-bankInvoice-button');

				if ($btnPrintBankInvoice.length > 0) {
					$('.cconf-alert .db').text('Falta pouco! Efetue o pagamento do boleto e finalize seu pedido.');
					$('.cconf-payment article.fl .lh-copy').append($btnPrintBankInvoiceCopy);
				}

				$(document).on('click', '.js-print-bankInvoice-button', function() {
					$('#app-top #print-bank-invoice .link').trigger('click');
				});
			}, 800);
		};

		this.orderReinput = function() {
			var istelevendas = localStorage.getItem('istelevendas'),
				// orderformId = localStorage.getItem('orderformId'),
				isuser = localStorage.getItem('isuser'),
				orderR = localStorage.getItem('orderR'),
				newOrder = $('#order-id').text(),
				company = localStorage.getItem('company'),
				reason = localStorage.getItem('reason'),
				alcada = localStorage.getItem('alcada'),
				obsUser = localStorage.getItem('obsUser');

			if (istelevendas !== null) {
				// concatena as variaveis no date
				var data = {
					company: company,
					LastUser: isuser,
					newOrder: newOrder,
					orderReinput: orderR,
					userTelesales: istelevendas,
					alcada: alcada,
					obsUser: obsUser,
					reason: reason
				};

				// Faz a inserção no MasterData
				CRM.ajax({
					url: CRM.formatUrl('RP', 'documents'),
					type: 'PATCH',
					data: JSON.stringify(data),
					success: function() {
						localStorage.removeItem('orderformId');
						localStorage.removeItem('istelevendas');
						localStorage.removeItem('isuser');
						localStorage.removeItem('orderR');
						localStorage.removeItem('company');
						localStorage.removeItem('reason');
						localStorage.removeItem('obsUser');
						localStorage.removeItem('alcada');
					},
					error: function(error) {
						console.info('error; ' + error);
					}
				});
			} else {
				console.info('nao tem o localStorage');
			}
		};

		this.updateRecurrenceItem = function() {
			for (let i = 0; i < $('.cconf-attachment-recorrencia:not(.checked)').length; i++) {
				// prettier-ignore
				$('.cconf-attachment-recorrencia:not(.checked)').eq(i).is(":hidden") ? '' : $(`
					<tr class="cconf-attachment-recorrencia-custom">
						<td class="recurrence-item-table">
							<div class="recurrence-item-message">
								<p class="recurrence-item-period">assinatura de compra recorrente a cada ${$('.cconf-attachment-recorrencia').eq(i).find('.cconf-attachment-value').text()}</p>
							</div>

							<p class="recurrence-item-mail">Você receberá por e-mail todos os detalhes da sua assinatura</p>
						</td>

						<td class="empty-td"></td>
						<td class="empty-td"></td>
						<td class="empty-td"></td>
					</tr>
				`).insertBefore($('.cconf-attachment-recorrencia').eq(i));
				$('.cconf-attachment-recorrencia')
					.eq(i)
					.addClass('checked');
			}
		};

		this.init();

		$(window).on('orderPlacedReady.vtex', this.orderPlacedUpdated);
	});
});
