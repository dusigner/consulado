Nitro.module('lead-newsletter', function(){

	'use strict';

	var self = this,
		$inputName = $('#form-newsletter input[type="text"]'),
		$inputEmail = $('#form-newsletter input[type="email"]'),
		$inputTermos = $('#form-newsletter input[type="checkbox"]'),
		valid = false,
		hasSession = sessionStorage.getItem('leadNewsletter'),
		clientURI = '/api/ds/pub/documents/CL';

	this.setup = function(orderForm) {
			if ( ! hasSession && ! orderForm.clientProfileData.email ) {
				$('.lead-newsletter').fadeIn();

				$('.lead-newsletter #form-newsletter').submit(function(e){
					e.preventDefault();

					$('#form-newsletter input').on('blur',function(){
						self.validateInputs();
					});

					self.validateForm();

					return false;
				});
			}
	};

	this.validateInputs = function() {
		if($inputName.filter(':blank').length >= 1 ) {
			$inputName.addClass('error');
		} else {
			$inputName.removeClass('error');
		}

		if($inputEmail.filter(':blank').length >= 1 ) {
			$inputEmail.addClass('error');
		} else {
			$inputEmail.removeClass('error');
		}

		if ( !$inputTermos.is(':checked') ) {
			$inputTermos.addClass('error');
		} else {
			$inputTermos.removeClass('error');
		}
	};

	this.validateForm = function() {
		if($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length < 1 && $inputTermos.is(':checked')) {
			valid = true;
		} else {
			self.validateInputs();
		}

		if(valid) {
			var name = $inputName.val(),
				email = $inputEmail.val();

			self.registerNewsletter(name,email);
		}
	};

	this.registerNewsletter = function(name,email) {
		var data = {};

		data.firstName = name;
		data.email = email;
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
		}).done(function(){
			$('.lead-newsletter').addClass('success');

			sessionStorage.setItem('leadNewsletter', true);

			setTimeout(function(){
				$('.lead-newsletter').fadeOut();
			}, 2000);
		});
	};

	window.vtexjs.checkout.getOrderForm().done(function(result) {
		self.setup(result);
	});

});
