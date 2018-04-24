/* global $:true, Nitro: true */
'use strict';

require('vendors/vtex-modal');
require('modules/store/login');
require('modules/store/register.corporate');

Nitro.controller('pre-home', ['login', 'register.corporate'], function() {

	$('#info .carrossel').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [{
			breakpoint: 990,
			settings: {
				dots: true,
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				dots: true,
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	});


});










