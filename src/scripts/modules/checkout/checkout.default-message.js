'use strict';

Nitro.module('checkout.default-message', function() {

	var msg = $('.js-default-message').text();

	if( msg ) {
		window.vtex.checkout.MessageUtils.showMessage({
			text: msg,
			status: 'info'
		});
	}

	return;

});
