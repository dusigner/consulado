'use strict';

var CRM = require('modules/store/orders-crm');

var PDVBOX = {

	self: this,
	dateNow: new Date(),

	// var self.pdvBoxAPI = store.isQA ? 'http://compracerta.nxd.com.br/api/v2' : 'https://pdvbox.nxd.com.br/compracerta/api/v2';

	pdvBoxAPI: 'https://pdvbox.nxd.com.br/compracerta/api/v2',

	username: 'compracerta',

	password: '8MUKHL5VSqeK8YaFCngUYcpuZZnn2WA4',

	profileData: {},

	getProfileData: function(){
		return vtexjs.checkout.getOrderForm().done(function(res){
			PDVBOX.profileData = res.clientProfileData;
			return res.clientProfileData;
		});
	}(),

	get: function(orderId, productName) {
		return vtexjs.checkout.getOrders(orderId).then(function(orders) {
			var item = [];

			$.each(orders, function(i, order) {
				item = $.each(order.items, function(index, product) {
					if (product.name === productName) {
						return product;
					}
				});
			});

			var orderDate = $.formatDatetime(orders.creationDate, '-');

			var data = {
				transaction: {
					login: {
						username: PDVBOX.username,
						password: PDVBOX.password
					},
					product: {
						// sku: 'B4D02ABANA',
						sku: item[0].refId,
						price: item[0].sellingPrice / 100
					},
					client: {
						id: PDVBOX.profileData.email
					},
					sale: {
						id: orderId,
						sale_date: orderDate
					}
				}
			};

			return $.post(PDVBOX.pdvBoxAPI + '/product/', JSON.stringify(data)).then(function(res) {
				res = JSON.parse(res);

				res.sku = item[0].refId;
				res.skuName = item[0].name;
				res.skuPrice = item[0].sellingPrice / 100;
				res.orderDate = orderDate;
				res.orderId = orderId;

				return res;
			});

		});
	},

	add: function(user, address, skuInfo, idPlan) {
		var data = {
			transaction: {
				login: {
					username: PDVBOX.username,
					password: PDVBOX.password
				},
				product: {
					// sku: 'B4D02ABANA',
					sku: skuInfo.sku,
					price: skuInfo.skuPrice
				},
				client: {
					id: PDVBOX.profileData.email,
					cpf: user.document,
					name: user.firstName + ' ' + user.lastName,
					address1: address.street,
					address2: address.complement || 'nenhum',
					addrnum: address.number,
					city: address.city,
					state: address.state,
					zip: address.postalCode,
					phone: user.phone,
					email: PDVBOX.profileData.email
				},
				sale: {
					id: skuInfo.orderId,
					store: 31,
					sale_date: $.formatDatetime(PDVBOX.dateNow, '-')
				},
				plan: {
					id: idPlan
				}
			}
		};

		return $.getJSON(CRM.omsURI + skuInfo.orderFullId).then(function (result) {
			if (result && result.packageAttachment && result.packageAttachment.packages && result.packageAttachment.packages.length > 0) {
				data.transaction.sale.sale_date = $.formatDatetime(result.packageAttachment.packages[0].issuanceDate, '-');
			}
			return $.post(PDVBOX.pdvBoxAPI + '/purchase/', JSON.stringify(data));
		});
	},

	remove: function(idPlan) {
		var data = {
			transaction: {
				login: {
					username: PDVBOX.username,
					password: PDVBOX.password
				},
				sale_coverage: {
					id: idPlan
				}
			}
		};

		return $.post(PDVBOX.pdvBoxAPI + '/purchase/cancel/', JSON.stringify(data)).done(function(res) {
			res = JSON.parse(res);
			if (res.status) {
				$('<p>Sua garantia foi cancelada com sucesso!</p>').vtexModal({
					id: 'cancelar-garantia',
					title: 'Seguro de Garantia Estendida Original',
					destroy: true
				});

				setTimeout(function() {
					location.reload();
				}, 5000);

			} else {
				if (res.message === 'Sale already canceled') {
					PDVBOX.alert('erro-cancel', 'A garantia desso produto já foi cancelada');
				} else {
					PDVBOX.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
				}
			}
		})
		.fail(function() {
			PDVBOX.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
		});
	},

	print: function(idPlan) {
		var data = {
			transaction: {
				login: {
					username: PDVBOX.username,
					password: PDVBOX.password
				}
			}
		};

		return $.post(PDVBOX.pdvBoxAPI + '/print/' + idPlan, JSON.stringify(data)).done(function(template) {
			var $template = $(template).filter('div');

			$template.find('tr:eq(0)').remove();
			$template.find('a').attr('target', '_blank').removeClass('btn').addClass('secondary-button purple-button').wrapInner('<span></span>');

			$template.filter('div').vtexModal({
				id: 'imprimir-garantia',
				title: 'Seguro de Garantia Estendida Original',
				destroy: true
			});

		}).fail(function() {
			PDVBOX.alert('erro-cancel', 'Ocorreu algum erro, tente novamente');
		});
	},

	alert: function(id, text, time) {
		var delay = time || 5000;

		$('<div class="alert-box" id="' + id + '">' + text + '</div>').hide().prependTo('body').fadeIn();
		setTimeout(function() {
			$('.alert-box#' + id).fadeOut('400', function() {
				$(this).remove();
			});
		}, delay);
	}

};

module.exports = PDVBOX;