'use strict';

Nitro.module('slider-banner', [], function () {
	var $buttonOpenRegulamento = $('.open-regulamento');

	this.setupMainSlider = function () {
		this.dataAttribute();

		var qtdBanners,
			$bannerFull = $('.banner-full'),
			$bannerSlider = $('.banner-slider');

		$bannerFull.each(function() {
			if($(this).children().length > 1) {
				$(this).slick({
					arrows: true,
					autoplay: true,
					autoplaySpeed: 7000,
					dots: true,
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

		$bannerSlider.each(function() {
			if($(this).children().length > 1) {
				$(this).slick({
					arrows: true,
					autoplay: true,
					autoplaySpeed: 7000,
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
				const bannerFull = b.querySelectorAll('.banner-full');
				const bannerSlider = b.querySelectorAll('.banner-slider');
				const bannerStatic = b.querySelectorAll('.banner-static');

				if (bannerFull) {
					bannerFull.forEach(bf => {
						const boxBanner = bf.querySelectorAll('.box-banner');

						if (boxBanner) {
							boxBanner.forEach((bb, index) => {
								bb.dataset.bannerIndex = index;
							})
						}
					});
				}

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
