/* global $:true, Nitro: true */
'use strict';

require('modules/store/login');
require('modules/store/register.corporate');
require('modules/store/callcenter');

Nitro.controller('pre-home', ['login', 'register.corporate', 'callcenter'], function() {
	$('#info .carrossel').slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 990,
				settings: {
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	$('.firstName, .lastName').bind('keypress', function(e) {
		if (!e.key.match(/[A-Za-záàâãéèêíïóôõöúçñüÜÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s'"]+/)) {
			return false;
		}
	});
});
