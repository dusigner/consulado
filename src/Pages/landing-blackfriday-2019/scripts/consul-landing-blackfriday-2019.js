'use strict';

require('vendors/slick');

$( document ).ready(function() {
	initSlider();
});


const adaptHtmlToSliderMobile = () => {
	if ($(window).width() < 920) {
		$('.depoiments__content,.depoiments .card').unwrap()
		$('.depoiments .card').wrap('<div class="mobile-slide"></div>')
	}
}

const initSlider = () => {
	adaptHtmlToSliderMobile();

	$('.depoiments__slider').slick({
		adaptiveHeight: true,
		slidesToScroll: 1,
		slidesToShow: 1,
		dots: true,
		arrows: true
	});
}

