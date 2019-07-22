/* global $: true, Nitro: true */
'use strict';
Nitro.module('callcenter', function() {
	const self = this;
	this.loginAutomaticCallcenter = function() {
		window.location.hostname.indexOf('empresa') !== -1 &&
			/* when you click 'Trocar de Cliente' */
			$(document).on('click', '#impersonateButton.cc-btn-change', function() {
				store.logout();
				/* Redirect */
				window.location.href = '/';
			});
		$(document).ajaxStop(function() {
			/* Check email to login */
			const checkLoginCallcenter = setInterval(() => {
				const emailCallcenter = $('span#vtex-callcenter__customer-email');
				if (emailCallcenter.length > 0 && $('body').hasClass('pre-home')) {
					/* cleans the checkLoginCallcenter */
					clearInterval(checkLoginCallcenter);
					/* put the email in the field and click on login */
					$('.form-login.pre-home-form  .email').val(emailCallcenter.text());
					$('.pre-home #main fieldset button').click();
				}
			}, 800);
		});
	};
	self.loginAutomaticCallcenter();
});
