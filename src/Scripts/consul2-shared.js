/* global $: true, Nitro: true */
'use strict';

import cacheSelector from './../Pages/shared/scripts/cache-selector.js';
import { decrypt, fetchProductSearch, formatPrice } from './../Pages/shared/scripts/shared-wishlist.js';
import './Dust/wishlist/wishlist-shared.html'

const El = cacheSelector.selectorAndClasses, { sharedContainer, loaderContainer, Hide } = El;

Nitro.controller('shared', () => {
    const Methods = {

        init() {
            Methods.wishShared();
        },

        wishShared() {
            const encryptedSearchParam = window.location.search.split('?listID=')[1],
                wishListID = decrypt(encryptedSearchParam);

            if (wishListID.length) {
                wishListID.split(',').forEach(async (item) => {
                        const productSearch = item && await fetchProductSearch(item),
                            data = productSearch && productSearch.reduce((arr, cur) => {
                                const imageUrl = cur.items[0].images[0].imageUrl.split('.br/')[1];

                                arr.push({
                                    productId: cur.productId,
                                    productName: cur.productName,
                                    productLink: cur.link,
                                    productImage: imageUrl,
                                    listPrice: formatPrice(cur.items[0].sellers[0].commertialOffer.ListPrice),
                                    Price: formatPrice(cur.items[0].sellers[0].commertialOffer.Price)
                                });

                                return arr;
                            }, []);

                    dust.render('wishlist-shared', data && data.find(i => i), (err, out) => {
                        if (err) {
                            throw new Error('Wish Dust error: ' + err);
                        }

                        sharedContainer
                            .removeClass(Hide)
                            .append(out);
                        loaderContainer.hide();
                    });
                });
            }
        }
    }

    Methods.init();
});