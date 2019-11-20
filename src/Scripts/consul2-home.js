/* global $:true, Nitro: true */
'use strict';

require('modules/banners-controller');
require('modules/slider-banner');
require('components/instagram-stories');

//require('components/tabs-consumidor');
// require('custom/tabs-descontos');
require('components/titulo-prateleira');
require('components/lead-newsletter');
// require('components/prateleira-personalizada');

require('modules/chaordic');
require('modules/bannerDoubleClick');
require('modules/chatHome');
require('modules/shelfCategoryHome');
require('modules/_staticBanner');
require('modules/interested-shelf');
require('dataLayers/dataLayer-home-BF.js')
// require('modules/_staticBanner');

// require('modules/_staticBanner');
require('modules/subCategoryList')
// import 'modules/counter';
// import 'modules/datalayer_track';
Nitro.controller(
	'home',
	[
		'slider-banner',
		'instagram-stories',
		'lead-newsletter',
		// 'prateleira-personalizada',
		/* 'tabs-consumidor', 'tabs-descontos', */ 'linkDoubleClick',
		'chatHome',
		'shelfCategoryHome', /*'counter', 'datalayer_track'*/
		'interested-shelf',
		'dataLayer-home-bf'
	],

	function() {

		$('.tipbar-novo .container .row').slick ({
			mobileFirst: false,
			slidesToShow: 4,
			centerPadding: '10px',
			fade: false,
			cssEase: 'ease',
			easing: 'linear',
			arrows: false,
			dots: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
						centerPadding: '30px',
						infinite: true,
						initialSlide: 1,
						centerMode: true,

						index: 0
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2.1,
						slidesToScroll: 2,
						centerPadding: '30px',
						infinite: true,
						initialSlide: 1,
						centerMode: true,
						index: 0
					}
				},
				{
					breakpoint: 580,
					settings: {
						slidesToShow: 2.1,
						slidesToScroll: 1,
						centerPadding: '25px',
						infinite: true,
						initialSlide: 1,
						centerMode: true,
						index: 0
					}
				},
				{
					breakpoint: 520,
					settings: {
						slidesToShow: 1.1,
						slidesToScroll: 1,
						centerPadding: '25px',
						infinite: true,
						initialSlide: 1,
						centerMode: true,
						index: 0
					}
				},
				{
					breakpoint: 375,
					settings: {
						slidesToShow: 1.1,
						slidesToScroll: 1,
						centerPadding: '15px',
						infinite: true,
						initialSlide: 1,
						centerMode: true,
						index: 0
					}
				}
			]
		});

		$('.vitrine-slider').find('.prateleira>ul').not('.slick-initialized').slick({
			mobileFirst: false,
			slidesToShow: 3,
			slidesToScroll: 3,
			centerPadding: '10px',
			arrows: true,
			infinite: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 2.1,
						slidesToScroll: 2.1,
						centerPadding: '30px',
						initialSlide: 1,
						arrows: true,
						centerMode: true,
						index: 0
					}
				},
				{
					breakpoint: 998,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
						centerPadding: '30px',
						arrows: true,
					}
				},
				{
					breakpoint: 580,
					settings: {
						slidesToShow: 1.3,
						slidesToScroll: 1,
						centerPadding: '20px',
						initialSlide: 1,
						arrows: true,
						centerMode: true,
						index: 0
					}
				},
				{
					breakpoint: 414,
					settings: {
						slidesToShow: 1.1,
						slidesToScroll: 1,
						centerPadding: '24px',
						initialSlide: 1,
						centerMode: true,
						arrows: true,
						index: 0
					}
				},
				{
					breakpoint: 375,
					settings: {
						slidesToShow: 1.1,
						slidesToScroll: 1,
						centerPadding: '20px',
						initialSlide: 1,
						centerMode: true,
						arrows: true,
						index: 1
					}
				}
			]
		});

		var self = this,
			$slider = $('section.vitrines:not(.vitrine-ofertas-interesses, .vitrine-ofertas-alavancas)').find('.prateleira-slider .prateleira>ul').not('.slick-initialized');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		//chaordic.init('home');

		this.setupSlider = function($currentSlider) {
			$currentSlider.not('.slick-initialized').slick({
				infinite: false,
				slidesToShow: 4,
				slidesToScroll: 3,
				responsive: [
					{
						breakpoint: 990,
						settings: {
							dots: true,
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							dots: true,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});

			//ajusta para mobile - prateleira slider
			//$('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');
		};

		//	SLICK BANNER AREAS
		$('.banner-areas').slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 990,
					settings: {
						dots: true,
						arrows: false,
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 480,
					settings: {
						dots: true,
						arrows: false,
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
		//inicia automaticamente prateleiras sliders no desktop
		// if ($(window).width() > 768) {
		self.setupSlider($slider);
		// }

		//mobile - abrir vitrines
		if ($(window).width() <= 768) {
			$('section.slider .pre-title').click(function(e) {
				e.preventDefault();

				if ($(this).hasClass('open')) {
					$(this).removeClass('open');
					$(this)
						.siblings()
						.find('.prateleira>ul')
						.slideUp();
				} else {
					$('section.slider .open')
						.siblings()
						.find('.prateleira>ul')
						.slideUp();
					$('section.slider .open').removeClass('open');
					$(this).addClass('open');
					$(this)
						.siblings()
						.find('.prateleira>ul')
						.slideDown('slow', function() {
							self.setupSlider($(this));
						});
				}
			});

			$('section.slider')
				.eq(0)
				.find('.pre-title')
				.trigger('click');

			//vitrines padrões vtex
			$('.slider.vitrines h2').addClass('pre-title');
			self.setupSlider($('.slider.vitrines .prateleira-slider .prateleira>ul'));

			$('.slider.vitrines h2').click(function(e) {
				e.preventDefault();

				$(this).toggleClass('shelf-pre-title--active');
			});
			//\ vitrines padrões vtex
		}
	}
);
