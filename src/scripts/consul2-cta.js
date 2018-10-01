
/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup('cta', function() {

	var $body = $('body');
	
	var self = this,
	urlParams = _.urlParams(), //parse params from url
	skuid = urlParams.skuid,
	// emailUser = urlParams.email;
	emailUser = window.atob(urlParams.email);
	
	this.init = function() {
		vtexjs.checkout.getOrderForm().done(function(){
			
			//avisar o VTEX ID que o email do cliente mudou
			if (window.vtexid) {
				window.vtexid.setEmail(emailUser);
			}
	
			// levantar o evento para o script de navegação
			window.vtex.NavigationCapture && window.vtex.NavigationCapture.sendEvent('SendUserInfo', {
				visitorContactInfo: [emailUser, '']
			});
	
			// Avisar ao Checkout qual o email do cliente
			window.vtexjs.checkout.sendAttachment('clientProfileData', {email: emailUser});
			
			vtexjs.checkout.addToCart([{
				id: skuid,
				quantity: 1,
				seller: 1
			}]).done(function(orderForm) {
	
				window.location.replace('/checkout/#/payment');
	
			});

		});
	};

	this.init();

});
