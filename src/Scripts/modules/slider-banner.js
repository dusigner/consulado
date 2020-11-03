'use strict';

Nitro.module('slider-banner', [], function () {
	var $buttonOpenRegulamento = $('.open-regulamento');

	this.setupMainSlider = function () {
		this.dataAttribute();

		var qtdBanners,
			// $bannerPrincipal = $(window).width() >= 470 ? $('.banners .banner-principal') : $('.banners-mobile .banner-principal');
			// $bannerPrincipal = $('.banners .banner-principal'),
			$bannerSlider = $('.banner-slider');

		// $bannerPrincipal.on('init', function () {
		// 	qtdBanners = $('.banners .banner-principal.slides .slick-slide:not(.slick-cloned)').length;

		// 	if ($(window).width() <= 470) qtdBanners = $('.banners-mobile .banner-principal.slides .slick-slide:not(.slick-cloned)').length;
		// });

		// if ($bannerPrincipal.length && $bannerPrincipal.children().length > 1) {
		// 	$bannerPrincipal.slick({
		// 		autoplay: false,
		// 		autoplaySpeed: 7000,
		// 		mobileFirst: true,
		// 		dots: false,
		// 		arrows: true,
		// 		responsive: [{
		// 			breakpoint: 470,
		// 			settings: {
		// 				arrows: true,
		// 				dots: false
		// 			},
		// 		}]
		// 	}).on('afterChange', function (event, slick, currentSlide) {
		// 		if ($('#modal-regulamento-banner').text() !== '' && qtdBanners > 1 && currentSlide === qtdBanners - 1) {
		// 			$buttonOpenRegulamento.show();
		// 		} else {
		// 			$buttonOpenRegulamento.hide();
		// 		}
		// 	});
		// }

		$bannerSlider.each(function() {
			if($(this).children().length > 1) {
				$(this).slick({
					arrows: true,
					autoplay: false,
					autoplaySpeed: 7000,
					cssEase: 'linear',
					fade: true,
					dots: false,
					mobileFirst: true,
				}).on('afterChange', function (event, slick, currentSlide) {
					if ($('#modal-regulamento-banner').text() !== '' && qtdBanners > 1 && currentSlide === qtdBanners - 1) {
						$buttonOpenRegulamento.show();
					} else {
						$buttonOpenRegulamento.hide();
					}
				});
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
	};

	this.dataAttribute = function () {
		const banners = document.querySelectorAll('.banners, .banners-tablet, .banners-mobile');

		if (banners) {
			banners.forEach(b => {
				const bannerSlider = b.querySelectorAll('.banner-slider');
				const bannerStatic = b.querySelectorAll('.banner-static');

				if (bannerSlider) {
					bannerSlider.forEach(bsl => {
						const boxBanner = bsl.querySelectorAll('.box-banner');

						if (boxBanner) {
							boxBanner.forEach((bb, index) => {
								bb.dataset.bannerIndex = index;
							})
						}
					});
				}

				if (bannerStatic) {
					bannerStatic.forEach(bst => {
						const boxBanner = bst.querySelectorAll('.box-banner');

						if (boxBanner) {
							boxBanner.forEach((bb, index) => {
								bb.dataset.bannerIndex = index;
							})
						}
					});
				}
			});
		}
	};

	this.setupMainSlider();
});
