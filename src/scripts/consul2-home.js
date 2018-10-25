/* global $:true, Nitro: true */
'use strict';

require('modules/slider-banner');
// require('custom/modal.overlayLead');
require('custom/lead-newsletter');
require('modules/chaordic');
require('modules/linkDoubleClick');
require('modules/chatHome');

Nitro.controller('home', ['chaordic', 'slider-banner', /* 'modal.overlayLead', */ 'lead-newsletter', 'linkDoubleClick', 'chatHome'], function(chaordic) {
	var self = this,
		$slider = $('.prateleira-slider .prateleira>ul').not('.slick-initialized');

	//INICIA CHAMADA DAS VITRINES CHAORDIC
	chaordic.init('home');

	this.setupSlider = function($currentSlider) {
		$currentSlider.not('.slick-initialized').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [{
				breakpoint: 990,
				settings: {
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});

		//ajusta para mobile - prateleira slider
		$('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');
	};

	//inicia automaticamente prateleiras sliders no desktop
	if ($(window).width() > 768) {
		self.setupSlider($slider);
	}

	//mobile - abrir vitrines
	if ($(window).width() <= 768) {
		$('section.slider .pre-title').click(function(e){
			e.preventDefault();

			if ($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).siblings().find('.prateleira>ul').slideUp();
			} else {
				$('section.slider .open').siblings().find('.prateleira>ul').slideUp();
				$('section.slider .open').removeClass('open');
				$(this).addClass('open');
				$(this).siblings().find('.prateleira>ul').slideDown('slow',function(){
					self.setupSlider($(this));
				});
			}
		});

		$('section.slider').eq(0).find('.pre-title').trigger('click');
	}

	//mobile - vitrines padrões vtex
	if ($(window).width() <= 768) {
		$('.slider.vitrines h2').addClass('pre-title');
		self.setupSlider($('.slider.vitrines .prateleira-slider .prateleira>ul'));

		$('.slider.vitrines h2').click(function(e){
			e.preventDefault();
			
			if($(this).hasClass('shelf-pre-title--active')) {
				console.log('tem');
				$(this).removeClass('shelf-pre-title--active');
			}
			else {
				console.log('nao tem');
				$(this).addClass('shelf-pre-title--active');
				$(this).addClass('shelf-pre-title--active');
				$(this).addClass('shelf-pre-title--active');
			}
		});
	}

});
