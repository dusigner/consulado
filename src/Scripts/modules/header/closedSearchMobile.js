require('modules/header/cotas');
require('modules/header/welcome-message');
require('modules/header/menu-hover');
require('modules/header/cart');

Nitro.module('header', ['cotas', 'welcome-message', 'menu-hover', 'cart' ], function() {
	var $body = $('body'),
		$document = $(document);

	// Menu mobile
	var topMenu = $('.menu-department'),
		menuMobile = $('.menu-mobile'),
		defaultClass = 'menu-mobile';

	topMenu.find('.dropdown > a, .icon-hamburger').click(function(e) {
		e.preventDefault();
		$(this)
			.parent()
			.toggleClass('topmenu-active');
		topMenu.toggleClass('no-border');
	});

	// Click fora do menu = close
	$(document).on('click', function(e) {
		if ($('.dropdown').is('.topmenu-active') && !$(e.target).is('.dropdown *')) {
			$('.dropdown').removeClass('topmenu-active');
			topMenu.toggleClass('no-border');
		}
		return;
	});

});
