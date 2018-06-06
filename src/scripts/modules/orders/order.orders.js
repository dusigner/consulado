'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('templates/myorders.html');
require('templates/orders/orderPedidoStates.html');
require('templates/orders/orderPackageStates.html');
require('templates/orders/orderPackageItems.html');
require('templates/orders/orderProductInfos.html');
require('../../../templates/orders/modalHistorico.html');
require('../../../templates/orders/modalInvoice.html');

var Clipboard = require('clipboard');

var CRM = require('modules/store/orders-crm'),
	orderStates = require('modules/orders/order.states'),
	Estimate =  require('modules/orders/order.estimate'),
	Warranty = require('modules/orders/order.warranty');

Nitro.module('order.orders', function() {

	var self = this;

	this.$container = $('#myorders'); //Container geral
	this.$ordersContainer = $('#orders-render'); //Container de pedidos
	this.orders = {
		orders: null,
		isLoaded: false
	}; //Status geral do módulo
	this.$modals = $('#order-modals'); //Container de modals

	/**
	 * Função bootstrap order | Carrega e atribui orders da API p/ o módulo e/ou renderiza o módulo Pedidos Feitos
	 */
	this.init = function() {
		self.$container.addClass('myorders--loading');

		if(!self.orders.orders) {
			return CRM.getOrders()
				.then(function(res) {
					return self._prepareData(res);
				})
				.then(function(resultados) {
					self.orders.orders = resultados;
					var promises = !store.isTelevendas ? self._trackingData(resultados) : null;

					//"promiseAll" resolve roda após ajax de todos pedidos
					$.when.apply($, promises)
						.always(function() {
							// console.log('🚨🚨🚨', resultados);
							self.orderRender(resultados);
						});
				});
		} else {
			self.orderRender(self.orders.orders);
		}
	};

	/**
	 * Reseta módulo de pedidos
	 */
	this.resetOrder = function() {
		self.orders.orders = null;
		self.orders.isLoaded = false;
		self.$ordersContainer.find('*').unbind();
		self.$ordersContainer.html('');
		self.init();
	};

	/**
	 * Dust render do módulo e invocação dos métodos bind de eventos
	 * @param  {Array} data retorno da API /orders ou objeto preparado para render no dust
	 */
	this.orderRender = function(data) {
		dust.render('myorders', data, function(err, out) {
			self.$container.removeClass('myorders--loading');
			self.orders.isLoaded = true;

			if (err) {
				throw new Error('Modal Orders Dust error: ' + err);
			}

			self.$ordersContainer.append(out);

			self._events();
		});
	};

	this._getUserData = function() {
		var dfd = jQuery.Deferred();

		if(store && store.userData && store.userData.email) {
			dfd.resolve(store.userData);
		} else {
			vtexjs.checkout.getOrderForm().done(function(res){
				dfd.resolve(res.clientProfileData);
			});
		}

		return dfd.promise();
	};

	/**
	 * Bind eventos do módulo renderizado, requests iniciando botões de GAE
	 */
	this._events = function() {
		self.$ordersContainer.find('.js-toggle-orders').first().removeClass('order__header--closed').next('.js-toggle-container').css('display', 'block');

		self.$ordersContainer.find('.js-toggle-orders').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('order__header--closed');
			$(this).next('.js-toggle-container').stop().stop().slideToggle();
		});

		self.$ordersContainer.find('.custom-accordion-mp-header').click(function(e) {
			e.preventDefault();
			$(this).toggleClass('active');
			$(this).next('.custom-accordion-mp-content').stop().stop().slideToggle();
		});

		self._getUserData()
			.then(function(userData) {
				$('.js-single-order').each(function(i, v) {
					var $self = $(this),
						selfOrder = self.orders.orders.filter(function(order) {
							return order.orderId === $self.data('order-id');
						})[0];

					Warranty.init(v, userData, selfOrder);
				});
			});

		self._modals();
	};

	/**
	 * Chamadas das ações feitas por modal whpModal
	 */
	this._modals = function() {

		// Abre o modal de Histórico detalhado
		$('.historico-detalhes').click(function(e) {
			e.preventDefault();

			var $modal = $(this).siblings('.modal-detalhes');

			var maskHeight = $(document).height();
			var maskWidth = $(window).width();

			$('#mask').css({'width':maskWidth,'height':maskHeight});

			$('#mask').fadeTo('slow', 0.5);
			$('#mask').css('display', 'block');

			$modal.fadeIn();

			$modal.find('.close').click(function(e) {
				e.preventDefault();

				$('#mask').hide();
				$modal.hide();
			});

			$('#mask').click(function(e) {
				e.preventDefault();

				$(this).hide();
				$modal.hide();
			});
		});

		$('.js-invoicekey').click(function(e) {
			e.preventDefault();

			var $modal = $(this).siblings('.modal-invoice');

			$modal.clone().vtexModal({
				id: 'invoice',
				title: '2ª via de nota fiscal',
				destroy: true,
				open: function($modal) {
					var $clipboard = $modal.find('.js-invoice-clipboard');

					$clipboard.one('click', function(e) {
						e.preventDefault();

						var invoiceKey = $(this).parents().find('.js-invoice-value').val(),
							clipboard = new Clipboard(e.target, {
								text: function() {
									return invoiceKey;
								}
							}),
							textTimeout = 0;

						clipboard.on('success', function(e) {
							if(textTimeout) {
								clearTimeout(textTimeout);
							} //debounce

							e.trigger.textContent = 'Chave copiada!';
							e.clearSelection();

							textTimeout = setTimeout(function() {
								e.trigger.textContent = 'Copiar chave de acesso';
							}, 1500);
						});
					}).click(); //TODO - rerererer mim ajuda clipboard (Hack pq o clipboard só estava funcionando depois do primeiro click, tem que ver issoai hein)
				}
			});
		});
	};

	/**
	 * Modificações no objeto original da api /orders preparando, ordenando e adicionando informações para o render
	 * @param  {Array} data retorno da API /orders
	 * @returns {Array} Array de objetos com resultado parseado
	 */
	this._prepareData = function(data) {
		return $.map(data, function(value) {
			var shippingMethod = (value.shippingData.logisticsInfo[0]) ? value.shippingData.logisticsInfo[0].selectedSla : '',
				slas = (value.shippingData.logisticsInfo[0]) ? value.shippingData.logisticsInfo[0].slas : '',
				currentSla = Estimate.getSla(shippingMethod, slas),
				orderEstimateDate = Estimate.calculateSla(value.creationDate, currentSla),
				isGift = (value.giftRegistryData && value.giftRegistryData.giftRegistryTypeName === 'Lista de Casamento'),
				statusData = orderStates.getState(isGift, value.state);

			statusData.estimate = orderEstimateDate;

			value.shippingData.logisticsInfo[0].selectedSla = currentSla;
			value.finalStatus = statusData;
			value.isBoleto = value.paymentData.transactions[0].payments[0] && value.paymentData.transactions[0].payments[0].group ? (value.paymentData.transactions[0].payments[0].group.toString().indexOf('bankInvoice') >= 0 ? true : false) : false;
			value.isGift = isGift;
			value.hasTrackingInfo = false;
			value.hasPackages = false;
			value.hasInvoiceData = false;
			value.partialInvoice = false;

			if (value.isBoleto && value.paymentData.transactions[0].payments[0].url) {
				value.paymentData.transactions[0].payments[0].url = value.paymentData.transactions[0].payments[0].url.replace('{Installment}', value.paymentData.transactions[0].payments[0].installments);
			}

			$.each(value.items, function() {
				this.finalStatus = orderStates.getState(null, this.orderRewardStatus);
			});

			return value;
		}).sort(function(a, b) {
			return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
		});
	};

	/**
	 * Modifica/adiciona no objeto original (ou preparado) realizando chamadas a API do OMS verificando se há dados de tracking e nota fiscal e separação de "pacotes"
	 * @param  {Array} data retorno da API /orders ou objeto preparado
	 * @returns {Array} Array com dados de package necessários para render
	 */
	this._trackingData = function(data) {
		return $.map(data, function(resultado) {
			if ( resultado.finalStatus.orderLabel !== 'Processamento' &&
					resultado.finalStatus.orderLabel !== 'Faturado' &&
					resultado.finalStatus.orderLabel !== 'Entregue' ) {
				return false;
			}

			return CRM.getOmsById(resultado.orderId)
						.then(function(dataOrder) {
							if(!dataOrder) {
								return;
							}

							$.each(self.orders.orders, function() {
								if( this.orderId === dataOrder.orderId ) {
									var self = this;

									self.packages = dataOrder.packageAttachment && dataOrder.packageAttachment.packages;
									self.hasPackages = self.packages.length > 1; // Mais de 1 pacote para separação no layout

									// Tem pacotes
									if(self.packages && self.packages.length > 0) {
										var finished = [],
											packagesSum = 0;

										$.each(self.packages, function(index, singlePackage) {
											// itera entre itens do pacote, marcando status
											$.each(singlePackage.items, function() {
												var itemObject = self.items[this.itemIndex];

												itemObject.hidden = true;

												// Flag Pedido Entregue
												// itemObject.finalStatus = orderStates.getState(null, singlePackage.courierStatus.finished ? 'pedidoEntregue' : itemObject.orderRewardStatus);
											});

											packagesSum = packagesSum + singlePackage.invoiceValue;

											// Verifica se existe dados de tracking para botão "rastrear entrega"
											if( singlePackage.courierStatus
												&& singlePackage.courierStatus.data
												&& singlePackage.courierStatus.data.length > 0) {

												singlePackage.courierStatus.data = singlePackage.courierStatus.data.reverse();

												self.hasTrackingInfo = true;

												finished.push(singlePackage.courierStatus.finished);
											}

											// Existe chave de nota fiscal para exibir botão no front
											if(singlePackage.invoiceKey && singlePackage.invoiceKey.length > 0) {
												self.hasInvoiceData = true;
											}
										});

										// Verifica se TODOS os pacotes estão finalizados/entregues para trocar o status geral do pedido para Entregue
										if(finished.length > 0 && $.inArray(false, finished) < 0) {
											self.finalStatus = orderStates.getState(self.isGift, 'pedidoEntregue');
										}

										// Verifica se a soma de todos pacotes é diferente do total do pedido, identificando se ainda falta algum produto para ser faturado
										if(packagesSum !== self.value) {
											self.hasPackages = true;
											self.partialInvoice = true;
										}
									}

									return false;
								}
							});
						});
		});
	};
});