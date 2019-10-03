'use strict';

require('vendors/slick');

$( document ).ready(function() {
	initDepoimentsSlider();
	initCountdownSlider();
});


const adaptHtmlToSliderMobile = () => {
	if ($(window).width() < 920) {
		$('.depoiments__content, .card').unwrap()
		$('.card').wrap('<div class="mobile-slide"></div>')
	}
}

const initDepoimentsSlider = () => {
	adaptHtmlToSliderMobile();

	$('.depoiments__slider').slick({
		adaptiveHeight: true,
		slidesToScroll: 1,
		slidesToShow: 1,
		dots: true,
		arrows: true
	});
}

const initCountdownSlider = () => {
	if ($(window).width() < 920) {
		$('.countdown__topics').slick({
			adaptiveHeight: true,
			slidesToScroll: 1,
			slidesToShow: 1,
			dots: true,
			arrows: true
		});
	}
}

// -------------------------------------------
//       CÓDIGO ROUBADO DA LP DO ANO PASSADO
// -------------------------------------------

var contador;

var Index = {

	init: function(){
		contador = setInterval(this.countdown, 1000);
	},

	calculateTimeRemaining: function( endDate ) {
		var total   = Date.parse( endDate ) - Date.parse( new Date(), 'mm-dd-yyyy' ),
			seconds = Math.floor( ( total / 1000) % 60 ),
			minutes = Math.floor( ( ( total / 1000 ) / 60 ) % 60 ),
			hours   = Math.floor( ( total / ( ( 1000 * 60 ) * 60 ) ) % 24 ),
			days    = Math.floor( total / ( ( ( 1000 * 60 ) * 60 ) * 24 ) ),
			timeRemaining = {
				'total'   : total,
				'days'    : days,
				'hours'   : hours,
				'minutes' : minutes,
				'seconds' : seconds
			};

		return timeRemaining;
	},

	countdown: function() {
		var endDate       = '2019/11/29',
			$countdown    = $('.countdown'),
			$days         = $countdown.find('.days.indicators__number'),
			$hours        = $countdown.find('.hours.indicators__number'),
			$minutes      = $countdown.find('.minutes.indicators__number'),
			timeRemaining = Index.calculateTimeRemaining(endDate),
			days          = timeRemaining.days,
			hours         = timeRemaining.hours,
			minutes       = timeRemaining.minutes,
			seconds       = timeRemaining.seconds;

		$days.text(days < 10 ? '0' + days : days);
		$hours.text(hours < 10 ? '0' + hours : hours);
		$minutes.text(minutes < 10 ? '0' + minutes : minutes);

		if ( days + hours + minutes + seconds <= 0 ) {
			clearInterval(contador);

			$('.lpbf-contador').addClass('is--end');
		}
	}
};

Index.init();

// -------------------------------------------
//       FIM DO CÓDIGO ROUBADO
// -------------------------------------------

