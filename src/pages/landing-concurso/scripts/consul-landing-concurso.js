'use strict';

require('modules/helpers');
require('vendors/jquery.validate');
require('vendors/jquery.maskedinput');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup([], function () {

	$(window).load(function() {

		// animação banner
		var flippyIn = function() {
			var boxes = [0,1,2,3,4,5,6,7,8,9],
				remaining = boxes;

			var showBoxes = setInterval(function () {
				var divRandom1 = remaining[Math.floor(Math.random()*remaining.length)],
					divRandom2 = Math.floor(Math.random()*2)+1,
					effect = divRandom2 === 1 ? 'flipInY':'flipInX';
				$('.tit-banner').css('opacity', '0.75').css('visibility', 'visible');
				$('.box-'+ divRandom1).addClass('animated ' + effect).removeClass('flipOutX flipOutY');
				remaining = $.grep(remaining, function(value) {
					return value !== divRandom1;
				});

				if (remaining.length === 0) {
					clearInterval(showBoxes);
					flippyOut();
				}
			}, 1000);
		};
		var flippyOut= function() {
			var boxes = [0,1,2,3,4,5,6,7,8],
				remaining = boxes;

			var hideBoxes = setInterval(function () {
				var divRandom1 = remaining[Math.floor(Math.random()*remaining.length)],
					divRandom2 = Math.floor(Math.random()*2)+1,
					effect = divRandom2 === 1 ? 'flipOutY':'flipOutX';

				$('.box-'+ divRandom1).removeClass('flipInX flipInY').addClass('animated ' + effect);
				$('.tit-banner').css('visibility', 'hidden');
				remaining = $.grep(remaining, function(value) {
					return value !== divRandom1;
				});

				if (remaining.length === 0) {
					clearInterval(hideBoxes);
					flippyIn();
				}
			}, 1000);
		};  
		flippyIn();
	});

	// animação botão regulamento
	if ($(window).width() <= 480) { 
		$(document).ready(function(){
			$('.tgl').css('display', 'none');
			$('.btn-ver-mais').click(function() {
				$('#box-toggle .tgl').slideToggle('slow')
				.siblings('.tgl:visible').slideToggle('fast');
				$('.btn-ver-mais').hide();
				$('#box-toggle').removeClass('infos-regulamento');
			});
		});
	}

	// scroll banner
	$('.btn-participe').click(function(){
		$('html, body').animate({ scrollTop: 998 }, 600);
		return false;
	});

	// scroll banner mobile
	$('.ban-mobile').click(function(){
		$('html, body').animate({ scrollTop: 998 }, 600);
		return false;
	});

	// mascara form
	jQuery(function($){
		$('#phone').mask('(99) 9999-9999?9');
		$('#cpf').mask('999.999.999-99');
		$('#cbirthdate').mask('99/99/9999');
	});

	// validação do form
	$('#form-concurso').validate({ 
		rules:{
			campoName:{
				required: true, minlength: 2
			},
			campoEmail:{
				required: true, email: true
			},
			birthdate:{
				required: true
			},
			document:{
				required: true
			},
			phone: {
				required: true
			}
		},

		messages:{
			campoName:{
				required: 'Campo `nome` obrigatório',
				minlength: 'O seu nome deve conter, no mínimo, 2 caracteres'
			},
			campoEmail: {	
				required: 'Digite o seu e-mail para contato',
				email: 'Digite um e-mail válido'
			},
			birthdate: {
				required: 'Data de aniversário inválida'
			},
			document: {
				required: 'CPF inválido'
			},
			phone: {
				required: 'Telefone inválido'	
			}
		}
	});

	var $form = $('#form-concurso');

	$form.submit(function(e) {
		e.preventDefault();
		var dia = $('#cbirthdate').val().split('/')[0],
			mes = $('#cbirthdate').val().split('/')[1],
			ano = $('#cbirthdate').val().split('/')[2];

		var formData = {
			name: $('#cname').val(),
			email: $('#cemail').val(),
			birthdate: new Date(mes + '/' + dia + '/' + ano).getTime(),
			phone: $('#phone').val(),
			document: $('#cpf').val(),
			orderId: $('#orderId').val()
		};

		$.ajax({
			type: 'post',
			url: 'https://consul-promo.herokuapp.com/lead',
			data: formData,
			beforeSend: function() {
			//addclass
				$('.btn.primary-button').addClass('loading');
				$('.btn-enviar span').css('display', 'none');
			}
		}).then(function() {
			//deu certo
			$('.btn.primary-button').after('<span class="msg-form msg-sucesso">Formulário enviado!</span>');
			$('.msg-erro').addClass('hide');
			$('#form input').val('');
			$('.msg-erro').addClass('hide');
		}).fail(function () {
			//deu errado
			$('.btn.primary-button').after('<span class="msg-form msg-erro">Ocorreu um erro!</span>');
			$('.msg-sucesso').addClass('hide');
		}).always(function() {
			//removeclass
			$('.btn.primary-button').removeClass('loading');
			$('.btn-enviar span').css('display', 'block');
		});
	}); 

});


