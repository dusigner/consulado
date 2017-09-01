/* global $: true, Nitro: true */

'use strict';

var CRM = require('modules/store/crm');

require('vendors/jquery.cookie');
require('modules/helpers');

Nitro.module('cotas', function() {
	var self = this,
		cota = {
			consumed: 0,
			limit: 25
		},
		userData = null,
		isLogged = document.cookie.indexOf('VtexIdclientAutCookie_' + window.jsnomeLoja) >= 0,
		cotasCookie = $.cookie('xSkuSalesChannel5');

	this.init = function() {
		if( isLogged ) {
			if( cotasCookie ) {
				cota.consumed = cotasCookie;
				self.render();
			} else {
				self.getUserEmail()
					.then(self.getConsumed)
					.then(self.render);
			}
		}
	};

	this.getUserEmail = function() {
		return vtexjs.checkout.getOrderForm().done(function(res){
			userData = res.clientProfileData;
			return res;
		});
	};

	this.getConsumed = function() {
		return CRM.getCotasByCPF(userData.document)
			.then(function(userByCPF) {
				var qntd = 0;

				if( userByCPF ){
					$.each(userByCPF, function(index, user) {
						qntd += user.xSkuSalesChannel5;
					});
				}

				cota.consumed = qntd;

				$.cookie('xSkuSalesChannel5', qntd);

				return;
			});
	};

	this.render = function() {
		var template = '<div class="view-cotas text-uppercase">' +
							'<span class="view-cotas__consumidas">{consumed}</span>/' +
							'<span class="view-cotas__total">{limit}</span> ' +
							'<span class="view-cotas__text">cotas</span>' +
						'</div>';


		$('header .account .welcome-message').append(template.render(cota));
	};

	this.init();
});