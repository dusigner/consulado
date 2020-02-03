'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.auxiliars, { Document, userApi, wishAddButton, wishContainer, wishButton } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		this.handleWishList();
	};

	this.handleWishList = () => {
		fetch(userApi).then(res => res.json().then((res) => {
			Document.on('click', wishAddButton, ({target}) => {
				const $element = $(target),
					productID = $element.parents(wishContainer).find(wishButton).attr('data-idproduto');

				if (res.IsUserDefined) {
					const wishListStart = new wishList(productID, res.Email, $element);

					wishListStart.handleEvents();
				}
			});
		}));
	};

	this.init();
});
