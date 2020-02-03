'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { Document, userApi, wishAddButton, wishContainer, wishButton } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		const windowHash = window.location.hash;

		fetch(userApi).then(res => res.json().then((res) => {
			this.wishInit(res, windowHash);
		}));
	};

	this.wishInit = (res, windowHash = null) => {
		if (windowHash) {
			const productID = windowHash.substr(1),
				$element = $(`.wishlist__button[data-idproduto=${productID}]`),
				wishListStart = new wishList(productID, res.Email, $element);

			wishListStart.handleEvents();
			this.handleWishList(res);
		} else {
			this.handleWishList(res);
		}
	};

	this.handleWishList = (res) => {
		Document.on('click', wishAddButton, ({target}) => {
			const $element = $(target),
				productID = $element.parents(wishContainer).find(wishButton).attr('data-idproduto');

			if (res.IsUserDefined) {
				const wishListStart = new wishList(productID, res.Email, $element);

				wishListStart.handleEvents();
			} else {
				window.location.href = `/login?ReturnUrl=${window.location.pathname}#${productID}`;
			}
		});
	};

	this.init();
});
