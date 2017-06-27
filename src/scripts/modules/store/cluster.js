/* global store: true */
'use strict';

require('vendors/jquery.cookie');

var CRM = require('modules/store/crm');

Nitro.module('cluster', function() {
	this.init = function() {

		//update user data
		if (store && store.userData && store.userData.pending) {

			return setTimeout(this.updateCotas, 1000);
		}


	};
	
	this.updateCotas = function(done) {
		return CRM.clientSearchByEmail(store.userData.email)
			.then(function(data) {
				data.pending = false;

				/**
				 * define documento padrão para CPF
				 */
				var documento = store.userData.document;
				var tipoDocumento = 'document';

				/**
				 * Se for Consul Empresa define o documento para CNPJ
				 */
				if( store.isCorp) {
					documento = store.userData.corporateDocument;
					tipoDocumento = 'corporateDocument';
				}
				/**
				 * pesquisa todos os usuários com o mesmo documento
				 */
				return CRM.clientSearchByDocument(documento, tipoDocumento).done(function (res){

					var qntd = 0;

					//soma a quantidade de Eletrodomésticos comprados por esses usuários
					$.each(res, function(index, user) {
						qntd += user.xSkuSalesChannel5;
					});

					data.xSkuSalesChannel5PerDocument = qntd;

					return store.setUserData(data, true);
				});

			})
			.done(done || this.init);

	};

	this.init();
});
