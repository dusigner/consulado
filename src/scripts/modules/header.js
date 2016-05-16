/* global $: true, Nitro: true */

require('modules/cart');
require('modules/search');
require('vendors/jquery.cookie');

Nitro.module('header', function(){

	'use strict';

	var $body = $('body'),
		$document = $(document);

	// Menu mobile
	var topMenu    = $('.menu-department'),
		menuMobile = $('.menu-mobile'),
		defaultClass = 'menu-mobile show-extra-small';

	topMenu.find('.dropdown > a, .icon-hamburger').click(function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('topmenu-active');
		topMenu.toggleClass('no-border');
	});

	// Click fora do menu = close
	$(document).on('click', function(e){
		if($('.dropdown').is('.topmenu-active') && !$(e.target).is('.dropdown *')){
			$('.dropdown').removeClass('topmenu-active');
			topMenu.toggleClass('no-border');
		}
		return;
	});

	menuMobile.find('.open-menu-mobile').click(function(e) {
		e.preventDefault();

		if ( menuMobile.hasClass('menu-active') ) {
			menuMobile
				.removeClass()
				.addClass(defaultClass);
		}
		else {
			menuMobile.addClass('menu-active');
		}
	});

	menuMobile.find('.sub-itens > a').click(function(e) {
		e.preventDefault();

		menuMobile.addClass('sub-itens-active');
	});

	menuMobile.find('.menu-title').click(function(e) {
		e.preventDefault();

		menuMobile.removeClass();

		if ( $(this).parent().hasClass('second-level') ) {
			$(this).parent().parent().removeClass('item-active');

			menuMobile.addClass(defaultClass + ' menu-active sub-itens-active');

		} else {
			menuMobile.addClass(defaultClass + ' menu-active');
		}
	});

	menuMobile.find('.first-level > .item > a').click(function(e) {
		e.preventDefault();

		var classItem = $(this).attr('title')
								.replace(' ', '-')
								.replace(' & ', '-e-')
								.toLowerCase();

		$(this).parent().addClass('item-active');

		menuMobile.addClass(classItem).addClass('sub-first-itens-active');
	});






	//TODO: move mask to module;
	$('.mask').on('click', function(e) {
		e.preventDefault();

		if( $body.is('.cart-active') ) {
			$document.trigger('cart', false);
		}

		if( $body.is('.search-active') ) {
			$document.trigger('search', false);
		}

		//TODO: remove class regexp;
		$body.removeClass('menu-active');
	});

	$document
		.on('cart', function(){

			$body.toggleClass('cart-active');

		}).on('search', function(e, status){

			$body.toggleClass('search-active', !!status);
		});


	//add action to close button from vtex login
	$('body.login').on('click', '.vtexIdUI-close', function() {
		window.location.href = '/';
	});



	//Fechar advertisement
	// var advertisement = $('.advertisement');
	// advertisement.find('span').click(function() {
	// 	advertisement.slideUp();

	// 	$.cookie('advertisement', true, { path: '/' , expires: 1 });
	// });

	// if (! $.cookie('advertisement') ) {
	// 	advertisement.slideDown();
	// }


});