'use strict';
var CRM = require('modules/store/crm'),
	PDVBox = require('modules/store/crm-pdvbox'),
	ModalGae = require('modules/orders/order.modal.gae');

require('Dust/orders/warrantySpare.btnWarranty.html');
require('Dust/orders/warrantySpare.btnDownloadWarranty.html');
require('Dust/orders/warrantySpare.btnDownloadPdvBox.html');

require('Dust/orders/warrantySpare.modal-add.html');
require('Dust/orders/warrantySpare.modal-confirm.html');
require('Dust/orders/warrantySpare.modal-payment.html');

var Warranty = {
	boxOrder: {},
	boxPlans: {},
	dateNow: new Date(),
	orderObj: {},

	init: function(order, userData, orderObj) {
		var $order = $(order),
			orderId = $order.data('order-group');

		this.orderObj = orderObj;

		this.boxOrder[orderId] = {
			id: orderId,
			fullId: $(order).data('order-id'),
			status: $order.data('order-status'),
			formattedDate: $order.data('order-date'),
			name: $order.data('order-name'),
			street: $order.data('order-street'),
			neighborhood: $order.data('order-neighborhood'),
			city: $order.data('order-city'),
			state: $order.data('order-state'),
			postalCode: $order.data('order-zipcode'),
			complement: $order.data('order-complement'),
			addresstype: $order.data('order-addressType'),
			number: $order.data('order-number'),
			reference: $order.data('order-reference')
		};

		var orderDate = this.boxOrder[orderId].formattedDate.split('/');
		orderDate = orderDate[2] + '/' + orderDate[1] + '/' + orderDate[0];

		this.boxOrder[orderId].date = orderDate;

		var timestampDays = 334 * 86400 * 1000,
			timestampOrder = new Date(orderDate).getTime(),
			limitBuyDate = $.formatDatetimeBRL(timestampDays + timestampOrder);

		this.boxOrder[orderId].limitBuyDate = limitBuyDate;

		if (userData) {
			this.profileData = userData;
			this.addButton(this.boxOrder[orderId], order);
		} else {
			this.alert('erro-user', 'Ocorreu algum erro, tente novamente');
		}
	},

	addButton: function(order, orderElem) {
		Warranty.boxOrder[order.id].products = [];

		if (
			order.status !== 'Cancelado' &&
			order.status !== 'Pedido cancelado' &&
			order.status !== 'Aguardando pagamento' &&
			order.status !== 'Processamento' &&
			order.status !== 'Processando Pagamento'
		) {
			$(orderElem)
				.find('.js-order-item')
				.not('.order__hide--desk')
				.each(function() {
					var product = {},
						$selfProduct = $(this);

					product.id = $selfProduct.data('product-id');
					product.refId = $selfProduct.data('product-refid');
					product.name = $selfProduct.data('product-name');
					product.price = $selfProduct.find('.total-price').text();
					product.price = $selfProduct.data('product-price');
					product.quantity = $selfProduct.data('product-quantity');
					// prettier-ignore
					product.bundle = $selfProduct.data('product-bundle')
						? {
							name: $selfProduct.data('product-bundle'),
							quantity: $selfProduct.data('product-bundle-quantity'),
							price: $selfProduct.data('product-bundle-price')
						}
						: false;
					product.index = $selfProduct.data('product-index');

					if ($.diffDate(Warranty.dateNow, order.date) <= 334 && !product.bundle) {
						Warranty.boxOrder[order.id].products.push(product);
						Warranty.getPlan(order, product);
					}

					//caso possua gae comprada pela Vtex
					if (product.bundle) {
						Warranty.renderDownloadVtexWarranty(order, product);
						Warranty.cancelVtexWarranty();
						Warranty.downloadVtexWarranty();
					}
				});
		}
	},

	getPlan: function(order, product) {
		if (!Warranty.boxPlans[order.id]) {
			Warranty.boxPlans[order.id] = {};
		}

		PDVBox.get(order.id, product, this.orderObj)
			.done(function(res) {
				res.orderFullId = order.fullId;
				Warranty.boxPlans[order.id][product.id] = res;

				if (res.message === 'Sale found') {
					Warranty.renderDownload(order, res, product);
					Warranty.cancelWarranty();
					Warranty.downloadWarranty();
				} else if (res.message === 'Coverages found') {
					Warranty.render(order, product);
				}
			})
			.fail(function() {
				Warranty.alert('erro', 'Ocorreu algum erro, tente novamente');
			});
	},

	render: function(order, product) {
		dust.render(
			'warrantySpare.btnWarranty',
			{
				id: order.id,
				limitBuyDate: order.limitBuyDate,
				product: product.id
			},
			function(err, out) {
				if (err) {
					throw new Error('Modal Warranty Dust error: ' + err);
				}

				var $actionSection = $(
					'.order__items--' + order.id + '.order__item--' + product.id + ' .js-action-warranty'
				);

				if ($actionSection.html().length <= 0) {
					$actionSection.append(out);
				}
			}
		);

		$('.add-warranty')
			.unbind('click')
			.click(function() {
				var orderId = $(this).data('id'),
					productId = $(this).data('product');
				Warranty.openSelectWarranty(Warranty.boxOrder[orderId], Warranty.boxPlans[orderId][productId]);
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
		templateData.price = price ? price : '';
		templateData.period = res.period ? res.period + ' meses' : '';
		templateData.btnCancel = btnCancel;
		templateData.refid = 'none';
		templateData.productIndex = 'none';

		dust.render('warrantySpare.btnDownloadPdvBox', templateData, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			var $section = $('.order__items--' + order.id + '.order__item--' + product.id).first();

			if ($section.next('.order__service').length <= 0) {
				$section.after(out);
			}
		});
	},

	renderDownloadVtexWarranty: function(order, product) {
		var templateData = [];
		//console.log('order', order, product);
		templateData.idWarranty = order.id;
		templateData.bundle = {
			period: product.bundle.name.indexOf('24') === -1 ? 12 : 24,
			name: product.bundle.name,
			quantity: product.bundle.quantity,
			price: product.bundle.price
		};
		templateData.isVtex = true;
		templateData.btnCancel = true;
		templateData.refid = product.refId;
		templateData.productIndex = product.index;

		dust.render('warrantySpare.btnDownloadWarranty', templateData, function(err, out) {
			if (err) {
				throw new Error('Modal Warranty Dust error: ' + err);
			}

			var $section = $('.order__items--' + order.id + '.order__item--' + product.id).first();

			if ($section.next('.order__service').length <= 0) {
				$section.after(out);
			}

			// if( $actionSection.html().length <= 0 ) {
			// 	$actionSection.append(out);
			// }

			// if( $('.items-' + order.id + '.item-' + product.id + ' .action-buttons' ).length <= 0 ) {
			// 	$('.items-' + order.id + ' .quantity-price, .items-' + order.id + ' + .order__service .quantity-price').after('<td class="action-buttons"></td>');
			// }
			// $('.items-' + order.id + '.item-' + product.id + ' + .order__service .bundle-quantity-price + .action-buttons').append(out);
		});
	},

	openSelectWarranty: function(order, plan) {
		$.each(plan.coverages, function(i, coverage) {
			plan.coverages[i].price = $.isNumeric(plan.coverages[i].price)
				? _.formatCurrency(coverage.price)
				: plan.coverages[i].price;
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

		return CRM.clientSearchByEmail(Warranty.profileData.email)
			.done(function(user) {
				//check phone
				// if (!user.phone) {
				// 	user.phone = user.homePhone;
				// }

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
					Warranty.confirmRegister(skuInfo, idPlan).done(function() {
						$('#vtex-confirmar-dados-garantia .close').trigger('click');
					});
				});
			})
			.fail(function() {
				Warranty.alert('erro-user', 'Ocorreu algum erro, tente novamente');
			});
	},

	alert: function(id, text, time) {
		var delay = time || 5000;

		$('<div class="alert-box" id="' + id + '">' + text + '</div>')
			.hide()
			.prependTo('body')
			.fadeIn();
		setTimeout(function() {
			$('.alert-box#' + id).fadeOut('400', function() {
				$(this).remove();
			});
		}, delay);
	},

	cancelWarranty: function() {
		$('.cancel-warranty:not(.vtex)')
			.unbind('click')
			.click(function() {
				var idPlan = $(this).data('id');

				ModalGae.requestCancel(null, function() {
					$('.js-modal-gae-confirm').click(function() {
						PDVBox.remove(idPlan);
					});
				});
			});
	},

	cancelVtexWarranty: function() {
		$('.cancel-warranty.vtex')
			.unbind('click')
			.click(function() {
				var $button = $(this);
				var idPlan = $button.data('id');
				idPlan = idPlan.match(/\d+/g).join([]);

				var data = {};
				data.name = store.userData.firstName + ' ' + store.userData.lastName;
				data.email = store.userData.email;
				data.cancel = true;
				data.document = Warranty.profileData.document;
				data.garantia = $button.data('period');
				data.order = idPlan;
				data.skuRefId = $button.data('refid');
				data.indice = $button.data('product-index');

				ModalGae.requestCancel(data, function(changeStep, close, data) {
					$('.js-modal-gae-confirm').click(function() {
						CRM.insertCancelGae(data)
							.done(function() {
								changeStep();

								$button.replaceWith(
									'<p class="cancel-warranty cancel-success">Cancelamento Solicitado!</p>'
								);

								setTimeout(function() {
									if ($('.modal-gae__mask').length > 0) {
										close();
									}
								}, 1000 * 10);
							})
							.fail(function() {
								close();
								Warranty.alert('erro', 'Ocorreu algum erro, tente novamente');
							});
					});
				});
			});
	},

	downloadWarranty: function() {
		$('.download-warranty:not(.vtex)')
			.unbind('click')
			.click(function() {
				var idPlan = $(this).data('id');
				PDVBox.print(idPlan);
			});
	},

	downloadVtexWarranty: function() {
		$('.download-warranty.vtex')
			.unbind('click')
			.click(function() {
				var $self = $(this),
					idPlan = $self.data('id');

				idPlan = idPlan.match(/\d+/g).join([]);

				while (idPlan.length < 10) {
					idPlan = '0' + idPlan;
				}

				var dataClient = Warranty.profileData;

				var data = {};
				data.name = dataClient.firstName + ' ' + dataClient.lastName;
				data.email = dataClient.email;
				data.request = true;
				data.document = dataClient.document;
				data.garantia = $self.data('period');
				data.order = idPlan;
				data.skuRefId = $self.data('refid');
				data.indice = $self.data('product-index');

				ModalGae.requestTerms(data, function(changeStep, close, data) {
					$('.js-modal-gae-confirm').click(function() {
						CRM.insertTermsGae(data)
							.done(function() {
								changeStep();

								$self.replaceWith(
									'<span class="download-warranty request-success">Termo Solicitado!</span>'
								);

								setTimeout(function() {
									if ($('.modal-gae__mask').length > 0) {
										close();
									}
								}, 1000 * 10);
							})
							.fail(function() {
								close();
								Warranty.alert('erro', 'Ocorreu algum erro, tente novamente');
							});
					});
				});

				// window.open('http://www.sistemagarantia.com.br/listagem?cpf=' + Warranty.profileData.document + '&id=' + idPlan + '&loja=brastemp', '_blank');
			});
	},

	addWarranty: function(user, address, skuInfo, idPlan) {
		PDVBox.add(user, address, skuInfo, idPlan)
			.done(function(res) {
				res = JSON.parse(res);

				if (
					res.message === 'Sale inserted' ||
					res.message === 'Sale already inserted' ||
					res.message === 'Esta venda já esta cadastrada, mas não foi paga. segue o link para o pagamento'
				) {
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
						Warranty.confirmRegister(skuInfo, idPlan).done(function() {
							$('#vtex-pagamento-garantia').fadeOut('400', function() {
								$(this).remove();
							});
						});
					});
				}
			})
			.fail(function() {
				Warranty.alert('erro-addplan', 'Ocorreu algum erro, tente novamente');
			});
	}
};

module.exports = Warranty;
