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

	require('modules/banner-covid');

	var CRM = require('modules/store/crm.js');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');

	Nitro.setup(['checkout.phones', 'checkout.termoColeta', 'checkout.cotas'], function(phones, termoColeta, cotas) {
		const self = this,
			$body = $('body');

		this.init = function() {
			this.closeEbitModal();
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

		this.closeEbitModal = () => {
			$(document).on('click', '.btFechar', () => {
				$('.boxLight').hide();
			});
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
				$('.cconf-attachment-recorrencia:not(.checked)').eq(i).is(':hidden') ? '' : $(`
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

(function(window, document) {

  "use strict";

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  window.pushDataLayer = function(orderPlaced) {
      window.dataLayer = window.dataLayer || [];
      var order = [];
      var products = [];
      var product;
      var product_sku;
      var additionalInfo;
      products = [];
      for(var j = 0, max_products = orderPlaced.transactionProducts.length ; j < max_products ; j+=1) {
        product = orderPlaced.transactionProducts[j];
        additionalInfo = JSON.parse(localStorage.getItem('product_' + product.id));
        product_sku = additionalInfo && additionalInfo.ref_id && additionalInfo.ref_id !== '' ? additionalInfo.ref_id : product.skuRefId;
        products.push({
          'id' : product_sku.replace(/ANA|BNA/g, ''),
          'id_vtex' : product.id,
          'fullId': additionalInfo ? additionalInfo.fullId : product.skuRefId,
          'name' : product.name,
          'brand' : product.brand,
          'availability' : "Disponível",
          'quantity' : product.quantity,
          'originalPrice' : additionalInfo ? additionalInfo.originalPrice : product.originalPrice,
          'price' : product.price,
          'categorySAP' : additionalInfo ? additionalInfo.category_sap :  '',
          'category' : product.category,
          'department' : product.categoryTree.length ? product.categoryTree[0] : '',
          'color' : additionalInfo ? additionalInfo.color : '',
          'variant' : product.skuName,
          'coupon' : "",
          'comboName': additionalInfo ? additionalInfo.comboName : '',
          'warrantyType' : additionalInfo ? additionalInfo.warrantyType : null,
          'warrantyPrice' : additionalInfo ? additionalInfo.warrantyPrice : null,
          'shippingPrice' : additionalInfo ? additionalInfo.shippingPrice : null,
          'shippingType' : additionalInfo ? additionalInfo.shippingType : null,
          'shippingTime' : additionalInfo ? additionalInfo.shippingTime : null
        });
      }
      order.push({
        'id': orderPlaced.transactionId,
        'revenue' : (orderPlaced.transactionTotal - orderPlaced.transactionShipping),
      	'shipping' : orderPlaced.transactionShipping,
      	'coupon' : orderPlaced.coupon,
      	'paymentMethod' : orderPlaced.transactionPaymentType.length ? orderPlaced.transactionPaymentType[0].paymentSystemName : '',
        'installments' : orderPlaced.transactionPaymentType.length ? orderPlaced.transactionPaymentType[0].installments : 1
      });
      var user     = {
        'firstLogin': null,
        'loginStatus': 'Deslogado',
        'userId': ''
      };
      var userinfo;
      for(var d = 0, max_dataLayer = window.dataLayer.length ; d < max_dataLayer ; d+=1) {
        if(window.dataLayer[d].visitorId) {
          user = {
            'firstLogin': '',
            'loginStatus': window.dataLayer[d].visitorLoginState ? 'Logado' : 'Deslogado',
            'userId': window.dataLayer[d].visitorId
          };
          break;
        }
      }
      userinfo = (getCookie('userinfo') != '') ? JSON.parse(getCookie('userinfo')) : '';
      if(user.loginStatus == 'Deslogado' && (userinfo && userinfo !== '')) {
        user = {
          'firstLogin': userinfo.firstLogin,
          'loginStatus': userinfo.loginStatus,
          'userId': userinfo.userId
        }
      }

      window.dataLayer.push({
        'event': 'virtualPageview',
        'step': 'orderPlaced',
        'page': {
          'type': 'purchase',
          'currencyCode': "BRL"
        },
        'checkout': {
          'step': undefined,
          'order': order,
          'products' : products
        },
        'user': user
      });
  }

  function init(orderPlaced) {
      window.pushDataLayer(orderPlaced);
  }
  window.onload  = (function() {
    window.dataLayer = window.dataLayer || [];
    var dataLayer_trigger = setInterval(function() {
      for(var i = (window.dataLayer.length - 1), min = 0 ; i >= 0 ; i--) {
        if(window.dataLayer[i].event && window.dataLayer[i].event == "orderPlaced") {
          init(window.dataLayer[i]);
          clearInterval(dataLayer_trigger);
        }
      }
    }, 500);
  });

})(window, document);
