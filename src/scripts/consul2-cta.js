'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup('cta', function() {

	var $body = $('body');
	
	var self = this,
		urlParams = _.urlParams(), //parse params from url
		skuid = ( urlParams.skuid ? urlParams.skuid : null ),
		emailUser = ( window.atob(urlParams.email) ? window.atob(urlParams.email) : null );
	
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
	
				// Redirecionando para o Checkout Payment
				window.location.replace('/checkout/#/payment');
	
			});

		}).fail(function(){
			window.location.replace('/');
		});
	};

	this.init();

});
