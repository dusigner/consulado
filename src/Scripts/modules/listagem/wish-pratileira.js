/* global $: true, Nitro: true, _: true */
'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import { dataBaseFetch, changingEvent } from './../../components/WishList/wishlist-utils.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { $document, userApi, wishContainer, wishButton } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {

		$(window).on('load', () => {
			fetch(userApi).then(res => res.json().then((res) => {
				setTimeout(() => { this.setFavoriteds(res)}, 1250);
			}));
		});
	};

	this.setFavoriteds = async (res) => {
		const wishLocalStorage = localStorage.getItem('WishList');

		if (res.IsUserDefined) {
			if (!wishLocalStorage) {
				const response = await dataBaseFetch(res.Email);

				response &&
					response.map(i => i.productReference &&
						i.productReference.split(',').forEach((item) => {
							$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
								const $element = $(el);

								changingEvent($element);
							});
						}));

				this._handleFavorites(res);
			} else {
				const wishLocalJson = JSON.parse(wishLocalStorage).value;

				wishLocalJson.productReference.split(',').forEach((item) => {
					$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
						const $element = $(el);

						changingEvent($element);
					});
				});

				this._handleFavorites(res);
			}
		} else {
			this._handleFavorites(res);
		}
	}

	this._handleFavorites = (res) => {
		$document.on('click', wishButton, ({currentTarget}) => {
			const $element = $(currentTarget),
				productID = $element.parents(wishContainer).find(wishButton).attr('data-idproduto'),
				wishListStart = new wishList(productID, res, $element);

			wishListStart.favoritesEvents();
		});
		$('.box-produto .product-infos-wrap a').on('click', ev => ev.stopPropagation());
	};

	this.init();
});
