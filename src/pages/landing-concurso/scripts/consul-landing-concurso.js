'use strict';

require('modules/helpers');
require('vendors/jquery.validate');
require('vendors/jquery.maskedinput');

//load Nitro Lib
require('vendors/nitro');

// var CRM = require('modules/store/crm');

Nitro.setup([], function () {

	$(window).load(function() {
		$('.inner, .inner-only').css('visibility', 'visible');

		$('.box-one, .box-two, .box-three, .box-four, .box-five, .box-six, .box-seven').addClass('animated flipInY');
	});

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

	$('#form-concurso').validate();

	jQuery(function($){
		$('#phone').mask('(99) 9999*-9999');
		$('#cpf').mask('999.999.999-99');
	});

	var $form = $('#form-concurso');

	$form.submit(function(e) {
		e.preventDefault();

		var formData = {
			name: $('#cname').val(),
			email: $('#cemail').val(),
			birthdate: $('#cbirthdate').val(),
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
				// alert('LOADING');
			}
		}).then(function() {
			//deu certo
			$('.btn.primary-button').after('<span class="msg-form">Formulário enviado!</span>');
		}).fail(function () {
			//deu errado
			$('.btn.primary-button').after('<span class="msg-form">Ocorreu um erro!</span>');
		}).always(function() {
			//removeclass
			$('.btn.primary-button').removeClass('loading');
			$('.btn-enviar span').css('display', 'block');
		});
	});	

});


