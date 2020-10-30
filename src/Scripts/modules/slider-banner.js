'use strict';

Nitro.module('slider-banner', [], function () {
	var $buttonOpenRegulamento = $('.open-regulamento');

	this.setupMainSlider = function () {
		this.dataAttribute();
		this.cloneMainSlider();

		var qtdBanners,
			//$bannerPrincipal = $(window).width() >= 470 ? $('.banners .banner-principal') : $('.banners-mobile .banner-principal');
			$bannerPrincipal = $('.banners .banner-principal'),
			$bannerPrincipalSlides = $('.banners .banner-principal-gbp .banner-slides');

		$bannerPrincipal.on('init', function () {
			//qtdBanners = $('.banners .banner-principal.slides .slick-slide:not(.slick-cloned)').length;

			//if ($(window).width() <= 470) qtdBanners = $('.banners-mobile .banner-principal.slides .slick-slide:not(.slick-cloned)').length;
		});

		$bannerPrincipal.slick({
			autoplay: true,
			autoplaySpeed: 7000,
			mobileFirst: true,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 470,
				settings: {
					arrows: true,
					dots: false
				},
			}]
		}).on('afterChange', function (event, slick, currentSlide) {
			if ($('#modal-regulamento-banner').text() !== '' && qtdBanners > 1 && currentSlide === qtdBanners - 1) {
				$buttonOpenRegulamento.show();
			} else {
				$buttonOpenRegulamento.hide();
			}
		});

		if($bannerPrincipalSlides.length) {
			$bannerPrincipalSlides.slick({
				autoplay: true,
				autoplaySpeed: 7000,
				mobileFirst: true,
				dots: false,
				arrows: true,
				responsive: [{
					breakpoint: 470,
					settings: {
						arrows: true,
						dots: false
					},
				}]
			}).on('afterChange', function (event, slick, currentSlide) {
				if ($('#modal-regulamento-banner').text() !== '' && qtdBanners > 1 && currentSlide === qtdBanners - 1) {
					$buttonOpenRegulamento.show();
				} else {
					$buttonOpenRegulamento.hide();
				}
			});
		}

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
		const bannerPrincipal = document.querySelectorAll('.banner-principal');

		if (bannerPrincipal) {
			bannerPrincipal.forEach(bp => {
				const boxBanner = bp.querySelectorAll('.box-banner');

				if (boxBanner) {
					boxBanner.forEach((bb, index) => {
						bb.dataset.bannerIndex = index;
					})
				}
			});
		}
	};

	this.cloneMainSlider = function () {
		const banners = document.querySelector('.banners');
		const bannerPrincipal = banners.querySelector('.banner-principal');
		const bannerPrincipalGBP = banners.querySelector('.banner-principal-gbp .banner-slides');

		if(bannerPrincipal && bannerPrincipalGBP) {
			const boxBanner = bannerPrincipal.querySelectorAll('.box-banner');

			if (boxBanner) {
				boxBanner.forEach(bb => {
					const bbc = bb.cloneNode(true);
					bannerPrincipalGBP.appendChild(bbc)
				});
			}
		}
	};

	this.setupMainSlider();
});
