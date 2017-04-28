'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

var CRM = require('modules/store/crm');

Nitro.setup([], function () {

	$(window).load(function() {
		$('.inner, .inner-only').css('visibility', 'visible');

		$('.box-one, .box-two, .box-three, .box-four, .box-five, .box-six, .box-seven').addClass('animated flipInY');
		// $('.flip-6, .flip-7').addClass('animated flipInY');

		// setTimeout(function() {
		// 	$('.flip-8').addClass('flip-1-out');
		// }, 10000);
	});

});


