'use strict';

Nitro.module('checkout.pj', function() {

	var interval;

	this.hideChangeAddress = function() {

		interval = setInterval(function(){

			if($('.address-list-placeholder .address-edit').length !== 0) {
				$('.address-list-placeholder .address-edit, .address-list-placeholder .address-create').remove();

				clearInterval(interval);
			}
		}, 300);

		setTimeout(function() { clearInterval(interval); }, 5000);
	};

	this.disableInputs = function(e) {

		$('.ship-street-text .link-edit, #dont-know-postal-code').remove();

		if (e.$element.is('#ship-postal-code, #ship-number')) {
			e.$element.attr('disabled', 'disabled');
		}
	};


});
