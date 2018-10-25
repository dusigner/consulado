'use strict';

// require('modules/smartFocus');

Nitro.module('slider-banner', [/* 'smartFocus' */],  function(/* smartFocus */) {
	/* if($('body').hasClass('home')) {
		smartFocus.renderBanner();
	} */

	var self = this,
		$buttonOpenRegulamento = $('.open-regulamento'),
		$bannerPrincipal = $(window).width() >= 768 ? $('.banners .banner-principal') : $('.banners-mobile .banner-principal');

	this.lazyLoad = function() {
		$(window).on('load', function() {
			$bannerPrincipal.addClass('banner-loaded');
			self.setupMainSlider();
			$('.fake-banner').hide();
		});

	};

	this.setupMainSlider = function() {
		var qtdBanners;

		$bannerPrincipal.on('init', function(){
			qtdBanners = $('.banners .banner-principal.slides .slick-slide:not(.slick-cloned)').length;

			if ($(window).width() <= 768) {
				qtdBanners = $('.banners-mobile .banner-principal.slides .slick-slide:not(.slick-cloned)').length;
			}
		});

		$bannerPrincipal.slick({
			autoplay: true,
			autoplaySpeed: 6000,
			mobileFirst: true,
			dots: true,
			arrows: false,
			responsive: [{
				breakpoint: 568,
				settings: {
					arrows: true,
				}
			}]
		}).on('afterChange', function(event, slick, currentSlide){
			if ($('#modal-regulamento-banner').text() !== '' && (qtdBanners > 1) && (currentSlide === qtdBanners - 1)) {
				$buttonOpenRegulamento.show();
			} else {
				$buttonOpenRegulamento.hide();
			}
		});

		$buttonOpenRegulamento.click(function(e){
			e.preventDefault();

			$('#modal-regulamento-banner').vtexModal({
				'title': 'Regulamento',
				cookieOptions: {
					expires: 0,
					path: '/'
				}
			});
		});
	};

	this.lazyLoad();

});
