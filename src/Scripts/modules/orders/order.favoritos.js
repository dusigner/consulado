'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('Dust/orders/favoritos.html');

import cacheSelector from '../../../Pages/shared/scripts/cache-selector.js';

const El = cacheSelector.selectorAndClasses, { sharedContainer, loaderContainer, Hide } = El;


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

			fetch('/no-cache/profileSystem/getProfile').then(response => response.json())
				.then(result => {
					const emailUser = result.Email;

					fetch('/api/dataentities/WL/search?email=' + emailUser + '&_fields=id,productReference').then(response => response.json())
						.then(prodFavorito => {

							const referencia = prodFavorito[0].productReference.split(',');

							if(referencia.length === 0) {
								self.$container.removeClass('myorders--loading');
								self.favoritos.isLoaded = true;
								self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
								return;
							}

							referencia.forEach(id => {
								fetch('/api/catalog_system/pvt/products/ProductGet/' + id).then(response => response.json())
									.then(idProduto => {
										const RefIdProduto = idProduto.RefId;

										fetch('/api/catalog_system/pub/products/search/' + RefIdProduto).then(response => response.json())
											.then(exibir => {
												let urlImg = exibir[0].items[0].images[0].imageUrl.split('.br')[1];
												let nomeProduto = exibir[0].items[0].nameComplete;
												let precoProduto = exibir[0].items[0].sellers[0].commertialOffer.Price;
												let precoAnterior = exibir[0].items[0].sellers[0].commertialOffer.ListPrice;
												let linkProduto = exibir[0].link;
												let qtdProdutos = exibir[0].items[0].sellers[0].commertialOffer.AvailableQuantity;

												const data = {
													productImage: urlImg,
													productName: nomeProduto,
													linkProduto: linkProduto,
													precoAnterior: precoAnterior,
													precoProduto: precoProduto
												};

												dust.render('favoritos', data, (err, out) => {
													if (err) {
														throw new Error('Wish Dust error: ' + err);
													}
													self.$favoritosContainer
														.removeClass(Hide)
														.append(out);
													self.$container.removeClass('myorders--loading');
												});
											})
											.catch(err => {
												self.$container.removeClass('myorders--loading');
												self.favoritos.isLoaded = true;
												self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos err</h2>');
												console.error('erro', err);
											});
									})
									.catch(err => {
										self.$container.removeClass('myorders--loading');
										self.favoritos.isLoaded = true;
										self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos  eeerr</h2>');
										console.error('erro', err);
									});
							});
						})
						.catch(err => {
							self.$container.removeClass('myorders--loading');
							self.favoritos.isLoaded = true;
							self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos fim</h2>');
							console.error('erro', err);
						});
				})
				.catch(err => {
					self.$container.removeClass('myorders--loading');
					self.favoritos.isLoaded = true;
					self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
					console.error('erro', err);
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
