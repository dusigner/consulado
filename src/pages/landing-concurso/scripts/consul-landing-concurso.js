'use strict';

require('modules/helpers');
require('vendors/jquery.validate');
// require('bootstrap/tooltip');
require('vendors/jquery.maskedinput');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup(['landing-gae'], function () {

	$(window).load(function() {

		// animação banner principal
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

	// valida cpf
	jQuery.validator.addMethod('document', function(value) {
		value = value.replace(/[^\d]+/g, '');

		if (value === '') {
			return false;
		}
        // Elimina values invalidos conhecidos
		if (value.length !== 11 || value === '00000000000' || value === '11111111111' || value === '22222222222' || value === '33333333333' || value === '44444444444' || value === '55555555555' || value === '66666666666' || value === '77777777777' || value === '88888888888' || value === '99999999999') {
			return false;
		}
        // Valida 1o digito
		var add = 0;
		for (var i = 0; i < 9; i++) {
			add += parseInt(value.charAt(i), 10) * (10 - i);
		}
		var rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) {
			rev = 0;
		}
		if (rev !== parseInt(value.charAt(9), 10)) {
			return false;
		}
        // Valida 2o digito
		add = 0;
		for (i = 0; i < 10; i++) {
			add += parseInt(value.charAt(i), 10) * (11 - i);
		}
		rev = 11 - (add % 11);
		if (rev === 10 || rev === 11) {
			rev = 0;
		}
		if (rev !== parseInt(value.charAt(10), 10)) {
			return false;
		}
		return true;  
	});

	// valida telefone
	jQuery.validator.addMethod('phone', function (value, element) {	
		value = value.replace('(', '');
		value = value.replace(')', '');
		value = value.replace('-', '');
		value = value.replace(' ', '').trim();
		if (value === '0000000000') {
			return (this.optional(element) || false);
		} else if (value === '00000000000') {
			return (this.optional(element) || false);
		}
		if (['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'].indexOf(value.substring(0, 2)) !== -1) {
			return (this.optional(element) || false);
		}
		if (value.length < 10 || value.length > 11) {
			return (this.optional(element) || false);
		}
		return (this.optional(element) || true);

	}, 'Informe um telefone válido'); 


	// valida data de nascimento
	$.validator.addMethod('validDate', function() {
		var valid = true;
		var day = $('#cbirthdate').val().split('/')[0];
		var month = $('#cbirthdate').val().split('/')[1];

		if(day < 0 || day > 31) { valid = false; }
		if(month < 0 || month > 12) { valid = false; }

		return valid;
	}, 'Data inválida');

	// valida data de nascimento
	$.validator.addMethod('birthdate', function() {
		var age =  18;
		var day = $('#cbirthdate').val().split('/')[0];
		var month = $('#cbirthdate').val().split('/')[1];
		var year = $('#cbirthdate').val().split('/')[2];

		var mydate = new Date();
		mydate.setFullYear(year, month-1, day-1);

		var currdate = new Date();
		currdate.setFullYear(currdate.getFullYear() - age);

		return currdate > mydate;

	}, 'Para participar é necessário ter 18 anos');

	// validação do form
	$('#form-concurso').validate({ 
		// regras form
		rules:{
			campoName:{
				minlength: 2,
				required: true
			},
			campoEmail:{
				email: true,
				required: true
			},
			birthdate:{
				birthdate: true,
				validDate: true,
				required: true
			},
			document:{
				document: true,
				required: true
			},
			phone: {
				phone: true,
				required: true
			}
		},
		// mensagens de erro form
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
				birthdate: 'Para participar é necessário ter 18 anos',
				required: 'Data de aniversário inválida'
			},
			document: {
				required: 'Informe um CPF',
				document: 'CPF inválido'
			},
			phone: {
				required: 'Informe um telefone',
				phone: 'Telefone inválido'
			}
		},

		submitHandler: function() {
			// var $form = $('#form-concurso');
			var dia = $('#cbirthdate').val().split('/')[0],
				mes = $('#cbirthdate').val().split('/')[1],
				ano = $('#cbirthdate').val().split('/')[2];

			var formData = {
				name: $('#cname').val(),
				email: $('#cemail').val(),
				birthdate: new Date(ano, mes-1, dia).getTime(),
				phone: $('#phone').val(),
				document: $('#cpf').val(),
				orderId: $('#orderId').val()
			};

			$.ajax({
				type: 'POST',
				url: 'https://consul-promo.herokuapp.com/lead',
				data: formData,
				beforeSend: function() {
				//addclass
					$('.btn.primary-button').addClass('loading');
					$('.btn-enviar span').css('display', 'none');
				}
			}).then(function() {
				//deu certo
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({ 
					event: 'envioComSucessoPromo'
				});
				$('#form input.error').removeClass('error');
				$('.error').css('display', 'none');
				$('.btn.primary-button').after('<span class="msg-form msg-sucesso">Formulário enviado!</span>');
				$('.msg-erro').addClass('hide');
				$('#form input').val('');
			}).fail(function (res) {
				res = JSON.parse(res.responseText);
				var validator = $('#form-concurso').validate(),
					errors = {};
				// tras msg de erro do servidor
				if (res.message === 'Validation Error') {
					$.each(res.errors, function(i, error) {
						errors[error.param] = error.msg;
					});
					validator.showErrors(errors);
				}
				// email já cadastrado
				if (res.message === 'E-mail já está cadastrado!') {
					validator.showErrors({
						'campoEmail': res.message
					});	
				}
				// cpf já cadastrado
				if (res.message === 'CPF já está cadastrado!') {
					validator.showErrors({
						'document': res.message
					});
				}
				$('.msg-sucesso').addClass('hide');
				if ($('.msg-erro').length === 0) {
					$('.btn.primary-button').after('<span class="msg-form msg-erro">Ocorreu um erro!</span>');
				}
			}).always(function() {
				//removeclass
				$('.btn.primary-button').removeClass('loading');
				$('.btn-enviar span').css('display', 'block');
			});
		}
	});
});


