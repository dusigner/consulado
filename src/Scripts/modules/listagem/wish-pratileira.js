'use strict';

import wishList from './../../components/WishList/wishlist-main.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector,
	{ wishAddButton, Document } = El;

Nitro.module('wish-pratileira', function() {
	this.init = () => {
		this.handleWishList();
	};

	this.handleWishList = () => {
		$.get(`/no-cache/profileSystem/getProfile`).then((res) => {
			Document.on('click', wishAddButton, (ev) => {
				const $element = $(ev.currentTarget),
					productID = $element.attr('data-idproduto');

				if (res.IsUserDefined) {
					console.log('ola')
					const wishListStart = new wishList(productID, res.Email, $element);

					wishListStart.addProduct();
				}
			});
		});
	};

	this.init();
});
