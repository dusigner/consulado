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

		//TIRGGA RESULTADO PARA MODULO FILTER.JS
		$(window).trigger('calculadora.filter', [tpl.render(res)]);
	});
});