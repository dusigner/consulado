'use strict';

var CRM = require('modules/store/crm');

Nitro.module('checkout.cotas', function() {

	var self = this;

	// Limitação de produtos por CNPJ ou CPF
	this.limit = store.isCorp ? 10 : 25;
	// Botões que devem sofrer alteração/bloqueio
	this.$actionButton = $('.fake-buttom, #payment-data-submit');

	/*
	 * Faz chamadas do MD para resgatar dados do usuário e somar todas cotas compradas neste CPF
	 * @return {Function|Promise}
	 */
	this.getData = function() {

		var userData;

		return CRM.clientSearchByEmail(self.orderForm.clientProfileData.email)
				.then(function(user) {
					userData = user;

					if(userData.corporateDocument || userData.document) {
						if (store && store.isCorp) {
							return CRM.clientSearchByDocument(userData.corporateDocument, 'corporateDocument');
						} else {
							return CRM.clientSearchByDocument(userData.document, 'document');
						}
					}else {
						return false;
					}
				})
				.then(function(userByDocument) {
					var qntd = 0;
					if( userByDocument ) {
						$.each(userByDocument, function(index, user) {
							qntd += user.xSkuSalesChannel5;
						});
					}

					userData.xSkuSalesChannel5 = qntd;
				})
				.then(function() { return userData; });
	};

	/*
	 ** private filterEletrodomesticos
	 * Varre itens do carrinho somando quantidade de todos do departamento "1" (Eletrodomésticos)
	 * @return {Int}
	 */
	this._filterEletrodomesticos = function() {
		return $.reduce(self.orderForm.items, function(o, value) {
			var qtd = o,
				categoryRegexID = store.isCorp ? /^\/80\//g : /^\/1\//g;

			if (value && value.productCategoryIds && categoryRegexID.test(value.productCategoryIds)) {
				qtd = o + value.quantity;
			}

			return qtd;
		}, 0);
	};

	/*
	 * Verifica se bateu na limitação e faz ações/bloqueios necessários, caso nao tenha batido limite grava novo valor em localstorage
	 * @param {Int} userData.xSkuSalesChannel5
	 * @return {Boolean}
	 */
	this.limitQuantity = function(actual) {

		var quantity = self._filterEletrodomesticos(),
			totalEletrodomesticos = quantity + actual;

		self.$actionButton = $('.fake-buttom, #payment-data-submit');

		if (totalEletrodomesticos > self.limit) {

			window.vtex.checkout.MessageUtils.showMessage({
				text: 'Atenção - Somente é permitido ' + self.limit + ' produtos de Eletrodoméstico por ano. Você já comprou ' + actual + ' produtos.',
				status: 'info'
			});

			self.$actionButton.addClass('disabled').attr('disabled', 'disabled');
		} else {
			self.$actionButton.removeClass('disabled').removeAttr('disabled');

			try {
				$.cookie('cota_eletrodomestico', totalEletrodomesticos);
			} catch(ex) {
				return false;
			}
		}

		return totalEletrodomesticos > self.limit;
	};

	/*
	 ** private getEmailClient
	 * Recupera e-mail do cliente no orderplaced
	 * @return {String}
	 */
	this._getEmailClient = function() {
		if(store && store.userData && store.userData.email) {
			return store.userData.email;
		}
		return $('.orderplaced-sending-email strong').text().replace(/\s+/g, '');
	};

	/*
	 * Define uma propriedade no cookie de login do compracerta
	 * O Módulo de cluster ficará responsavel por atualizar os dados das cotas do usuário.
	 */
	this.updatePendingCotas = function() {

		CRM.clientSearchByEmail(store.userData.email).then(function(res){

			res.pending = true;

			store.setUserData(res, true);
		});

	};

	/*
	 * Ao finalizar compra (orderplaced) atualiza MD com novo valor consumido de cotas
	 */
	this.updateCotasEletrodomesticos = function() {

		var eletrodomesticos = 0;

		try {
			eletrodomesticos = parseInt($.cookie('cota_eletrodomestico'));
		} catch(ex) {
			return false;
		}

		if(eletrodomesticos > 0) {
			CRM.insertClient({ email: self._getEmailClient(), xSkuSalesChannel5: eletrodomesticos })
				.then(function() {

					try {
						$.removeCookie('cota_eletrodomestico');
					} catch(ex) {
						return false;
					}
				});
		}
	};

});
