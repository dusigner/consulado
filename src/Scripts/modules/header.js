/* global $: true, Nitro: true, vtexid: true */
'use strict';

require('modules/header/cotas');
// require('modules/header/search');
require('modules/header/welcome-message');
require('modules/header/menu-hover');
require('modules/header/cart');
// require('modules/header/tooltip');

Nitro.module('header', ['cotas', /* 'search', */ 'welcome-message', 'menu-hover', 'cart' /* 'tooltip' */], function() {
	//teste ab new layout header


	var $body = $('body'),
		$document = $(document);

	//Teste A B
	$('body').addClass('teste-A');


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

	$('.cont-search.search .form-search .text-search').on('click', function() {
		setTimeout(function(){
			if ( !$('.ac-container').hasClass('is--search')) {
				$('.ac-container').addClass('is--search');
				var closeSearch = $('.ac-title-top-search')
				closeSearch.append('<p type="button" class="icon icon-close" style="margin: 10px 5px; color: #9aca3c; font-weight: bold; cursor: pointer;"></p>')
				closeSearch.css('display', 'flex')
				closeSearch.css('justifyContent', 'space-between')
			}
		}, 500)
	});

	$('body').on('click', '.ac-container .icon-close', function(){
		$('.ac-container').css('display', 'none');
	});

	if($(window).width() < 798) {
			const searchForm = $('.cont-search .form-search input');
			let icone = $('.form-search .icon-consul-loupe');

			$(searchForm).on('keyup', function() {
			if($(this).val().length === 0) {
				icone.removeClass('icon-close');
				icone.addClass('icon-consul-loupe');
			} else {
				icone.addClass('icon-close');
				icone.removeClass('icon-consul-loupe');
			}
		});

		$(icone).on('click', function(){
			$('.cont-search .form-search input').val("");
			icone.removeClass('icon-close');
			icone.addClass('icon-consul-loupe');
		});
	}



	menuMobile.find('.open-menu-mobile').click(function(e) {
		e.preventDefault();

		if (menuMobile.hasClass('menu-active')) {
			menuMobile.removeClass().addClass(defaultClass);

			$('header').removeClass('menu-scroll');
			$('header').height(100);
		} else {
			menuMobile.addClass('menu-active');

			var altura = $(window).height();

			$('body')
				.find('.menu-active')
				.parent()
				.parent()
				.parent()
				.addClass('menu-scroll');
			$('body')
				.find('.menu-active')
				.parent()
				.parent()
				.parent()
				.height(altura);
		}
	});

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
		})
		.on('search', function(e, status) {
			$body.toggleClass('search-active', !!status);
		});

	//add action to close button from vtex login
	$('body.login').on('click', '.vtexIdUI-close', function() {
		window.location.href = '/';
	});

	window.vtexjs &&
		window.vtexjs.checkout.getOrderForm().done(function(result) {
			var orderForm = result;

			if (orderForm && orderForm.clientProfileData && orderForm.clientProfileData.email) {
				$('.logout').removeClass('hide');
			}
		});

	menuMobile.find('.sub-itens > a').on('click', function(e) {
		e.preventDefault();

		$(this)
			.parent()
			.toggleClass('open');
		$(this)
			.siblings('.submenu')
			.slideToggle('slow');
	});

	if (store && store.isCorp) {
		$('.logout a').click(function(e) {
			e.preventDefault();
			store.logout();
			vtexid.logout();
			window.location = $(this).attr('href');
		});
	}
});
