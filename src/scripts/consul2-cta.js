
/* global VERSION: true, Nitro: true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');

Nitro.setup('cta', function() {
	console.log('teste');

	var $body = $('body');
	
	var self = this,
	urlParams = _.urlParams(), //parse params from url
	skuid = 446;
	this.init = function() {
		
		setTimeout(() => {
			vtexjs.checkout.addToCart([{
				id: skuid,
				quantity: 1,
				seller: 1
			}]).done(function(orderForm) {
				window.location.replace('/checkout/#/payment');
			});
		}, 5000);
		
	};

	this.init();

});
