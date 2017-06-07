'use strict';

Nitro.module('checkout.modify', function() {

	this.shippingInput = function() {
		$('.Shipping td:first').prepend('<span class="info-shipping">Frete</span>');
		$('.caret').removeClass('caret').addClass('icon icon-chevron-down');
	};


});
