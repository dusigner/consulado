/* global $: true, Nitro: true */
'use strict';
Nitro.module('callcenter', function () {
	const self = this;
	this.loginAutomaticCallcenter = function() {
		(window.location.hostname.indexOf('empresa') !== -1) && 
		$(document).on('click', '#impersonateButton.cc-btn-change', function() {
			store.logout();
			window.location.href = '/';
		});
		$(document).ajaxStop(function() {
			var emailCallcenter = $('#vtex-callcenter__customer-email');
			if( emailCallcenter.length > 0 && $('body').hasClass('pre-home')) {
				$('.form-login.pre-home-form  .email').val(emailCallcenter.text());
				$('.form-login.pre-home-form').trigger('submit');
			}
		});
	};
	self.loginAutomaticCallcenter();
});