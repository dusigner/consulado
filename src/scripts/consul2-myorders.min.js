/* global store: true */

'use strict';

//load Nitro Lib
require('vendors/nitro');

require('modules/orders/order.orders');
require('modules/orders/order.recurrences');

Nitro.setup(['order.orders', 'order.recurrences'], function(orders, recurrences) {

	var self = this;

	this.$container = $('#myorders'); //Container geral
	this.$ordersContainer = $('#myorders-render'); //Container de pedidos
	this.$recurrencesContainer = $('#recurrences-render'); //Container de recorrências

	/**
	 * Função bootstrap app | Inicia carregando e renderizando pedidos (módulo order.orders.js) e eventos das tabs de alterar tela Pedidos Feitos - Recorrências
	 *  @returns {undefined} Retorno vazio
	 */
	this.init = function() {
		orders.order();

		$('.js-link-orders').click(function(e) {
			e.preventDefault();

			if(self.$container.hasClass('myorders--loading')) {
				return false;
			}

			var $title = $('.js-page-title'),
				$self = $(this);

			self.$ordersContainer.add(self.$recurrencesContainer).addClass('hide');

			if( $self.data('link') === 'orders' ) {
				self.$ordersContainer.removeClass('hide');

				if(!orders.orders.isLoaded) {
					orders.order();
				}

				$title.text('Pedidos feitos');
			}

			if( $self.data('link') === 'recurrence' ) {
				self.$recurrencesContainer.removeClass('hide');

				if(!recurrences.recurrences.isLoaded) {
					recurrences.recurrence();
				}

				$title.text('Recorrências');
			}

			return;
		});
	};

	this.init();
});