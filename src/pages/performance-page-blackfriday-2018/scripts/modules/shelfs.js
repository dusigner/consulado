/**
 *
 * @fileOverview Tabs component to create a show/hide effect
 *
 */
'use strict';

import 'vendors/nitro';
import 'vendors/slick';

Nitro.module('shelfs', function() {
	const shelfList = $('.prateleira');

	/**
	 * Default method to initialize all functions inside module
	 */
	this.init = () => {
		this.renderShelfSlider();
	};

	/**
	 * Build a shelf slider using slick.js with the shelf items
	 */
	this.renderShelfSlider = () => {
		shelfList.find('ul').slick({
			infinte: false,
			slidesToShow: 4,
			slidesToScroll: 4,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					}
				},

				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					}
				},

				{
					breakpoint: 640,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					}
				},
			]
		});
	};

	this.init();
});
