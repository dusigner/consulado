'use strict';

require('vendors/slick');

$(document).ready(function () {
	// console.log('###################### PROXY ######################');
	initTags();
	initLeadsBlackfriday();
	initDepoimentsSlider();
	initCountdownSlider();
	createAccordeon($('.category__title'));
	createAccordeon($('.faq__header'));
	initSlider();

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

const shootDataLayer = (event, category, action, label) => {
	if (typeof (dataLayer) !== "undefined") {
		dataLayer.push({
			event,
			category,
			action,
			label
		});
	}
}

const initTags = () => {
	$('.tips .card .card__link').on('click', e => {
		const title = $(e.target).parents('.card').find('.card__title').text().trim();
		shootDataLayer('generic', 'lp_black_friday_2020', 'nossas_dicas', `veja_mais_${title}`);
	})
}

const initSlider = () => {
	const $prateleiraHolder = $('.prateleira-holder__list .prateleira > ul');
	$prateleiraHolder.children('li.helperComplement').remove();

	const $items = $prateleiraHolder.children('li');

	if( $items.length > 4 ) {
		$prateleiraHolder.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			infinite: false,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
	}
}

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
				required: true
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

	$('.btn1').on('click', function () {
		// console.log('#### CLICOU NO BTN 1 ###');
		var steep1 = false;
		if ($('#firstName').val() !== '' && $('#email').val() !== '') {
			steep1 = true;
		}
		if ($('#email-error').text() !== '') {
			steep1 = false;
		}
		if ($('#term').attr('checked') === undefined) {
			steep1 = false;

			//exibir msg de erro termo
		}
		if (steep1 === true) {
			shootDataLayer('generic', 'lp_black_friday_2020', 'cadastro', 'quero_agora');

			$('.steep1').fadeOut();
			$('.steep2').delay(500).fadeIn();

			firstName = $('#firstName').val();
			email = $('#email').val();
			term = $('#term').val();

			// console.log(firstName);
			// console.log(email);
			// console.log(term);
			// console.log('################ steep1 OK ################');
		}
	});

	$('.btn2').on('click', function () {
		// console.log('#### CLICOU NO BTN 2 ###');
		shootDataLayer('generic', 'lp_black_friday_2020', 'quais_produtos_ira_aproveitar', 'continuar');
		$('.steep2').fadeOut();
		$('.steep3').delay(500).fadeIn();

		var categorias = [];

		($('#geladeiras').is(':checked')) ? categorias.push('geladeiras') : '';
		($('#fogoes').is(':checked')) ? categorias.push('fogoes') : '';
		($('#arcondicionado').is(':checked')) ? categorias.push('arcondicionado') : '';
		($('#freezers').is(':checked')) ? categorias.push('freezers') : '';
		($('#lavadoras').is(':checked')) ? categorias.push('lavadoras') : '';
		($('#cervejeiras').is(':checked')) ? categorias.push('cervejeiras') : '';
		($('#coifas').is(':checked')) ? categorias.push('coifas') : '';

		categoriasLista = categorias.join(', ');
		// console.log(categoriasLista);
		// console.log('################ steep2 OK ################');
	});

	$('.steep2 .btn-finished').on('click', function (e) {
		shootDataLayer('generic', 'lp_black_friday_2020', 'quais_produtos_ira_aproveitar', 'finalizar');
		e.preventDefault();
		generateLead();
	});

	$('.btn3').on('click', function (e) {
		shootDataLayer('generic', 'lp_black_friday_2020', 'qual_beneficio_mais_te_atrai', 'continuar');
		e.preventDefault();

		generateLead();
	});

	$('.steep3 .btn-finished').on('click', function (e) {
		shootDataLayer('generic', 'lp_black_friday_2020', 'qual_beneficio_mais_te_atrai', 'finalizar');
		e.preventDefault();
		generateLead();
	});

	$('.steep4 .lead__btn').on('click', function () {
		window.location.replace('http://loja.consul.com.br/landing/blackfriday');
	});

	function generateLead() {
		var benefits = $('input[name=benefits]:checked').attr('id');
		benefits = $('label[for=' + benefits + ']').text();

		// console.log(benefits);

		var dataToPatch = {
			firstName: firstName,
			email: email,
			cadastroBlackFriday: (term === 1) ? true : false,
			receberOfertasBlackFriday: categoriasLista,
			beneficiosBlackFriday: benefits,
			isNewsletterOptIn: true,
			newsletterType: 'blackfriday2020'
		};


		// console.log(dataToPatch);
		$.ajax({
			url: '/api/dataentities/CL/documents',
			type: 'POST',
			data: JSON.stringify(dataToPatch),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/vnd.vtex.ds.v10+json'
			}

		}).done(function () {
			$('.steep2').fadeOut();
			$('.steep3').fadeOut();
			$('.steep4').delay(500).fadeIn();

			//Envio de dados para o Salesforce
			$.ajax({
				url: `https://pub.s7.exacttarget.com/lij42bd45oo?q1=${dataToPatch.firstName}&q2=${dataToPatch.email}&q3=cns`,
				type: 'post',
				contentType: 'application/json',
				processData: false
			});

		});
	}
}


