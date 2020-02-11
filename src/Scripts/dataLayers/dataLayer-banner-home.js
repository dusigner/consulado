import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-banner-home', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.bannerSliderHome();
		this.bannerLateralHome1();
	};

	this.bannerSliderHome = () => {
		$('.banners-static').find('.slider-banner').click(function() {
			const action = $(this).parents('.box-banner').data('data-slick-index').text().trim();
			const label = $(this).parents('.box-banner').attr('alt');
			pushDataLayer(
				'[SQUAD] Home',
				`Banner posição ${action}`,
				`${label}`
			);
		});
	};
	this.bannerLateralHome1 = () => {
		$('.banners-static').find('.lateral-banner').click(function() {
			const label = $(this).parents('.box-banner').attr('alt');
			pushDataLayer(
				'[SQUAD] Home',
				`Banner lateral 1`,
				`${label}`
			);
		});
	};
	this.bannerLateralHome2 = () => {
		$('.banners-static').find('.lateral-banner').click(function() {
			const label = $(this).parents('img').attr('alt');
			pushDataLayer(
				'[SQUAD] Home',
				`Banner lateral 2`,
				`${label}`
			);
		});
	};

	this.init();
});
