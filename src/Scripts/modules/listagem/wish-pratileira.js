'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import { dataBaseFetch, changingEvent } from './../../components/WishList/wishlist-utils.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { Document, userApi, wishAddButton, wishContainer, wishButton, Wished } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		const windowHash = window.location.hash;

		fetch(userApi).then(res => res.json().then((res) => {
			this.wishInit(res, windowHash);
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
		if (res.IsUserDefined) {
			dataBaseFetch(res.Email).then(data => data.json().then((response) => {
				response &&
					response.map(i => i.productReference &&
						i.productReference.split(',').forEach((item) => {
							changingEvent($(`.wishlist__button[data-idproduto=${item}]`))
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
