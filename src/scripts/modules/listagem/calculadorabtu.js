'use strict';

Nitro.module('calculadorabtu', function () {
	var calcBtu = $('.page-calculadora-btu__banner'),
		calcBtuMask = calcBtu.find('.page-calculadora-btu__mask'),
		calcBtuIframe = $('#calculadora-btu');

	calcBtuIframe.attr('src', 'http://consulqa.vtexcommercestable.com.br/landing/calculadora-btu');

	calcBtuMask.click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('is--active')) {
			calcBtuIframe.attr('src', 'http://consulqa.vtexcommercestable.com.br/landing/calculadora-btu');
		}

		calcBtu.toggleClass('is--active');
		$(this).toggleClass('is--active');
	});
});