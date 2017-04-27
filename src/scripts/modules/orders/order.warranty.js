'use strict';
var CRM = require('modules/store/crm');

require('modules/store/pdvbox');
require('../../../templates/orders/warrantySpare.btnWarranty.html');
require('../../../templates/orders/warrantySpare.btnDownloadWarranty.html');

require('../../../templates/orders/warrantySpare.modal-add.html');
require('../../../templates/orders/warrantySpare.modal-confirm.html');
require('../../../templates/orders/warrantySpare.modal-payment.html');

Nitro.module('order.warranty', ['pdvbox'], function(PDVBox) {

	var self = this,
		boxOrder = {},
		boxPlans = {},
		dateNow = new Date();

	self.setup = function() {
		$('.box-my-orders').each(function(i, e) {
			self.init(e);
		});
	};

	self.init = function(order) {
		var orderId = $(order).data('order-group');

		boxOrder[orderId] = {};
		boxOrder[orderId].id = orderId;
		boxOrder[orderId].status = $(order).data('order-status');
		boxOrder[orderId].formattedDate = $(order).data('order-date');
		boxOrder[orderId].name = $(order).data('order-name');
		boxOrder[orderId].street = $(order).data('order-street');
		boxOrder[orderId].neighborhood = $(order).data('order-neighborhood');
		boxOrder[orderId].city = $(order).data('order-city');
		boxOrder[orderId].state = $(order).data('order-state');
		boxOrder[orderId].postalCode = $(order).data('order-zipcode');
		boxOrder[orderId].complement = $(order).data('order-complement');
		boxOrder[orderId].addresstype = $(order).data('order-addressType');
		boxOrder[orderId].number = $(order).data('order-number');
		boxOrder[orderId].reference = $(order).data('order-reference');

		var orderDate = boxOrder[orderId].formattedDate.split('/');
		orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];

		boxOrder[orderId].date = orderDate;

		var timestampDays = 334*86400*1000,
			timestampOrder = new Date(orderDate).getTime(),
			limitBuyDate = $.formatDatetimeBRL(timestampDays + timestampOrder);

		boxOrder[orderId].limitBuyDate = limitBuyDate;

		self.addButton(boxOrder[orderId]);
	};

	self.addButton = function(order) {
		boxOrder[order.id].products = [];

		$('.items-' + order.id).each(function(i, e) {

			var product = {};

			product.id = $(e).data('product-id');
			product.refId = $(e).data('product-refid');
			product.name = $(e).data('product-name');
			product.price = $(e).data('product-price');
			product.quantity = $(e).data('product-quantity');
			product.bundle = $(e).data('product-bundle');
			product.index = $(e).data('product-index');

			if ($.diffDate(dateNow, order.date) <= 334 &&
			order.status !== 'Cancelado' &&
			order.status !== 'Pedido cancelado' &&
			order.status !== 'Aguardando pagamento' &&
			product.bundle.indexOf('Garantia') === -1 )
			{

				boxOrder[order.id].products.push(product);

				self.getPlan(order, product);
			}

			//caso possua gae comprada pela Vtex
			if ( order.status !== 'Cancelado' &&
			order.status !== 'Pedido cancelado' &&
			order.status !== 'Aguardando pagamento' &&
			product.bundle.indexOf('Garantia') !== -1 ) {
				self.renderDownloadVtexWarranty(order, product);
				self.cancelVtexWarranty();
				self.downloadVtexWarranty();
			}


		});
	};

	self.getPlan = function(order, product) {
		PDVBox.get(order.id, product.name).done(function(res) {
			boxPlans[order.id] = res;
			if (res.message === 'Sale found') {
				self.renderDownload(order, res, product);
				self.cancelWarranty();
				self.downloadWarranty();

			} else if (res.message === 'Coverages found') {
				self.render(order, product);
			}
		}).fail(function() {
			self.alert('erro', 'Ocorreu algum erro, tente novamente');
		});
	};

	self.render = function(order, product) {
		dust.render('warrantySpare.btnWarranty', {
			id: order.id,
			limitBuyDate: order.limitBuyDate
		}, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$('.items-' + order.id + '.item-' + product.id).after(out);
		});

		$('.add-warranty').unbind('click').click(function() {
			var orderId = $(this).data('id');
			self.openSelectWarranty(boxOrder[orderId], boxPlans[orderId]);
		});
	};

	//Renderiza botão de download de gae comprada de forma avulsa (PDVBox) nos meus Pedidos
	self.renderDownload = function(order, res, product) {
		var btnCancel = true,
			price = 'R$ ' + _.formatCurrency(res.price);

		if (res.status === 'N') {
			btnCancel = false;
			price = 'Cancelado';
		}

		var templateData = [];

		templateData.idWarranty = res.id;
		templateData.price = (price) ? price : '';
		templateData.period = (res.period) ? res.period + ' meses' : '';
		templateData.btnCancel = btnCancel;

		dust.render('warrantySpare.btnDownloadWarranty', templateData, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$('.items-' + order.id + '.item-' + product.id).after(out);
		});
	};

	//Renderiza botão de download de gae comprada pela Vtex
	self.renderDownloadVtexWarranty = function(order, product) {

		var templateData = [];
		//console.log('order', order, product);
		templateData.idWarranty = order.id;
		templateData.period = (product.bundle.indexOf('24') === -1) ? 12 : 24;
		templateData.isVtex = true;
		templateData.btnCancel = true;
		templateData.refid = product.refId;
		templateData.productIndex = product.index;

		dust.render('warrantySpare.btnDownloadWarranty', templateData, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$('.items-' + order.id + '.item-' + product.id).after(out);
		});
	};

	self.openSelectWarranty = function(order, plan) {
		$.each(plan.coverages, function(i, coverage) {
			plan.coverages[i].price = ($.isNumeric(plan.coverages[i].price)) ? _.formatCurrency(coverage.price) : plan.coverages[i].price;
		});

		dust.render('warrantySpare.modal-add', plan, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			$(out).vtexModal({
				id: 'selecione-garantia',
				title: 'Seguro de Garantia Estendida Original',
				destroy: true
			});
		});

		$('#vtex-selecione-garantia .add').click(function() {
			var idPlan = $('#coverages').val();
			self.confirmRegister(plan, idPlan);
		});
	};

	self.confirmRegister = function(skuInfo, idPlan) {
		var order = boxOrder[skuInfo.orderId];

		return CRM.clientSearchByEmail(store.userData.email).done(function(user) {

			$('#vtex-selecione-garantia .close').trigger('click');

			var address = [];

			address.street = 'Rua José de Oliveira Coelho';
			address.number = '165';
			address.complement = order.complement;
			address.neighborhood = order.neighborhood;
			address.city = 'São Paulo';
			address.state = 'São Paulo';
			address.countryName = 'Brasil';
			address.postalCode = '05727240';
			address.reference = order.reference;

			dust.render('warrantySpare.modal-confirm', $.extend({}, address, user, skuInfo), function(err, out) {
				if (err) {
					throw new Error('Modal Warranty Dust error: ' + err);
				}

				$(out).vtexModal({
					id: 'confirmar-dados-garantia',
					title: 'Seguro de Garantia Estendida Original',
					destroy: true
				});
			});

			$('#vtex-confirmar-dados-garantia .confirm').click(function() {
				self.addWarranty(user, address, skuInfo, idPlan);
			});

			$('#vtex-confirmar-dados-garantia .back').click(function() {
				self.confirmRegister(skuInfo, idPlan)
					.done(function() {
						$('#vtex-confirmar-dados-garantia .close').trigger('click');
					});
			});

		}).fail(function() {
			self.alert('erro-user', 'Ocorreu algum erro, tente novamente');
		});
	};

	self.alert = function(id, text, time) {
		var delay = time || 5000;

		$('<div class="alert-box" id="' + id + '">' + text + '</div>').hide().prependTo('body').fadeIn();
		setTimeout(function() {
			$('.alert-box#' + id).fadeOut('400', function() {
				$(this).remove();
			});
		}, delay);
	};

	self.cancelWarranty = function() {
		$('.cancel-warranty:not(.vtex)').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			PDVBox.remove(idPlan);
		});
	};

	self.cancelVtexWarranty = function() {
		$('.cancel-warranty').unbind('click').click(function() {
			var $button = $(this);
			var idPlan = $button.data('id');
			idPlan = idPlan.match( /\d+/g ).join([]);

			var data = {};
			data.cancel = true;
			data.document = store.userData.document;
			data.garantia = $(this).data('period');
			data.order = idPlan;
			data.skuRefId = $(this).data('refid');
			data.indice = $(this).data('product-index');

			CRM.insertCancelGae(data).done(function(){
				$button.replaceWith('<p class="cancel-success">Cancelamento Solicitado!</p>');
			}).fail(function(){
				self.alert('erro', 'Ocorreu algum erro, tente novamente');
			});
		});
	};

	//dpwnload de bilhete de gae comprada de forma avulsa (PDVBox) nos meus Pedidos
	self.downloadWarranty = function() {
		$('.download-warranty:not(.vtex)').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			PDVBox.print(idPlan);
		});
	};

	//dpwnload de bilhete de gae comprada pela Vtex
	self.downloadVtexWarranty = function() {
		$('.download-warranty.vtex').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			idPlan = idPlan.match( /\d+/g ).join([]);

			while (idPlan.length < 10) {
				idPlan = '0' + idPlan;
			}
			window.open('http://www.sistemagarantia.com.br/listagem?cpf=' + store.userData.document + '&id=' + idPlan + '&loja=brastemp', '_blank');
		});
	};

	self.addWarranty = function(user, address, skuInfo, idPlan) {
		PDVBox.add(user, address, skuInfo, idPlan).done(function(res) {
			res = JSON.parse(res);

			if (res.message === 'Sale inserted' || res.message === 'Sale already inserted') {
				$('#vtex-confirmar-dados-garantia .close').trigger('click');

				dust.render('warrantySpare.modal-payment', res, function(err, out) {
					if (err) {
						throw new Error('Modal Warranty Dust error: ' + err);
					}

					$(out).vtexModal({
						id: 'pagamento-garantia',
						title: 'Seguro de Garantia Estendida Original',
						destroy: true,
						static: true
					});
				});


				$('#iframe-pagamento').load(function() {
					$.get(res.link).error(function() {
						self.alert('erro-pagamento', 'Ocorreu algum erro, tente novamente');
					});
				});

				$('#vtex-pagamento-garantia .close').click(function() {
					location.reload();
				});

				$('#vtex-pagamento-garantia .back').click(function() {
					self.confirmRegister(skuInfo, idPlan)
						.done(function() {
							$('#vtex-pagamento-garantia').fadeOut('400', function() {
								$(this).remove();
							});
						});
				});
			}
		}).fail(function() {
			self.alert('erro-addplan', 'Ocorreu algum erro, tente novamente');
		});
	};

});
