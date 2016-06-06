Nitro.module('lead-newsletter', function(){

	'use strict';

	var self = this,
		$inputName = $('#form-newsletter input[name="name"]'),
		$inputEmail = $('#form-newsletter input[name="email"]'),
		clientURI = '/api/ds/pub/documents/CL',
		$inputTermos = $inputTermos,
		valid = false;

	this.setup = function() {
		$('.lead-newsletter #form-newsletter').submit(function(e){
			e.preventDefault();

			self.validateForm();

			return false;
		});
	};

	this.validateForm = function() {
		if($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length < 1 && $('input[type="checkbox"]').is(':checked')) {
			valid = true;
		} else {
			if($inputName.filter(':blank').length >= 1 ) {
				$inputName.addClass('error');
			} else {
				$inputEmail.removeClass('error');
			}

			if($inputEmail.filter(':blank').length >= 1 ) {
				$inputEmail.addClass('error');
			} else {
				$inputEmail.removeClass('error');
			}

			if ( !$('input[type="checkbox"').is(':checked') ) {
				$inputTermos.addClass('error');
			} else {
				$inputTermos.removeClass('error');
			}
		}

		if(valid) {
			var name = $inputName.val(),
				email = $inputEmail.val(),
				termos = true;

			self.registerNewsletter(name,email,termos);
		}
	};

	this.registerNewsletter = function(name,email,termos) {
		var data = {};

		data.firstName = name;
		data.email = email;
		data.isNewsletterOptIn = true;

		return $.ajax({
			url: clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		}).done(function(){
			$('.lead-newsletter').addClass('success');

			setTimeout(function(){
				$('.lead-newsletter').fadeOut();
			}, 2000)
		});
	};

	self.setup();

});