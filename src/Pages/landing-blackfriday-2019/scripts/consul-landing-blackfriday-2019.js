'use strict';

require('vendors/slick');

$( document ).ready(function() {
	initDepoimentsSlider();
	initCountdownSlider();
});


const adaptHtmlToSliderMobile = () => {
	if ($(window).width() < 920) {
		$('.depoiments__content, .card').unwrap()
		$('.card').wrap('<div class="mobile-slide"></div>')
	}
}

const initDepoimentsSlider = () => {
	adaptHtmlToSliderMobile();

	$('.depoiments__slider').slick({
		adaptiveHeight: true,
		slidesToScroll: 1,
		slidesToShow: 1,
		dots: true,
		arrows: true
	});
}

const initCountdownSlider = () => {
	if ($(window).width() < 920) {
		$('.countdown__topics').slick({
			adaptiveHeight: true,
			slidesToScroll: 1,
			slidesToShow: 1,
			dots: true,
			arrows: true
		});
	}
}

