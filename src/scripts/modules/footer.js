/* global $: true, Nitro: true */

require('modules/newsletter');

Nitro.module('footer', function(){

	'use strict';

	var $footer = $('footer'),
		accordionBtn = $('.accordion .title'),
		accordionBox = accordionBtn.parent(),
		$duvidasList   = $('.duvidas'),
		$duvidasAct    = $('.duvidas li.accordion > a'),
		//subList      = $('.sub-title b'),
		$btnNewsletter = $('.call-newsletter');

	// ACCORDION MENU FOOTER MOBILE
	accordionBtn.on('click', function(e) {
		if( $(window).width() > 767 ) return true;

		e.preventDefault();

		var self = $(this);

		if( self.parent().hasClass('open') ) {
			accordionBox.removeClass( 'open' );
			self.next().stop(true, true).slideUp();
		} else {
			self.parent().addClass( 'open' );
			self.next().stop(true, true).slideDown();
		}
	});

	// ACCORDION DÚVIDAS FOOTER
	$duvidasAct.on('click', function(e) {
		e.preventDefault();

		var self = $(this),
			parent = self.parent();

		if( parent.hasClass('active') ) {
			parent.removeClass( 'active' );
			self.next().stop(true, true).slideUp();
		} else {
			$duvidasList.find('li').removeClass( 'active' );
			$duvidasList.find('p').stop(true, true).slideUp();
			parent.addClass( 'active' );
			self.next().stop(true, true).slideDown();
		}
	});

	// SUB-MENU FOOTER
	/*subList.on('click', function(e) {
		e.preventDefault();
		$(this).parent().toggleClass('active');
		$(this).next('.icon-arrow-down').toggleClass('icon-arrow-up');
	});*/


	$btnNewsletter.click(function(e) {
		e.preventDefault();

		$footer.toScroll();
	});

	$(window).scroll( $.throttle(function() {

		if( $(window).scrollTop() >= 560 && $(window).scrollTop() + $(window).height() <= $footer.offset().top ){
			$btnNewsletter.addClass('newsletter-show');
		}else{
			$btnNewsletter.removeClass('newsletter-show');
		}

	}, 250) ).scroll();

});