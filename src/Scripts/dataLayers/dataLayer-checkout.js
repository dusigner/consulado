import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-checkout', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.emailContinue();
		this.connectFacebook();
		this.connectGmail();
		this.backToCart();
		this.validateEmail();
	};

	var $category = '[SQUAD] Login Facebook-Google';

	this.emailContinue = () => {
		$('.client-email #btn-client-pre-email').on('click', function() {
			const $label = $('#client-pre-email').val();

			pushDataLayer(
				`${$category}`,
				`click email continuar`,
				`${$label}`
			);
		});
	};

	this.connectFacebook = () => {
		$('body').on('click', '.modal-custom-login-btn.facebook_access', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click conectar facebook`,
				`${$label}`
			);
		});
	};

	this.connectGmail = () => {
		$('body').on('click', '.modal-custom-login-btn.google_access', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click conectar google`,
				`${$label}`
			);
		});
	};

	this.backToCart = () => {
		$('#client-profile-data #orderform-to-cart').on('click', function() {
			const $label = $(this).text();

			pushDataLayer(
				`${$category}`,
				`click voltar carrinho`,
				`${$label}`
			);
		});
	};

	this.validateEmail = () => {
		$('.client-email #btn-client-pre-email').on('click', () => {

			var $email	= $('#client-pre-email').val();

			var $emailFilter=/^.+@.+\..{2,}$/;
			var $illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/

			if(!($emailFilter.test($email))||$email.match($illegalChars)) {
				const $label = $('.client-email .validate-erro').text();

				pushDataLayer(
					`${$category}`,
					`exibicao erro email`,
					`${$label}`
				);
			}
		});
	};

	this.init();
});
