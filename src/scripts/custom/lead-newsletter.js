Nitro.module('lead-newsletter', function(){

	'use strict';

	var self = this;

	this.setup = function() {
		$('.lead-newsletter .secondary-button').click(function(e){
			e.preventDefault();

			self.registerNewsletter();
		});
	};

	this.registerNewsletter = function() {
		console.log('Cadastrar newsletter');

		//quando finalizar
		$('.lead-newsletter').addClass('success');

		setTimeout(function(){
			$('.lead-newsletter').fadeOut();
		}, 2000)
	};

	self.setup();

});