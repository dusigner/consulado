'use strict';

//load Nitro Lib
require('vendors/nitro');

require('vendors/jquery.cookie');
require('modules/orders/order.orders');
require('modules/orders/order.recurrences');
require('modules/orders/order.favoritos');

Nitro.setup(['order.orders', 'order.recurrences', 'order.favoritos'], function(orders, recurrences, favoritos) {
	var $container = $('#myorders'), //Container geral
		modules = {
			orders: orders,
			recurrences: recurrences,
			favoritos: favoritos
		};

	/**
	 * Função bootstrap app | Inicia carregando e renderizando pedidos (módulo order.orders.js) e eventos das tabs de alterar tela Pedidos Feitos - Recorrências
	 */
	this.init = function() {
		orders.init();

		$('.js-link-orders').click(function(e) {
			e.preventDefault();

			if ($container.hasClass('myorders--loading')) {
				return false;
			}

			var $title = $('.js-page-title'),
				$self = $(this),
				link = $self.data('link');

			$('.js-myorders-generic-render').addClass('hide');
			modules[link]['$' + link + 'Container'].removeClass('hide');
			$title.text($self.text());

			if (!modules[link][link].isLoaded) {
				modules[link].init();
			}

		});

		$('.myorders__page-item a').click(function(e) {
			e.preventDefault();
			$('a').removeClass('link-active');
			$(this).addClass('link-active');
		});

		$('#dropmenu').click (function() {
			$('#ul li').fadeToggle();
		});

		$('#dropmenu').on('click', function() {
			$(this).toggleClass('link-active');
			$('.js-link-orders').toggleClass('link-active');
		});
		// $('.drop-box').click(function(){
		// 	$('.rotate').toggleClass('down');
		// });
	};

	$(window).on('load', () => this.init());
});
