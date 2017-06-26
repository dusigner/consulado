/* global $: true, Nitro: true, store: true */
'use strict';

var CRM = require('modules/store/crm');

Nitro.module('vtex-login', function () {

	var self = this;

	this.setup = function () {

		if (store.isPrivateUrl && store.userData) {

			window.vtexjs.checkout.getOrderForm().done(function (data) {
				self.setClientProfileData(data);
			});

		}

		//vtexjs.checkout.getOrderForm().then(setClientProfileData);

	};

	this.setClientProfileData = function (orderForm) {

		//console.log('setClientProfileData', orderForm);

		if (orderForm.clientProfileData && (orderForm.clientProfileData.email === store.userData.email)) {
			//console.log('não foi deslogdo');
			return $.Deferred;
		}


		var clientProfileData = $.extend({}, orderForm.clientProfileData, store.userData);

		clientProfileData.documentType = 'cnpj';

		//avisar o VTEX ID que o email do cliente mudou
		window.vtexid.setEmail(clientProfileData.email);

		// levantar o evento para o script de navegação
		window.vtex.NavigationCapture.sendEvent('SendUserInfo', {
			visitorContactInfo: [clientProfileData.email, clientProfileData.firstName]
		});

		// Avisar ao Checkout qual o email do cliente
		return window.vtexjs.checkout.sendAttachment('clientProfileData', clientProfileData).then(function () {
			//Caso o usuário era novo e não possuia um userId, atualiza o store com o novo userData
			if (!store.userData.userId) {
				CRM.clientSearchByEmail(store.userData.email)
					.then(function (data) {
						//console.log('novo user Data', data);
						store.setUserData(data, true);
					});
			}
		});
	};

	if (store && store.isCorp) {
		this.setup();
	}

});