const adaptHtmlToSliderMobile = () => {
	if ($(window).width() < 920) {
		$('.depoiments__content, .card').unwrap()
		$('.card').wrap('<div class="mobile-slide"></div>')
	}
}

const initDepoimentsSlider = () => {
	// adaptHtmlToSliderMobile();

	$('.depoiments__slider').slick({
		adaptiveHeight: true,
		slidesToScroll: 1,
		slidesToShow: 1,
		dots: true,
		arrows: true,

		responsive: [
			{
				breakpoint: 768,
				settings: {
					adaptiveHeight: false,
					dots: true,
				}
			}
		]


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

		$(title).not(event.target).removeClass('is-actived');
		$(title).not(event.target).siblings().removeClass('is-actived');
		$(title).not(event.target).parent().removeClass('is-actived');

		if( !$(event.target).hasClass("is-actived")){
				$(event.target).addClass('is-actived');
				$(event.target).siblings().addClass('is-actived');
				$(event.target).parent().addClass('is-actived');
		} else {
				$(event.target).removeClass('is-actived');
				$(event.target).siblings().removeClass('is-actived');
				$(event.target).parent().removeClass('is-actived');
		}
	})
}

// -------------------------------------------
//       CÓDIGO ROUBADO DA LP DO ANO PASSADO
// -------------------------------------------

var contador;

var Index = {

	init: function () {
		contador = setInterval(this.countdown, 1000);
	},

	calculateTimeRemaining: function (endDate) {
		var total = Date.parse(endDate) - Date.parse(new Date(), 'mm-dd-yyyy'),
			seconds = Math.floor((total / 1000) % 60),
			minutes = Math.floor(((total / 1000) / 60) % 60),
			hours = Math.floor((total / ((1000 * 60) * 60)) % 24),
			days = Math.floor(total / (((1000 * 60) * 60) * 24)),
			timeRemaining = {
				'total': total,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};

		return timeRemaining;
	},

	countdown: function () {
		var endDate = '2020/11/27',
			$countdown = $('.countdown'),
			$days = $countdown.find('.days.indicators__number'),
			$hours = $countdown.find('.hours.indicators__number'),
			$minutes = $countdown.find('.minutes.indicators__number'),
			timeRemaining = Index.calculateTimeRemaining(endDate),
			days = timeRemaining.days,
			hours = timeRemaining.hours,
			minutes = timeRemaining.minutes,
			seconds = timeRemaining.seconds;

		$days.text(days < 10 ? '0' + days : days);
		$hours.text(hours < 10 ? '0' + hours : hours);
		$minutes.text(minutes < 10 ? '0' + minutes : minutes);

		if (days + hours + minutes + seconds <= 0) {
			clearInterval(contador);

			$('.lpbf-contador').addClass('is--end');
		}
	}
};

Index.init();

// -------------------------------------------
//       FIM DO CÓDIGO ROUBADO
// -------------------------------------------
