/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

if (VERSION) {

	console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

	window._trackJs = window._trackJs || {};

	window._trackJs.version = VERSION;
}

//load Nitro Lib
require('vendors/nitro');

require('expose?store!modules/store/store');

require('vendors/slick');
require('vendors/vtex-modal');
require('modules/store/login');
require('modules/store/register.corporate');
require('vendors/jquery.inputmask');

Nitro.setup(['login', 'register.corporate'], function() {

	console.log('pre-home');

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
