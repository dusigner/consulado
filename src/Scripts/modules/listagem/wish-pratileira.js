/* global $: true, Nitro: true, _: true */
'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import { dataBaseFetch, changingEvent } from './../../components/WishList/wishlist-utils.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { $document, userApi, wishContainer, wishButton } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		const windowHash = window.location.hash;

		$(window).on('load', () => {
			fetch(userApi).then(res => res.json().then((res) => {
				window.location.pathname.indexOf('login') === -1 &&
					setTimeout(() => { this.wishInit(res, windowHash)}, 1250);
			}));
		});
	};

	this.wishInit = (res, windowHash = null) => {
		if (windowHash && windowHash.indexOf('productID' ) !== -1) {
			const productID = windowHash.split('#productID')[1];

			$(`.wishlist__button[data-idproduto=${productID}]`).each((i, el) => {
				const $element = $(el),
					wishListStart = new wishList(productID, res, $element);

				wishListStart.favoritesEvents();
			});

			window.location.hash = '';
			this._handleFavorites(res);
		} else {
			this._setFavoriteds(res);
		}
	};

	this._setFavoriteds = (res) => {
		const wishLocalStorage = localStorage.getItem('WishList');

		if (wishLocalStorage && res.IsUserDefined) {
			const wishLocalJson = JSON.parse(wishLocalStorage).value;

			wishLocalJson.productReference.split(',').forEach((item) => {
				$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
					const $element = $(el);

					changingEvent($element);
				});
			});

			this._handleFavorites(res);
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
			})).then(() => this._handleFavorites(res));
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
	};

	this.init();
});
