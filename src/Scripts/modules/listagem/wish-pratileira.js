/* global $: true, Nitro: true, _: true */
'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import { dataBaseFetch, changingEvent } from './../../components/WishList/wishlist-utils.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { Document, userApi, wishAddButton, wishContainer, wishButton } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		const windowHash = window.location.hash;

		fetch(userApi).then(res => res.json().then((res) => {
			setTimeout(() => {
				this.wishInit(res, windowHash);
			}, 1000);
		}));
	};

	this.wishInit = (res, windowHash = null) => {
		if (windowHash) {
			const productID = windowHash.split('#productID')[1],
				$element = $(`.wishlist__button[data-idproduto=${productID}]`),
				wishListStart = new wishList(productID, res.Email, $element);

			wishListStart.favoritesEvents();
			this.setFavoriteds(res);
		} else {
			this.setFavoriteds(res);
		}
	};

	this.setFavoriteds = (res) => {
		const wishLocalStorage = localStorage.getItem('WishList');

		if (wishLocalStorage && res.IsUserDefined) {
			const wishLocalJson = JSON.parse(wishLocalStorage).value;

			wishLocalJson.productReference.split(',').forEach((item) => {
				$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
					const $element = $(el);

					changingEvent($element);
				});
			});

			this.handleFavorites(res);
		}
		else if (res.IsUserDefined) {
			dataBaseFetch(res.Email).then(data => data.json().then((response) => {
				response &&
					response.map(i => i.productReference &&
						i.productReference.split(',').forEach((item) => {
							$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
								const $element = $(el);

								changingEvent($element);
							});
						}));
			})).then(() => this.handleFavorites(res));
		} else {
			this.handleFavorites(res);
		}
	}

	this.handleFavorites = (res) => {
		Document.on('click', wishAddButton, ({target}) => {
			const $element = $(target),
				productID = $element.parents(wishContainer).find(wishButton).attr('data-idproduto');

			if (res.IsUserDefined) {
				const wishListStart = new wishList(productID, res.Email, $element);

				wishListStart.favoritesEvents();
			} else {
				window.location.href = `/login?ReturnUrl=${window.location.pathname}#productID${productID}`;
			}
		});
	};

	this.init();
});
