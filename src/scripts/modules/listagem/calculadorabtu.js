'use strict';

Nitro.module('calculadorabtu', function () {

	var calcBtu = $('.page-calculadora-btu__banner'),
		calcBtuMask = calcBtu.find('.page-calculadora-btu__mask'),
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

	calcBtuMask.on('click', function(e) {
		e.preventDefault();

		if ($(this).hasClass('is--active')) {
			calcBtuIframe.attr('src', '/landing/calculadora-btu');
		}

		calcBtu.toggleClass('is--active');
		$(this).toggleClass('is--active');


		$('html, body').animate({scrollTop: calcBtu.offset().top -10 }, 'slow');
		updateHeight();
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
			
		de.text((minimo/1000) + ' BTU\/h');
		ate.text((maximo/1000) + ' BTU\/h');
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
		case '9.000' : 
			range = ['9.000', '7.000', '7.500'];
			layoutRange(7000, 9000);
			break;
		case '10.000' : 
			range = ['10.000', '12.000'];
			layoutRange(10000, 12000);
			break;
		case '22.000' : 
			range = ['22.000', '18.000'];
			layoutRange(18000, 22000);
			break;
		default: 
			range = [res];
		}
		return range.map(function(btu){	return '&fq=specificationFilter_814:' + btu + ' BTUs';}).toString().replaceAll(',', '');
	};

	// ACABOU O PROCESSO E TEM RESULTADO
	$(window).on('calculadora.end', function(e, res) {
		//STRING ENVIADA PARA FILTRO, SE FOR QA RETORNA TODOS BIVOLT, EM PROD FILTRA BTUS
		var tpl = (window.jsnomeLoja === 'consulqa') ? '#/filter&fq=specificationFilter_5:Bivolt' : '#/filter'+ updateRange(res.btu) + '/h';
		var bulletFilter = $('.noUi-origin.noUi-background, .noUi-origin.noUi-connect');

		// verificar qual produto recomendar
		if ( res.btu <= 7.500 ) {
			bulletFilter.css('left', '25%');
		} else if ( res.btu <= 10.000 ) {
			bulletFilter.css('left', '50%');
		} else if ( res.btu <= 12.000 ) {
			bulletFilter.css('left', '62%');
		} else if ( res.btu <= 18.000 ) {
			bulletFilter.css('left', '75%');
		} else if ( res.btu <= 21.000 ) {
			bulletFilter.css('left', '87%');
		} else if ( res.btu <= 22.000 ) {
			bulletFilter.css('left', '100%');
		}

		$('.slider__value--to').text(res.btu.substring(0, 2) + ' BTU\/h');

		// console.log('res ', txtValue);
		// console.log('resbtu ', res.btu);
		
		//TIRGGA RESULTADO PARA MODULO FILTER.JS
		$(window).trigger('calculadora.filter', [tpl]) ;
	});
});