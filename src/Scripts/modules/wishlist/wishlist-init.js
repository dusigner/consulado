/* global $: true, Nitro: true, _: true */
'use strict';

import wishList from './../../components/wishlist-default.js';
import wishTags from './wishlist-tags.js';
import { dataBaseFetch, changingEvent, patchVariantFetch } from './wishlist-utils.js';
import cacheSelector from './cache-selector.js';

const El = cacheSelector.utils, { $document, userApi, wishContainer, wishButton } = El;

Nitro.module('wishlist-init', () => {

	const Methods = {

		init() {
			$(window).on('load', () => {
				fetch(userApi).then(res => res.json().then((res) => {
					setTimeout(() => {
						Methods.setFavoriteds(res);
						wishTags.init();
					}, 1250);
				}));
			});
		},

		async setFavoriteds(res) {
			if (res.IsUserDefined) {
				const response = await dataBaseFetch(res.Email);

				response.length &&
					response.map(i => i.productReference &&
						i.productReference.split(',').forEach((item) => {
							$(`.wishlist__button[data-idproduto=${item}]`).each((i, el) => {
								const $element = $(el);

								changingEvent($element);
							});
						}));

				Methods._handleFavorites(res);

			} else {
				Methods._handleFavorites(res);
			}
		},

		_handleFavorites(res) {
			$document.on('click', wishButton, ({currentTarget}) => {
				const $element = $(currentTarget),
					productID = $element.parents(wishContainer).find(wishButton).attr('data-idproduto'),
					wishListStart = new wishList(productID, res, $element);

				wishListStart.favoritesEvents();
			});

			$('.box-produto .product-infos-wrap .wishlist__container').on('click', (ev) => $(this).trigger('.box-produto .product-infos-wrap a').stopPropagation());
		},
	}

	Methods.init();
});
