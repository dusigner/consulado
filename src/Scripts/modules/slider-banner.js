'use strict';

Nitro.module('slider-banner', [], function () {
	var $buttonOpenRegulamento = $('.open-regulamento');

	this.setupMainSlider = function () {
		var qtdBanners,
			// $bannerPrincipal = $(window).width() >= 768 ? $('.banners .banner-principal') : $('.banners-mobile .banner-principal');
			$bannerPrincipal = $('.banners .banner-principal')

		$bannerPrincipal.on('init', function () {
			qtdBanners = $('.banners .banner-principal.slides .slick-slide:not(.slick-cloned)').length;

			// if ($(window).width() <= 768) qtdBanners = $('.banners-mobile .banner-principal.slides .slick-slide:not(.slick-cloned)').length;
		});

		$bannerPrincipal
			.slick({
				autoplay: true,
				autoplaySpeed: 7000,
				mobileFirst: true,
				dots: false,
				arrows: true,
				responsive: [{
					breakpoint: 568,
					settings: {
						arrows: true,
						dots: false
					},
				},
				{
					breakpoint: 375,
					settings: {
						dots: false,
						arrows: true,
					}
				}
				]
			})
			.on('afterChange', function (event, slick, currentSlide) {
				if ($('#modal-regulamento-banner').text() !== '' && qtdBanners > 1 && currentSlide === qtdBanners - 1) {
					$buttonOpenRegulamento.show();
				} else {
					$buttonOpenRegulamento.hide();
				}
			});

		$buttonOpenRegulamento.click(function (e) {
			e.preventDefault();

			$('#modal-regulamento-banner').vtexModal({
				title: 'Regulamento',
				cookieOptions: {
					expires: 0,
					path: '/'
				}
			});
		});

		// //	SLICK BANNER AREAS
		// $('.banner-principal .slides .mobile').slick({
		// 	infinite: true,
		// 	arrows: true,
		// 	slidesToShow: 1,
		// 	responsive: [{
		// 		breakpoint: 375,
		// 		settings: {
		// 			dots: false,
		// 			arrows: true,
		// 			slidesToShow: 1,
		// 		}
		// 	}]
		// });
	};

	this.setupMainSlider();
});
