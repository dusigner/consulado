'use strict';

var CRM = require('modules/store/crm');

Nitro.module('checkout.cotas', function() {

	var self = this;

	// Limitação de produtos por CPF
	this.limit = 25;
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
					return CRM.clientSearchByCPF(userData.document);
				})
				.then(function(userByCPF) {
					var qntd = 0;

					$.each(userByCPF, function(index, user) {
						qntd += user.xSkuSalesChannel5;
					});

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
			var qtd = o;

			if (value && value.productCategoryIds && /^\/1\//g.test(value.productCategoryIds)) {
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

		if (totalEletrodomesticos > self.limit) {

			window.vtex.checkout.MessageUtils.showMessage({
				text: 'Atenção - Somente é permitido ' + self.limit + ' produtos de Eletrodoméstico por ano. Você já comprou ' + actual + ' produtos.',
				status: 'info'
			});

			self.$actionButton.addClass('disabled').attr('disabled', 'disabled');
		} else {

			self.$actionButton.removeClass('disabled').removeAttr('disabled');

			try {
				localStorage.setItem('cota_eletrodomestico', totalEletrodomesticos);
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
		return $('.orderplaced-sending-email strong').text().replace(/\s+/g, '');
	};

	/*
	 * Ao finalizar compra (orderplaced) atualiza MD com novo valor consumido de cotas
	 */
	this.updateCotasEletrodomesticos = function() {

		var eletrodomesticos = 0;

		try {
			eletrodomesticos = parseInt(localStorage.getItem('cota_eletrodomestico'));
		} catch(ex) {
			return false;
		}

		if(eletrodomesticos > 0) {
			CRM.insertClient({ email: self._getEmailClient(), xSkuSalesChannel5: eletrodomesticos })
				.then(function() {

					try {
						localStorage.removeItem('cota_eletrodomestico');
					} catch(ex) {
						return false;
					}
				});
		}
	};

});
