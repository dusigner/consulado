/* global $:true, Nitro: true */
'use strict';

require('modules/banners-controller');
require('modules/slider-banner');

//require('custom/tabs-consumidor');
// require('custom/tabs-descontos');
require('components/titulo-prateleira');
require('components/lead-newsletter');
// require('components/prateleira-personalizada');
require('modules/chaordic');
require('modules/bannerDoubleClick');
require('modules/chatHome');
require('modules/shelfCategoryHome');

// import 'modules/counter';
// import 'modules/datalayer_track';
Nitro.controller(
	'home',
	[
		'chaordic',
		'slider-banner',
		'lead-newsletter',
		// 'prateleira-personalizada',
		/* 'tabs-consumidor', 'tabs-descontos', */ 'linkDoubleClick',
		'chatHome',
		'shelfCategoryHome' /*'counter', 'datalayer_track'*/
	],

	function(chaordic) {

		$('.banners').after('<article class="tipbar-novo"> <div class="container"><div class="row"><div class="col-3"><div class="col-3"><div class="tipbar-novo__icone"><img src="/arquivos/consul-bf-loja-oficial.png"></div></div><div class="col-9"><h2 class="tipbar-novo__title">Loja Oficial</h2><p>Aproveite todas as vantagens de comprar direto da fábrica;</p></div></div><div class="col-3"><div class="col-3"><div class="tipbar-novo__icone"><img src="/arquivos/consul-bf-pagamento.png"></div></div><div class="col-9"><h2 class="tipbar-novo__title">Pagamento com 2 cartões</h2><p>Utilize até 2 cartões para efetuar sua compra;</p></div></div><div class="col-3"><div class="col-3"><div class="tipbar-novo__icone"><img src="/arquivos/consul-bf-parcelamento.png"></div></div><div class="col-9"><h2 class="tipbar-novo__title">Parcelamento</h2><p>Suas compras em até 12x sem juros no cartão;</p></div></div><div class="col-3"><div class="col-3"><div class="tipbar-novo__icone"><img src="/arquivos/consul-bf-compra-segura.png"></div></div><div class="col-9"><h2 class="tipbar-novo__title">Compra segura</h2><p>Seguro garantia estendida original, segurança e qualidade para você;</p></div></div></div></article>');

		var self = this,
			$slider = $('.prateleira-slider .prateleira>ul').not('.slick-initialized');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		chaordic.init('home');

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
