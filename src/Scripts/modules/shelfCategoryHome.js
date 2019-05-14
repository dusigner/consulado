'use strict';

require('vendors/slick');

Nitro.module('shelfCategoryHome', function() {
	const $shelfCategory = $('.shelf-category-home');
	const shelfCategoryHome = {};

	// Start all
	shelfCategoryHome.init = () => {
		$shelfCategory.slick({
			adaptiveHeight: false,
			arrows: true,
			infinite: true,
			slidesToScroll: 6,
			slidesToShow: 6,
			responsive: [{
				breakpoint: 1100,
				settings: {
					arrows: true,
					dots: false,
					slidesToScroll: 4,
					slidesToShow: 4
				}
			},
			{
				breakpoint: 770,
				settings: {
					arrows: false,
					dots: true,
					slidesToScroll: 1,
					slidesToShow: 3
				}
			}]
		});
	};

	shelfCategoryHome.init();
});
