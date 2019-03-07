/* global store: true */

'use strict';

//load Nitro Lib
require('vendors/nitro');

require('vendors/jquery.cookie');
require('modules/orders/order.orders');
require('modules/orders/order.recurrences');

Nitro.setup(['order.orders', 'order.recurrences'], function(orders, recurrences) {

	var $container = $('#myorders'), //Container geral
		modules = {
			orders: orders,
			recurrences: recurrences
		};

	/**
	 * Função bootstrap app | Inicia carregando e renderizando pedidos (módulo order.orders.js) e eventos das tabs de alterar tela Pedidos Feitos - Recorrências
	 */
	this.init = function() {
		orders.init();

		$('.js-link-orders').click(function(e) {
			e.preventDefault();

			if($container.hasClass('myorders--loading')) {
				return false;
			}

			var $title = $('.js-page-title'),
				$self = $(this),
				link = $self.data('link');

			$('.js-myorders-generic-render').addClass('hide');
			modules[link]['$' + link + 'Container'].removeClass('hide');
			$title.text( $self.text() );

			if(!modules[link][link].isLoaded) {
				modules[link].init();
			}
		});
	};

	this.init();
});