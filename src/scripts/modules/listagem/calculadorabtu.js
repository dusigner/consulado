'use strict';

Nitro.module('calculadorabtu', function () {

	var calcBtu = $('.page-calculadora-btu__banner'),
		calcBtuMask = calcBtu.find('.page-calculadora-btu__mask'),
		calcBtuIframe = $('#calculadora-btu');

	calcBtuMask.click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('is--active')) {
			calcBtuIframe.attr('src', '/landing/calculadora-btu');
		}

		calcBtu.toggleClass('is--active');
		$(this).toggleClass('is--active');


		$('html, body').animate({scrollTop: calcBtu.offset().top -10 }, 'slow');
	});


	// TROCOU STEP DENTRO DO IFRAME
	$(window).on('calculadora.step', function() {
		var $calculadoraBtu = $('#calculadora-btu');
		var innerDoc = $calculadoraBtu.get(0).contentDocument || $calculadoraBtu.get(0).contentWindow.document,
			$document = $(innerDoc),
			height = $($document.find('body')).height();

		if(height > 100) {
			calcBtuIframe.height(height);
		} else {
			calcBtuIframe.height(668);
		}
	});


	// ACABOU O PROCESSO E TEM RESULTADO
	$(window).on('calculadora.end', function(e, res) {
		//STRING ENVIADA PARA FILTRO, SE FOR QA RETORNA TODOS BIVOLT, EM PROD FILTRA BTUS
		var tpl = (window.jsnomeLoja === 'consulqa') ? '#/filter&fq=specificationFilter_5:Bivolt' : '#/filter&fq=specificationFilter_814:{btu} BTUs/h' ;

		var bulletFilter = $('.noUi-origin.noUi-background, .noUi-origin.noUi-connect');

		// verificar qual produto recomendar
		if ( res.btu <= 7.500 ) {
			// console.log('Opa: ', '7.500');
			bulletFilter.css('left', '25%');
		} else if ( res.btu <= 10.000 ) {
			// console.log('Opa: ', '10.000');
			bulletFilter.css('left', '50%');
		} else if ( res.btu <= 12.000 ) {
			// console.log('Opa: ', '12.000');
			bulletFilter.css('left', '62%');
		} else if ( res.btu <= 18.000 ) {
			// console.log('Opa: ', '18.000');
			bulletFilter.css('left', '75%');
		} else if ( res.btu <= 21.000 ) {
			// console.log('Opa: ', '21.000');
			bulletFilter.css('left', '87%');
		} else if ( res.btu <= 22.000 ) {
			// console.log('Opa: ', '22.000');
			bulletFilter.css('left', '100%');
		}

		// console.log('res ', res.btu);

		//TIRGGA RESULTADO PARA MODULO FILTER.JS
		$(window).trigger('calculadora.filter', [tpl.render(res)]);
	});
});