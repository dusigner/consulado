/* global $: true, Nitro: true, vtexid: true */
'use strict';

require('modules/cart');
require('modules/search');
require('modules/menu-hover');
require('vendors/jquery.cookie');

Nitro.module('header', ['menu-hover'], function() {
	var $body = $('body'),
		$document = $(document);

	// Menu mobile
	var topMenu = $('.menu-department'),
		menuMobile = $('.menu-mobile'),
		defaultClass = 'menu-mobile show-extra-small';

	topMenu.find('.dropdown > a, .icon-hamburger').click(function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('topmenu-active');
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

	menuMobile.find('.open-menu-mobile').click(function(e) {
		e.preventDefault();

		if (menuMobile.hasClass('menu-active')) {
			menuMobile
				.removeClass()
				.addClass(defaultClass);

			$('header').removeClass('menu-scroll');
			$('header.blackfriday').height(100);
		} else {
			menuMobile.addClass('menu-active');

			var altura = $(window).height();

			$('body').find('.menu-active').parent().parent().parent().addClass('menu-scroll');
			$('body').find('.menu-active').parent().parent().parent().height(altura);
		}
	});

	//controle menu horizontal
	var controleOver = $('.customItemMenu').text();

	if (controleOver === '') {
		$('.customItemMenu').addClass('control-hide');
	} else {
		$('nav .item.control').addClass('control-hide');
		$('nav .item').removeClass('control');
		$('.customItemMenu').css('display', 'inline-block');
	}


	//TODO: move mask to module;
	$('.mask').on('click', function(e) {
		e.preventDefault();

		if ($body.is('.cart-active')) {
			$document.trigger('cart', false);
		}

		if ($body.is('.search-active')) {
			$document.trigger('search', false);
		}

		//TODO: remove class regexp;
		$body.removeClass('menu-active');
	});

	$document
		.on('cart', function() {

			$body.toggleClass('cart-active');

		}).on('search', function(e, status) {

			$body.toggleClass('search-active', !!status);
		});


	//add action to close button from vtex login
	$('body.login').on('click', '.vtexIdUI-close', function() {
		window.location.href = '/';
	});


	window.vtexjs.checkout.getOrderForm().done(function(result) {
		var orderForm = result;

		if (orderForm.clientProfileData.email) {
			$('.logout').removeClass('hide');
		}
	});

	menuMobile.find('.sub-itens > a').on('click',function(e) {
		e.preventDefault();

		$(this).parent().toggleClass('open');
		$(this).siblings('.submenu').slideToggle('slow');
	});

	if( store && store.isCorp ) {		
		$('.logout a').click(function(e) {
			e.preventDefault();
			store.logout();
			vtexid.logout();
			window.location = $(this).attr('href');
		});
	}
});
