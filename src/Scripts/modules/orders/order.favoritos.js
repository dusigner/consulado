'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('Dust/orders/favoritos.html');

var CRM = require('modules/store/orders-crm');

Nitro.module('order.favoritos', function() {
	var self = this;

	this.$container = $('#myorders'); //Container geral
	this.$favoritosContainer = $('#favoritos-render'); //Container de recorrências
	this.favoritos = {
		favoritos: null,
		isLoaded: false
	}; //Status geral do módulo
	this.$modals = $('#order-modals'); //Container de modals

	/**
	 * Função bootstrap recurrence | Carrega e atribui subscriptions da API p/ o módulo e/ou renderiza o módulo Recorrências
	 */
	this.init = function() {
		self.$container.addClass('myorders--loading');

		if (!self.favoritos.favoritos) {
			CRM.getRecurrences()
				.then(function(res) {
					if (res.status === 'INACTIVE') {
						$.each(res.items, function(i, v) {
							v.status = 'INACTIVE';
						});
					}

					self.favoritos.favoritos = res;

					// Criar string com periodo de recorrência final
					$.each(self.favoritos.favoritos.items, function(i, item) {
						item.frequency.frequency =
							item.frequency.interval + ' ' + dust.filters.frequencyText(item.frequency.periodicity);
					});

					self.recurrenceRender(self.favoritos.favoritos);

					return res;
				})
				.then(function(res) {
					return CRM.getAccounts(res.id).then(function(res) {
						self.accountRender(res);

						return res;
					});
				})
				.then(function(res) {
					CRM.getAddresses(res.subscription).then(function(res) {
						self.addressRender(res);
					});
				})
				.fail(function() {
					self.$container.removeClass('myorders--loading');
					self.favoritos.isLoaded = true;
					self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
				});
		} else {
			self.recurrenceRender(self.favoritos.favoritos);
		}
	};

	/**
	 * Reseta módulo de recorrência
	 */
	this.resetRecurrence = function() {
		self.favoritos.favoritos = null;
		self.favoritos.isLoaded = false;
		self.$favoritosContainer.find('*').unbind();
		self.$favoritosContainer.html('');
		self.init();
	};
});
