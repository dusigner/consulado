'use strict';

var Uri = require('vendors/Uri');
var CRM = require('modules/store/crm');

Nitro.module('lead-newsletter', function() {

	// Teste AB Controller
	// var urlTesteAb = window.location.search;
	// var $body = $('body');
	// var testeA = 'testeab=a';
	// var testeB = 'testeab=b';

	// if (urlTesteAb.indexOf(testeA) >= 0) {
	// 	$body.removeClass('teste-ab__news-phone-show--b');
	// }
	// else if (urlTesteAb.indexOf(testeB) >= 0) {
	// 	$body.addClass('teste-ab__news-phone-show--b');
	// }

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
		$newsletterFixed = $('.toggle-newsletter');

	this.setup = function(/*orderForm*/) {
		$formNewsletter.submit(function(e) {
			e.preventDefault();

			$formNewsletter.find('input').on('blur', function() {
				self.validateInputs();
			});

			self.validateForm();

			return false;
		});

		//deleta tooltip de validação de email
		$inputEmail.on('keyup', function() {
			$inputEmail.removeClass('error');
			$('.form-newsletter_error-email').remove();
		});

		//apaga o tooltip quando clica no document
		$(document).click(function (e) {
			if (!$('.form-newsletter_error-email').is(e.target)) {
				$('.form-newsletter_error-email').remove();
			}
		});

		self.toggleNewsletter();
		self.newsletterFixedOpenAfter(4000);
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

		return CRM.ajax({
			url: CRM.formatUrl('CL', 'documents'),
			type: 'POST',
			data: JSON.stringify(data),
			beforeSend: function() {
				$inputEmail.removeClass('error');
				$('.form-newsletter_error-email').remove();
			}
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
			$inputEmail.addClass('error');
			$inputEmail.parent('fieldset').append('<span class="form-newsletter_error-email">E-mail já cadastrado!</span>');
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

	/**
	 * Retorna verdadeiro se existir o valor 'visite_a_loja' no parâmetro da url
	 *
	 * @returns {boolean}
	 */
	this.isParameterVisiteALoja = function() {

		var uri = new Uri(window.location.href),
			parameters = uri.queryPairs;

		return parameters.find(function(parameter) {
			return parameter[1] === 'visite_a_loja';
		});
	};

	this.toggleNewsletter = function() {
		if( self.isParameterVisiteALoja() ) {
			$newsletterFixed.closest('.lead-newsletter').addClass('lead-newsletter--fixed secrete');

			$newsletterFixed.on('click', function() {
				$(this).closest('.lead-newsletter--fixed').toggleClass('secrete');
			});
		}
	};

	/**
	 * Abre newsletter fixa depois de determinado tempo
	 *
	 * @param {int} time
	 */
	this.newsletterFixedOpenAfter = function(time) {

		$(window).ready(function() {
			setTimeout(function() {
				$newsletterFixed.closest('.lead-newsletter--fixed')
					.toggleClass('secrete');
			}, time);
		});
	};
});
