'use strict';

require('vendors/jquery.whp-modal');
require('modules/orders/order.helpers');

require('Dust/orders/favoritos.html');

import cacheSelector from '../../../Pages/shared/scripts/cache-selector.js';
import { encrypt, formatPrice, copyToClipBoard } from './../../../Pages/shared/scripts/shared-wishlist.js'

const El = cacheSelector.selectorAndClasses, { Hide } = El;


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

			if(!self.$favoritosContainer.find('.order__favoritos').length && !self.$favoritosContainer.find('.order__favoritos-share').length) {
				fetch('/no-cache/profileSystem/getProfile').then(response => response.json())
					.then(result => {
						const emailUser = result.Email;

						$.ajax({
							url: `/api/dataentities/WL/search?email=${emailUser}&_fields=id,productReference`,
							method: 'GET',
							headers: {
								accept: 'application/json',
								'Content-type': 'application/json',
							},
							cache: false
						}).then((prodFavorito) => {

							const wishID = prodFavorito.map(i => i.id);

							self.$favoritosContainer.append(`
								<div class='order__favoritos-share hide' value='${window.location.origin}/shared-list?listID=${encrypt(String(wishID))}'>
									<i></i>
									<p>Compartilhe sua lista</p>
								</div>
							`)

							const referencia = prodFavorito[0].productReference.split(',');

							if(referencia.length === 0) {
								self.$container.removeClass('myorders--loading');
								self.favoritos.isLoaded = true;
								self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
								return;
							}

							referencia.forEach(id => {
								fetch('/api/catalog_system/pub/products/search?fq=productId:' + id).then(response => response.json())
									.then(exibir => {
										if (exibir[0]) {
											let productID = exibir[0].productId;
											let urlImg = exibir[0].items[0].images[0].imageUrl.split('.br')[1];
											let nomeProduto = exibir[0].items[0].nameComplete;
											let precoProduto = formatPrice(exibir[0].items[0].sellers[0].commertialOffer.Price);
											let precoAnterior = formatPrice(exibir[0].items[0].sellers[0].commertialOffer.ListPrice);
											let linkProduto = exibir[0].link;

											const data = {
												productID: productID,
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
												$('.order__favoritos-share').removeClass(Hide);
											});
										}
									}).catch(err => {
										self.$container.removeClass('myorders--loading');
										self.favoritos.isLoaded = true;
										self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
										console.error('erro', err);
									});
							});
						}).fail(err => {
								self.$container.removeClass('myorders--loading');
								self.favoritos.isLoaded = true;
								self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
								console.error('erro', err);
							});
					}).catch(err => {
						self.$container.removeClass('myorders--loading');
						self.favoritos.isLoaded = true;
						self.$favoritosContainer.html('<h2 class="text-center">Não há favoritos</h2>');
						console.error('erro', err);
					});
				} else {
					self.$container.removeClass('myorders--loading');
				}

		} else {
			self.recurrenceRender(self.favoritos.favoritos);
		}
		$(document).on('click', '.order__favoritos-share', ({currentTarget}) => {
			const $element = $(currentTarget),
				t = String($element.attr('value'));

			copyToClipBoard(t);
			$element.find('p').text('Link da lista copiado!');
		});
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
