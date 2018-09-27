
/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup('cta', function() {

	var $body = $('body');
	
	var self = this,
	urlParams = _.urlParams(), //parse params from url
	skuid = 538,
	emailUser = 'fabio.haddad@jussi.com.br';

	
	this.init = function() {
		// setTimeout(() => {
		// 	//avisar o VTEX ID que o email do cliente mudou
		// 	if (window.vtexid) {
		// 		window.vtexid.setEmail('guilherme.paiva+TESTETESTE@jussi.com.br');
		// 	}
	
		// 	// levantar o evento para o script de navegação
		// 	window.vtex.NavigationCapture && window.vtex.NavigationCapture.sendEvent('SendUserInfo', {
		// 		visitorContactInfo: ['guilherme.paiva+TESTETESTE@jussi.com.br', '']
		// 	});
	
		// 	// Avisar ao Checkout qual o email do cliente
		// 	window.vtexjs.checkout.sendAttachment('clientProfileData', {email: 'guilherme.paiva+TESTETESTE@jussi.com.br'});
			
		// 	vtexjs.checkout.addToCart([{
		// 		id: skuid,
		// 		quantity: 1,
		// 		seller: 1
		// 	}]).done(function(orderForm) {
	
		// 		window.location.replace('/checkout/#/payment');
	
		// 	});

		// }, 5000);
		
	};

	this.init();

});
