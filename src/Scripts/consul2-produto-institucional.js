/* global $: true, Nitro: true */
'use strict';

import 'modules/produto-institucional/benefits';
import 'modules/produto-institucional/produto-institucional';
import 'modules/produto-institucional/specifications';

Nitro.controller(
	'produto-institucional',
	[
		'beneficios',
		'produto-institucional',
		'specifications'
	],

	function () {
		$('.navigation-sticked-link[href^="#"]').on('click', function(e) {
			e.preventDefault();
			$('.navigation-sticked-link').removeClass('active');
			$(this).addClass('active');

			let hash = $(this).attr('href'),
				targetOffset = $(hash).offset().top;

			$('html, body').animate({
				scrollTop: targetOffset - 56
			}, 500);
		});

		/**
		 * fixed top bar with carousel in mobile;
		 */
		if($(window).width() < 700) {
			$('.navigation-sticked-list').slick({
				arrows: false,
				dots: false,
				infinite: false,
				mobileFirst: true,
				slidesToScroll: 1,
				slidesToShow: 1,
				variableWidth: true,
				responsive: [
					{
						breakpoint: 300,
						settings: {
							slidesToScroll: 1,
							slidesToShow: 2,
						}
					}
				]
			});
		}
	}
)

let sbSlick = function () {
	var screenWidth = $(window).width();
	//Slick slider intro mobile
	if (screenWidth <= '660') {
		$('.container-cards').slick({
			autoplay: true,
			autoplaySpeed: 1000,
			arrows: false,
			dots: true
		});
	}
	this.sbSlick()
};
