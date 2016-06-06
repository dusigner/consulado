require('vendors/jquery.form-validator');
require('vendors/vtex-modal-cookie');

Nitro.module('modal.overlayLead', function(){

	'use strict';

	var self = this,
		$inputName = $('#modal-overlay-leads input[name="name"]'),
		$inputEmail = $('#modal-overlay-leads input[name="email"]'),
		clientURI = '/api/ds/pub/documents/CL',
		valid = false;

	this.setup = function() {
		$( 'body' ).on('mouseleave',function(e){
			$('#modal-overlay-leads').vtexModal({
				cookieOptions: { expires: 1, path: '/' }
			});
		});

		$('#vtex-modal-overlay-leads #form-newsletter-overlay').submit(function(e){
			e.preventDefault();

			self.validateForm();

			return false;
		});
	};

	this.validateForm = function() {
		if($inputName.filter(':blank').length < 1 && $inputEmail.filter(':blank').length < 1) {
			valid = true;
		} else {
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

			setTimeout(function(){
				$('#vtex-modal-overlay-leads .modal-holder,#vtex-modal-overlay-leads').fadeOut();
			}, 2000)
		});
	};

	self.setup();

});