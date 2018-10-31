'use strict';


Nitro.module('calculadorabtu', function () {

	var calcBtu = $('.page-calculadora-btu__banner'),
		calcBtuClose = calcBtu.find('.close'),
		calcBtuIframe = $('#calculadora-btu');

	var updateHeight = function() {

		var $calculadoraBtu = $('#calculadora-btu');
		var innerDoc = $calculadoraBtu.get(0).contentDocument || $calculadoraBtu.get(0).contentWindow.document,
			$document = $(innerDoc),
			height = $($document.find('body')).height();

		if(height > 100) {
			calcBtuIframe.height(height);
		} else {
			calcBtuIframe.height(668);
		}
	};

	calcBtuClose.on('click', function() {
		if (calcBtu.hasClass('active')) {
			calcBtuIframe.attr('src', '/landing/calculadora-btu');
			calcBtuIframe.removeClass('initiated');
		}

		calcBtu.toggleClass('active');
	});

	// TROCOU STEP DENTRO DO IFRAME
	$(window).bind('calculadora.init calculadora.step calculadora.reinit', updateHeight);


	var layoutRange = function(minimo, maximo) {
		var de = $('.slider__value--from'),
			ate = $('.slider__value--to'),
			distanceRight = $('.noUi-origin.noUi-background'),
			distanceLeft = $('.noUi-origin.noUi-connect'),
			range = $('.noUi-base').width(),
			totalRange = 22000,
			distanceLeftValue = parseInt((minimo / totalRange) * range),
			distanceRightValue = parseInt((maximo / totalRange) * range);

		de.text((minimo/1000) + ' BTU\/h'); // eslint-disable-line
		ate.text((maximo/1000) + ' BTU\/h'); // eslint-disable-line
		distanceLeft.css('left', distanceLeftValue);
		distanceRight.css('left', distanceRightValue);
	};

	var updateRange = function(res) {

		var range = [];
		switch ( res ) {
		case '7.000' :
			range = ['7.000', '7.500', '9.000'];
			layoutRange(7000, 9000);
			break;
		case '7.500' :
			range = ['7.000', '7.500', '9.000'];
			layoutRange(7000, 9000);
			break;
		case '9.000' :
			range = ['9.000', '7.000', '7.500'];
			layoutRange(7000, 9000);
			break;
		case '10.000' :
			range = ['10.000', '12.000'];
			layoutRange(10000, 12000);
			break;
		case '12.000' :
			range = ['10.000', '12.000'];
			layoutRange(10000, 12000);
			break;
		case '18.000' :
			range = ['18.000', '22.000'];
			layoutRange(18000, 22000);
			break;
		case '22.000' :
			range = ['22.000', '18.000'];
			layoutRange(18000, 22000);
			break;
		default:
			range = [res];
		}
		return range.map(function(btu){	return ((window.jsnomeLoja === 'consulqa') ? '&fq=specificationFilter_77:' : '&fq=specificationFilter_814:') + btu + ' BTUs/h';}).toString().replaceAll(',', '');
	};

	// ACABOU O PROCESSO E TEM RESULTADO
	$(window).on('calculadora.end', function(e, res) {
		//STRING ENVIADA PARA FILTRO, SE FOR QA RETORNA TODOS BIVOLT, EM PROD FILTRA BTUS
		var tpl = '#/filter'+ updateRange(res.btu);
		var bulletFilter = $('.noUi-origin.noUi-connect'),
			bulletFilterD = $('.noUi-origin.noUi-background');

		// verificar qual produto recomendar
		if ( res.btu <= 7.500 ) {
			bulletFilter.css('left', '0%') & bulletFilterD.css('left', '37%');
		} else if ( res.btu <= 10.000 ) {
			bulletFilter.css('left', '50%') & bulletFilterD.css('left', '62%');
		} else if ( res.btu <= 12.000 ) {
			bulletFilter.css('left', '50%') & bulletFilterD.css('left', '62%');
		} else if ( res.btu <= 18.000 ) {
			bulletFilter.css('left', '75%') & bulletFilterD.css('left', '100%');
		} else if ( res.btu <= 21.000 ) {
			bulletFilter.css('left', '75%') & bulletFilterD.css('left', '100%');
		} else if ( res.btu <= 22.000 ) {
			bulletFilter.css('left', '75%') & bulletFilterD.css('left', '100%');
		}

		// $('.slider__value--to').text(res.btu.substring(0, 2) + ' BTU\/h');
		// console.log(res.btu);
		//TIRGGA RESULTADO PARA MODULO FILTER.JS
		$(window).trigger('calculadora.filter', [tpl]) ;
	});
});
