'use strict';

Nitro.module('checkout-login', function(){
	var self = this;

	this.init = () => {
		// init functions

		this.htmlLoginFacebookAndGoogle();
		this.htmlErrorValidadeEmail();
		this.validateEmail();
	};

	this.htmlLoginFacebookAndGoogle = () => {
		$('.pre-email .client-email').append(`
			<div class="modal-custom-login">
				<p class="modal-custom-login--title">Ou entre por uma das opções abaixo:</p>
				<div class="modal-custom-login--box">
					<button class="modal-custom-login-btn facebook_access">Facebook</button>
					<button class="modal-custom-login-btn google_access">Google</button>
				</div>
			</div>
		`)
	};

	this.htmlErrorValidadeEmail = () => {
		$(".client-email #client-pre-email").after('<span style="display: none;" class="validate-erro">Não foi possível realizar o login, por favor tente novamente ou escolha outra forma de login.</span>');
	};

	this.validateEmail = () => {
		$('.client-email #btn-client-pre-email').on('click', () => {

			var $email	= $("#client-pre-email").val();

			var $emailFilter=/^.+@.+\..{2,}$/;
			var $illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/

			if(!($emailFilter.test($email))||$email.match($illegalChars)) {
				$(".client-email #client-pre-email, .client-email #btn-client-pre-email").addClass('is--error');
				$(".client-email .validate-erro").css('display', 'block');
			}
		});
	};

	// init functions
	this.init();
});
