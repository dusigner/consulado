'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup([], function () {

	$(window).load(function() {
		$('.inner, .inner-only').css('visibility', 'visible');

		$('.flip-1, .flip-2, .flip-3, .flip-4, .flip-5, .flip-8').addClass('animated flipInX');
		$('.flip-6, .flip-7').addClass('animated flipInY');

		// setTimeout(function() {
		// 	$('.flip-8').addClass('flip-1-out');
		// }, 10000);
	});

});


