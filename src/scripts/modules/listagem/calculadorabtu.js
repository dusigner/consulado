'use strict';

Nitro.module('calculadorabtu', function () {

	var calcBtu = $('.page-calculadora-btu__banner'),
		calcBtuMask = calcBtu.find('.page-calculadora-btu__mask'),
		calcBtuIframe = $('#calculadora-btu');

	// calcBtuIframe.attr('src', 'http://consulqa.vtexcommercestable.com.br/landing/calculadora-btu');

	calcBtuMask.click(function(e) {
		e.preventDefault();

		if ($(this).hasClass('is--active')) {
			// calcBtuIframe.attr('src', 'http://consulqa.vtexcommercestable.com.br/landing/calculadora-btu');
		}

		calcBtu.toggleClass('is--active');
		$(this).toggleClass('is--active');
	});


	console.log('$$$$$$$$$$$$$$$$$$$$$$$');

	/*var globalAcess = function() {
		alert(100000000000000000000);
		var $calculadoraBtu = $('#calculadora-btu');

		$calculadoraBtu.load(function() {
			var innerDoc = $calculadoraBtu.get(0).contentDocument || $calculadoraBtu.get(0).contentWindow.document,
				$document = $(innerDoc);

			var resultado = $($document.find('#resultado')).text();
			console.log('IFRAMESLC', $document );
			console.log('Resultado: ', resultado);
		});
	}();*/

	$(window).on('calculadora.step', function() {
		var $calculadoraBtu = $('#calculadora-btu');
		var innerDoc = $calculadoraBtu.get(0).contentDocument || $calculadoraBtu.get(0).contentWindow.document,
		$document = $(innerDoc),
		height = $($document.find('body')).height();

		if(height > 0) {
			calcBtuIframe.height(height);
		} else {
			calcBtuIframe.height(668);
		}
	});

	$(window).on('calculadora.end', function(e, res) {
		var tpl = '#/filter&fq=specificationFilter_814:{btu} BTUs/h';

		console.log('RESPOSTA> ', tpl.render(res));
	});
});