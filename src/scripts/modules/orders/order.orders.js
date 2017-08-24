'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('templates/myorders.html');
require('templates/orders/orderStates.html');


var CRM = require('modules/store/orders-crm'),
	orderStates = require('modules/orders/order.states'),
	Estimate =  require('modules/orders/order.estimate'),
	Warranty = require('modules/orders/order.warranty');



Nitro.module('order.orders', function() {

	var self = this;

	this.$container = $('#myorders'); //Container geral
	this.$ordersContainer = $('#myorders-render'); //Container de recorrências
	this.orders = {
		orders: null,
		isLoaded: false
	}; //Status geral do módulo
	this.$modals = $('#order-modals'); //Container de modals

	/**
	 * Função bootstrap order | Carrega e atribui orders da API p/ o módulo e/ou renderiza o módulo Pedidos Feitos
	 */
	this.order = function() {
		self.$container.addClass('myorders--loading');

		if(!self.orders.orders) {
			return CRM.getOrders()
				.then(function(res) {
					return self._prepareData(res);
				})
				.then(function(resultados) {
					var promises = self._trackingData(resultados);

					//"promiseAll" resolve roda após ajax de todos pedidos
					$.when.apply($, promises)
						.always(function() {
							self.orders.orders = resultados;
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
		self.order();
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

		$('.js-single-order').each(function(i, v) {
			Warranty.init(v);
		});

		self._modals();
	};

	/**
	 * Chamadas das ações feitas por modal whpModal
	 */
	this._modals = function() {
		$('.js-order-cancel').whpModal({
			onOpen: function(step) {
				var orderId = $(this).data('order');

				$('.js-form-cancel').submit(function(e) {
					e.preventDefault();

					var $self = $(this); //clicked button

					$.crmHandler(step, function() {
						return CRM.cancelOrder(orderId, $.serializeForm($self))
								.then(function() {
									step('next');
									self.resetOrder();
								});
					});
				});
			},
			innerNav: true
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
			value.finalStatus = statusData;
			value.shippingData.logisticsInfo[0].selectedSla = currentSla;
			value.isBoleto = value.paymentData.payments[0] ? (value.paymentData.payments[0].paymentSystemName.toString().indexOf('Boleto') >= 0  ? true : false) : false;
			value.isGift = isGift;

			if(value.isBoleto && value.paymentData.payments[0].url) {
				value.paymentData.payments[0].url = value.paymentData.payments[0].url.replace('{Installment}', 	value.paymentData.payments[0].installments);
			}

			return value;
		}).sort(function(a, b) {
			return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
		});
	};

	/**
	 * Modifica/adiciona no objeto original ou preparado realizando chamadas ao MD verificando se há dados de tracking
	 * @param  {Array} data retorno da API /orders ou objeto preparado
	 * @returns {Array} Array com dados de tracking necessários para render
	 */
	this._trackingData = function(data) {
		return $.map(data, function(resultado) {
			return CRM.getOrderById(resultado.orderId)
						.then(function(sp) {
							if (!sp && !sp.Documents) {
								return false;
							}

							sp.lastChange = sp.lastChange.replace(/\+00:00$/,'-03:00');

							if (sp.finished) {
								resultado.finalStatus = orderStates.getState(resultado.isGift, 'pedidoEntregue');
							}

							resultado.trackingData = {
								description: sp.description,
								lastChange: $.formatDatetimeBRL(sp.lastChange)
							};
						});
		});
	};
});
