import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-banner-home', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.bannerSliderHome();
		this.bannerLateralHome1();
	};

	this.bannerSliderHome = () => {

		// $(document).on('beforeChange','.banners-static', (event, slick, currentSlide, nextSlide) => {
		$(document).on('click','.banner-slick',function(){
			var slideAtual = $(this).find('.slider-banner').slick('slickCurrentSlide');
			const label = $(this).find('.slick-active img').attr('alt');
			pushDataLayer(
				'[SQUAD] Home',
				`Banner posição ${slideAtual + 1}`,
				`${label}`
			);
		});
	};
	this.bannerLateralHome1 = () => {
		$(document).on('click','.lateral-banners .box-banner',function() {
			const label = $(this).find('img').attr('alt');
			pushDataLayer(
				'[SQUAD] Home',
				`Banner lateral`,
				`${label}`
			);
		});
	};
	this.init();
});
