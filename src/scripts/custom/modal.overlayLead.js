require('vendors/jquery.form-validator');
require('vendors/vtex-modal-cookie');

Nitro.module('modal.overlayLead', function(){

	'use strict';

	var self = this,
		$inputName = $('#modal-overlay-leads input[type="text"]'),
		$inputEmail = $('#modal-overlay-leads input[type="email"]'),
		$inputTermos = $('#modal-overlay-leads input[type="checkbox"]'),
		valid = false,
		hasSession = false,
		clientURI = '/api/ds/pub/documents/CL';

	this.setup = function(orderForm) {
		$( 'body' ).on('mouseleave',function(e) {
			if ( ! hasSession && ! orderForm.clientProfileData.email ) {
				hasSession = sessionStorage.getItem('leadNewsletter');

				if ((e.pageY - $(window).scrollTop()) <= 1 && !hasSession && !$.cookie( 'visualizacaoOverlays' )) {
					$('#modal-overlay-leads').vtexModal({
						cookieName: 'visualizacaoOverlays',
						cookieOptions: { expires: 30, path: '/' }
					});

					$('#vtex-modal-overlay-leads').submit(function(e){
						e.preventDefault();

						$('#modal-overlay-leads input').on('blur',function(){
							self.validateInputs();
						});

						self.validateForm();

						return false;
					});
				}
			}
		});
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
		if($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length  < 1 && $inputTermos.is(':checked')) {
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

		return $.ajax({
			url: clientURI,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8'
		}).done(function(){
			$('#vtex-modal-overlay-leads .modal-holder').addClass('success');
			$('#vtex-modal-overlay-leads .modal-header').html('<button type="button" class="close"></button>');

			sessionStorage.setItem('leadNewsletter', true);

			$('.lead-newsletter').fadeOut();

			setTimeout(function(){
				$('#vtex-modal-overlay-leads .modal-holder,#vtex-modal-overlay-leads').fadeOut();
			}, 2000);
		});
	};

	window.vtexjs.checkout.getOrderForm().done(function(result) {
		self.setup(result);
	});

});
