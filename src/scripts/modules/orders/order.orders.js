'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('templates/myorders.html');
require('templates/orders/orderStates.html');
require('../../../templates/orders/modalHistorico.html');


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
					self.orders.orders = resultados;
					var promises = self._trackingData(resultados);

					//"promiseAll" resolve roda após ajax de todos pedidos
					$.when.apply($, promises)
						.always(function() {
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

		// Abre o modal de Histórico detalhado
		$('#historico-detalhes').click(function(e) {
			e.preventDefault();

			var id = '#modal-detalhes';

			var maskHeight = $(document).height();
			var maskWidth = $(window).width();

			$('#mask').css({'width':maskWidth,'height':maskHeight});

			$('#mask').fadeTo('slow', 0.5);
			$('#mask').css('display', 'block');

			var winH = $(window).height();
			var winW = $(window).width();

			$(id).css('top',  winH/2-$(id).height()/2);
			$(id).css('left', winW/2-$(id).width()/2);
			$(id).fadeIn();

			$('#modal-detalhes .close').click(function(e) {
				e.preventDefault();

				$('#mask').hide();
				$(id).hide();
			});

			$('#mask').click(function(e) {
				e.preventDefault();

				$(this).hide();
				$(id).hide();
			});
		});

		$('#box-all-states .more-itens').click(function(e) {
			e.preventDefault();
			$('.content-states__others').show();
			$(this).hide();
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

		//"Ver mais" modal histórico detalhado
		$('.box-all-states .more-itens').click(function(e) {
			e.preventDefault();
			$(this).siblings('.content-states__others').show();
			$(this).hide();
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
			value.isBoleto = value.paymentData.payments[0] && value.paymentData.payments[0].group ? (value.paymentData.payments[0].group.toString().indexOf('bankInvoice') >= 0  ? true : false) : false;
			value.isGift = isGift;
			value.hasTrackingInfo = false;

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
			return CRM.getOmsById(resultado.orderId)
						.then(function(dataOrder) {
							if(!dataOrder) {
								return;
							}

							$.each(self.orders.orders, function() {
								if( this.orderId === dataOrder.orderId ) {
									this.hasTrackingInfo = true;
									this.trackingInfo = dataOrder.packageAttachment.packages[0];

									// console.log('⌛', dataOrder.packageAttachment.packages[0]);

									return false;
								}
							});
						});
		});
	};
});