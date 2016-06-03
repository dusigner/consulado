require('vendors/vtex-modal-cookie');

Nitro.module('modal.overlayLead', function(){

	'use strict';

	var self = this;

	this.setup = function() {
		$('#modal-overlay-leads').vtexModal({
			cookieOptions: { expires: 0, path: '/' }
		});

		$('#vtex-modal-overlay-leads .secondary-button').click(function(e){
			e.preventDefault();

			self.registerNewsletter();
		});
	};

	this.registerNewsletter = function() {
		console.log('Cadastrar newsletter');

		//quando finalizar
		$('#vtex-modal-overlay-leads .modal-holder').addClass('success');
		$('#vtex-modal-overlay-leads .modal-header').html('<button type="button" class="close"></button>');

		setTimeout(function(){
			$('#vtex-modal-overlay-leads .modal-holder,#vtex-modal-overlay-leads').fadeOut();
		}, 2000)
	};

	self.setup();

});