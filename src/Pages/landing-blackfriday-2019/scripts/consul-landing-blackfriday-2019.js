'use strict';

require('vendors/slick');

$( document ).ready(function() {
	initLeadsBlackfriday();
	initDepoimentsSlider();
	initCountdownSlider();
	createAccordeon($('.category__title'))
	createAccordeon($('.faq__header'))

	jQuery.extend(jQuery.validator.messages, {
		required: 'Este campo &eacute; requerido.',
		remote: 'Por favor, corrija este campo.',
		email: 'Por favor, forne&ccedil;a um endere&ccedil;o eletr&ocirc;nico v&aacute;lido.',
		url: 'Por favor, forne&ccedil;a uma URL v&aacute;lida.',
		date: 'Por favor, forne&ccedil;a uma data v&aacute;lida.',
		dateISO: 'Por favor, forne&ccedil;a uma data v&aacute;lida (ISO).',
		number: 'Por favor, forne&ccedil;a um n&uacute;mero v&aacute;lido.',
		digits: 'Por favor, forne&ccedil;a somente d&iacute;gitos.',
		creditcard: 'Por favor, forne&ccedil;a um cart&atilde;o de cr&eacute;dito v&aacute;lido.',
		equalTo: 'Por favor, forne&ccedil;a o mesmo valor novamente.',
		accept: 'Por favor, forne&ccedil;a um valor com uma extens&atilde;o v&aacute;lida.',
		maxlength: jQuery.validator.format('Por favor, forne&ccedil;a n&atilde;o mais que {0} caracteres.'),
		minlength: jQuery.validator.format('Por favor, forne&ccedil;a ao menos {0} caracteres.'),
		rangelength: jQuery.validator.format('Por favor, forne&ccedil;a um valor entre {0} e {1} caracteres de comprimento.'),
		range: jQuery.validator.format('Por favor, forne&ccedil;a um valor entre {0} e {1}.'),
		max: jQuery.validator.format('Por favor, forne&ccedil;a um valor menor ou igual a {0}.'),
		min: jQuery.validator.format('Por favor, forne&ccedil;a um valor maior ou igual a {0}.')
	});
});

const initLeadsBlackfriday = () => {

	var categoriasLista;
	var firstName;
	var email;
	var term;

	var form = $('#contact-lbf2019');



	form.validate({
		debug: true,
		rules: {
			firstName: {
				required: true,

			},
			email: {
				required: true,
				email: true,

			},
			term: {
				required: true

			}
		}
	});

	$('.btn1').on('click', function(){
		console.log('#### CLICOU NO BTN 1 ###');
		var steep1 = false;
		if ($('#firstName').val() !== '' && $('#email').val() !== '') {
			steep1 = true;
		}
		if($('#email-error').text() !==''){
			steep1 = false;
		}
		if ($('#term').attr('checked') === undefined){
			steep1 = false;

			//exibir msg de erro termo
		}
		if(steep1 === true) {
			$('.steep1').fadeOut();
			$('.steep2').delay(500).fadeIn();

			firstName = $('#firstName').val();
			email = $('#email').val();
			term = $('#term').val();

			console.log(firstName);
			console.log(email);
			console.log(term);
			console.log('################ steep1 OK ################');
		}
	});

	$('.btn2').on('click', function(){
		// console.log('#### CLICOU NO BTN 2 ###');
		$('.steep2').fadeOut();
		$('.steep3').delay(500).fadeIn();

		var categorias = [];

		($('#geladeiras').is(":checked"))? categorias.push('geladeiras'):'';
		($('#fogoes').is(":checked")) ? categorias.push('fogoes'):'';
		($('#arcondicionado').is(":checked")) ? categorias.push('arcondicionado'):'';
		($('#freezers').is(":checked")) ? categorias.push('freezers'):'';
		($('#lavadoras').is(":checked")) ? categorias.push('lavadoras'):'';
		($('#cervejeiras').is(":checked")) ? categorias.push('cervejeiras'):'';
		($('#coifas').is(":checked")) ? categorias.push('coifas'):'';

		categoriasLista = categorias.join(', ');
		console.log(categoriasLista);
		console.log('################ steep2 OK ################');
	});

	$('.btn3').on('click', function(e){
		console.log('#### CLICOU NO BTN 3 ###');
		e.preventDefault();

		var benefits = $('input[name=benefits]:checked').attr('id');
		benefits = $('label[for='+benefits+']').text();

		console.log(benefits);

		var dataToPost = {
			firstName: firstName,
			email: email,
			cadastroBlackFriday: (term===1)?true:false,
			receberOfertasBlackFriday: categoriasLista,
			beneficiosBlackFriday: benefits,
			newsletterType: 'blackfriday2019'
		};

		console.log(dataToPost);
		$.ajax({
			url: "https://api.vtex.com/consulqa/dataentities/CL/documents",
			type: "PUT",
			data: JSON.stringify(dataToPost),
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/vnd.vtex.ds.v10+json"
			}

		}).done(function() {
			$('.steep3').fadeOut();
			$('.steep4').delay(500).fadeIn();
		});


		console.log('################ steep3 OK ################');
	});

}





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

const createAccordeon = title => {
	title.click(event => {
		$(event.target).toggleClass('is-actived');
		$(event.target).siblings().toggleClass('is-actived');
		$(event.target).parent().toggleClass('is-actived');
	})
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

