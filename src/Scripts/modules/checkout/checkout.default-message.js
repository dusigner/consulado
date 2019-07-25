'use strict';

Nitro.module('checkout.default-message', function() {
	var msg = $(window).width() <= 768 ? $('.js-default-message--mobile').text() : $('.js-default-message').text();

	if (msg) {
		window.vtex.checkout.MessageUtils.showMessage({
			text: msg,
			status: 'info'
		});
	}

	return;
});
