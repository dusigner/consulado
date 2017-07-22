'use strict';

alert(0);

var CRM = require('modules/store/crm'),
	PDVBox = require('modules/store/pdvbox'),
	ModalGae = require('modules/orders/order.modal.gae');

require('../../../templates/orders/warrantySpare.btnWarranty.html');
require('../../../templates/orders/warrantySpare.btnDownloadWarranty.html');
require('../../../templates/orders/warrantySpare.btnDownloadPdvBox.html');

require('../../../templates/orders/warrantySpare.modal-add.html');
require('../../../templates/orders/warrantySpare.modal-confirm.html');
require('../../../templates/orders/warrantySpare.modal-payment.html');

var Warranty = {
	self: this,
	boxOrder: {},
	boxPlans: {},
	dateNow: new Date(),
	profileData: {},

	init: function(order) {
		var orderId = $(order).data('order-group');

		Warranty.boxOrder[orderId] = {};
		Warranty.boxOrder[orderId].id = orderId;
		Warranty.boxOrder[orderId].status = $(order).data('order-status');
		Warranty.boxOrder[orderId].formattedDate = $(order).data('order-date');
		Warranty.boxOrder[orderId].name = $(order).data('order-name');
		Warranty.boxOrder[orderId].street = $(order).data('order-street');
		Warranty.boxOrder[orderId].neighborhood = $(order).data('order-neighborhood');
		Warranty.boxOrder[orderId].city = $(order).data('order-city');
		Warranty.boxOrder[orderId].state = $(order).data('order-state');
		Warranty.boxOrder[orderId].postalCode = $(order).data('order-zipcode');
		Warranty.boxOrder[orderId].complement = $(order).data('order-complement');
		Warranty.boxOrder[orderId].addresstype = $(order).data('order-addressType');
		Warranty.boxOrder[orderId].number = $(order).data('order-number');
		Warranty.boxOrder[orderId].reference = $(order).data('order-reference');

		var orderDate = Warranty.boxOrder[orderId].formattedDate.split('/');
		orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];

		Warranty.boxOrder[orderId].date = orderDate;

		var timestampDays = 334*86400*1000,
			timestampOrder = new Date(orderDate).getTime(),
			limitBuyDate = $.formatDatetimeBRL(timestampDays + timestampOrder);

		Warranty.boxOrder[orderId].limitBuyDate = limitBuyDate;

		vtexjs.checkout.getOrderForm().done(function(res){
			Warranty.profileData = res.clientProfileData;
			Warranty.addButton(Warranty.boxOrder[orderId], order);
		}).fail(function() {
			Warranty.alert('erro-user', 'Ocorreu algum erro, tente novamente');
		});

	},

	addButton: function(order, orderElem) {
		Warranty.boxOrder[order.id].products = [];

		$(orderElem).find('.cart-items .product-item').each(function() {

			var product = {},
				$selfProduct = $(this);


			product.id = $selfProduct.data('product-id');
			product.refId = $selfProduct.data('product-refid');
			product.name = $selfProduct.data('product-name');
			product.price = $selfProduct.find('.total-price').text();
			product.price = $selfProduct.data('product-price');
			product.quantity = $selfProduct.data('product-quantity');
			product.bundle = $selfProduct.data('product-bundle');
			product.index = $selfProduct.data('product-index');

			if ($.diffDate(Warranty.dateNow, order.date) <= 334 &&
			order.status !== 'Cancelado' &&
			order.status !== 'Pedido cancelado' &&
			order.status !== 'Aguardando pagamento' &&
			order.status !== 'Processando Pagamento' &&
			$(this).siblings('.item-service').length <= 0 )
			{

				Warranty.boxOrder[order.id].products.push(product);

				Warranty.getPlan(order, product);
			}

			//caso possua gae comprada pela Vtex
			if ( order.status !== 'Cancelado' &&
			order.status !== 'Pedido cancelado' &&
			order.status !== 'Aguardando pagamento' &&
			order.status !== 'Processando Pagamento' &&
			$(this).siblings('.item-service').length > 0 ) {
				Warranty.renderDownloadVtexWarranty(order, product);
				Warranty.cancelVtexWarranty();
				Warranty.downloadVtexWarranty();
			}


		});
	},

	getPlan: function(order, product) {
		PDVBox.get(order.id, product.name).done(function(res) {
			Warranty.boxPlans[order.id] = res;
			if (res.message === 'Sale found') {
				Warranty.renderDownload(order, res, product);
				Warranty.cancelWarranty();
				Warranty.downloadWarranty();

			} else if (res.message === 'Coverages found') {
				Warranty.render(order, product);
			}
		}).fail(function() {
			Warranty.alert('erro', 'Ocorreu algum erro, tente novamente');
		});
	},

	render: function(order, product) {
		dust.render('warrantySpare.btnWarranty', {
			id: order.id,
			limitBuyDate: order.limitBuyDate
		}, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			if( $('.items-' + order.id + '.item-' + product.id + ' .action-buttons' ).length <= 0 ) {
				$('.items-' + order.id + ' .quantity-price, .items-' + order.id + ' + .item-service .quantity-price').after('<td class="action-buttons"></td>');
			}
			$('.items-' + order.id + '.item-' + product.id + ' .action-buttons').append(out);
		});

		$('.add-warranty').unbind('click').click(function() {
			var orderId = $(this).data('id');
			Warranty.openSelectWarranty(Warranty.boxOrder[orderId], Warranty.boxPlans[orderId]);
		});
	},

	renderDownload: function(order, res, product) {
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
		templateData.refid = 'none';
		templateData.productIndex = 'none';

		dust.render('warrantySpare.btnDownloadPdvBox', templateData, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}
			if( $('.items-' + order.id + '.item-' + product.id + ' .action-buttons' ).length <= 0 ) {
				$('.items-' + order.id + ' .quantity-price').after('<td class="action-buttons"></td>');
			}
			$('.items-' + order.id + '.item-' + product.id).after(out);
		});
	},

	renderDownloadVtexWarranty: function(order, product) {

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
			if( $('.items-' + order.id + '.item-' + product.id + ' .action-buttons' ).length <= 0 ) {
				$('.items-' + order.id + ' .quantity-price, .items-' + order.id + ' + .item-service .quantity-price').after('<td class="action-buttons"></td>');
			}
			$('.items-' + order.id + '.item-' + product.id + ' + .item-service .bundle-quantity-price + .action-buttons').append(out);
		});
	},

	openSelectWarranty: function(order, plan) {
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
			Warranty.confirmRegister(plan, idPlan);
		});
	},

	confirmRegister: function(skuInfo, idPlan) {
		var order = Warranty.boxOrder[skuInfo.orderId];

		return CRM.clientSearchByEmail(Warranty.profileData.email).done(function(user) {

			$('#vtex-selecione-garantia .close').trigger('click');

			var address = [];

			address.street = order.street;
			address.number = order.number;
			address.complement = order.complement;
			address.neighborhood = order.neighborhood;
			address.city = order.city;
			address.state = order.state;
			address.countryName = 'Brasil';
			address.postalCode = order.postalCode;
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
				Warranty.addWarranty(user, address, skuInfo, idPlan);
			});

			$('#vtex-confirmar-dados-garantia .back').click(function() {
				Warranty.confirmRegister(skuInfo, idPlan)
					.done(function() {
						$('#vtex-confirmar-dados-garantia .close').trigger('click');
					});
			});

		}).fail(function() {
			Warranty.alert('erro-user', 'Ocorreu algum erro, tente novamente');
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
	},

	cancelWarranty: function() {
		$('.cancel-warranty:not(.vtex)').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			PDVBox.remove(idPlan);
		});
	},

	cancelVtexWarranty: function() {
		$('.cancel-warranty').unbind('click').click(function() {
			var $button = $(this);
			var idPlan = $button.data('id');
			idPlan = idPlan.match( /\d+/g ).join([]);

			var data = {};
			data.cancel = true;
			data.document = Warranty.profileData.document;
			data.garantia = $(this).data('period');
			data.order = idPlan;
			data.skuRefId = $(this).data('refid');
			data.indice = $(this).data('product-index');

			CRM.insertCancelGae(data).done(function(){
				$button.replaceWith('<p class="cancel-success">Cancelamento Solicitado!</p>');
			}).fail(function(){
				Warranty.alert('erro', 'Ocorreu algum erro, tente novamente');
			});
		});
	},

	downloadWarranty: function() {
		$('.download-warranty:not(.vtex)').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			PDVBox.print(idPlan);
		});
	},

	downloadVtexWarranty: function() {
		$('.download-warranty.vtex').unbind('click').click(function() {
			var idPlan = $(this).data('id');
			idPlan = idPlan.match( /\d+/g ).join([]);

			while (idPlan.length < 10) {
				idPlan = '0' + idPlan;
			}

			ModalGae.requestTerms(idPlan, function(changeStep) {
				console.log('do something');
				changeStep();
			});

			// window.open('http://www.sistemagarantia.com.br/listagem?cpf=' + Warranty.profileData.document + '&id=' + idPlan + '&loja=consul', '_blank');
		});
	},

	addWarranty: function(user, address, skuInfo, idPlan) {
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
						Warranty.alert('erro-pagamento', 'Ocorreu algum erro, tente novamente');
					});
				});

				$('#vtex-pagamento-garantia .close').click(function() {
					location.reload();
				});

				$('#vtex-pagamento-garantia .back').click(function() {
					Warranty.confirmRegister(skuInfo, idPlan)
						.done(function() {
							$('#vtex-pagamento-garantia').fadeOut('400', function() {
								$(this).remove();
							});
						});
				});
			}
		}).fail(function() {
			Warranty.alert('erro-addplan', 'Ocorreu algum erro, tente novamente');
		});
	}
};

module.exports = Warranty;