'use strict';

require('vendors/jquery.inputmask');

Nitro.module('lead-newsletter', function() {

	// Teste AB Controller
	var urlTesteAb = window.location.search;
	var $body = $('body');
	var testeA = 'testeab=a';
	var testeB = 'testeab=b';

	if (urlTesteAb.indexOf(testeA) >= 0) {
		$body.removeClass('teste-ab__news-phone-show--b');
	}
	else if (urlTesteAb.indexOf(testeB) >= 0) {
		$body.addClass('teste-ab__news-phone-show--b');
	}

	// Input mask para campos do tipo telefone
	$('input[type=tel]').inputmask('99 [9]9999-9999');

	var self = this,
		$formNewsletter = ($(window).width() <= 768) ? $('#form-newsletter-footer') : $('#form-newsletter'),
		$inputName = $formNewsletter.find('input[type="text"]'),
		$inputEmail = $formNewsletter.find('input[type="email"]'),
		$inputTel = $formNewsletter.find('input[type="tel"]'),
		$inputTermos = $formNewsletter.find('input[type="checkbox"]'),
		valid = false,
		// hasSession = sessionStorage.getItem('leadNewsletter'),
		clientURI = '/api/ds/pub/documents/CL';

	this.setup = function(/*orderForm*/) {
		$formNewsletter.submit(function(e) {
			e.preventDefault();

			$formNewsletter.find('input').on('blur', function() {
				self.validateInputs();
			});

			self.validateForm();

			return false;
		});

		// if (!hasSession && !orderForm.clientProfileData.email) {
		// 	$formNewsletter.submit(function(e) {
		// 		e.preventDefault();

		// 		$formNewsletter.find('input').on('blur', function() {
		// 			self.validateInputs();
		// 		});

		// 		self.validateForm();

		// 		return false;
		// 	});
		// }
	};

	this.validateInputs = function() {
		if ($inputName.filter(':blank').length >= 1) {
			$inputName.addClass('error');
		} else {
			$inputName.removeClass('error');
		}

		if ($inputEmail.filter(':blank').length >= 1) {
			$inputEmail.addClass('error');
		} else {
			$inputEmail.removeClass('error');
		}

		if (!$inputTermos.is(':checked')) {
			$inputTermos.addClass('error');
		} else {
			$inputTermos.removeClass('error');
		}
	};

	this.validateForm = function() {
		if ($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length < 1 && $inputTermos.is(':checked')) {
			valid = true;
		} else {
			self.validateInputs();
		}

		if (valid) {
			var name = $inputName.val(),
				email = $inputEmail.val(),
				telefone = $inputTel.val();

			self.registerNewsletter(name, email, telefone);
		}
	};

	this.registerNewsletter = function(name, email, telefone) {
		var data = {};

		data.firstName = name;
		data.email = email;
		data.xNewsPhone = telefone;
		data.isNewsletterOptIn = true;
		data.xDataCadastroLead = new Date();
		data.xOrigemLead = 8;
		data.xUnidadeNegocio = 2;
		data.xCategoriaLead = 1;

		return $.ajax({
			url: clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		}).done(function() {
			$('.lead-newsletter').addClass('success');

			sessionStorage.setItem('leadNewsletter', true);

			setTimeout(function() {
				$('.newsletter').fadeOut();
			}, 2000);

			dataLayer.push({
				event: 'formulario_home',
				status: 'ok'
			});
		}).fail(function() {
			dataLayer.push({
				event: 'formulario_home',
				status: 'error'
			});
		});
	};

	window.vtexjs.checkout.getOrderForm().done(function(/*result*/) {
		self.setup(/*result*/);
	});


	$('.lead-newsletter-show').click(function() {
		$(this).hide();
		$(this).next('.lead-newsletter').fadeIn();
		$('#name').focus();
	});

	$('.btn_close').click(function() {
		$('.lead-newsletter').hide();
		$('.lead-newsletter-show').fadeIn();
	});

});
