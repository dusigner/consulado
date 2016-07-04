/* global $:true, Nitro: true */

require('vendors/slick');
require('modules/slider-banner');
require('custom/modal.overlayLead');
require('custom/lead-newsletter');
//require('custom/modal.blackfriday');

Nitro.controller('home', ['slider-banner','modal.overlayLead', 'lead-newsletter'], function(){

	'use strict';

	var $slider = $('.prateleira-slider .prateleira ul').not('.product-field ul');

	this.setupSlider = function(){

		$slider.slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 1019,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true
					}
				}
			]
		});

	};

	this.setupSlider();

});