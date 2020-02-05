/* global $: true, Nitro: true */
'use strict';

import { decrypt } from './../Pages/shared/scripts/shared-wishlist.js';
import './Dust/wishlist/wishlist.html'

Nitro.controller('shared', function() {
    this.init = () => {
        this.wishShared();
    };

    this.wishShared = async () => {
        try {
            const encryptedSearchParam = window.location.search.split('?')[1],
            wishListID = decrypt(encryptedSearchParam),
            wishListRESPONSE = await (await fetch(`/api/dataentities/WL/search?id=${wishListID}&_fields=productReference`)).json(),
            productIDS = wishListRESPONSE &&
                wishListRESPONSE.map(i => i.productReference);

            if (productIDS.length) {
                productIDS.find((ids) => {
                    ids.split(',').forEach(async (item) => {
                        const productVariations = await (await fetch(`/api/catalog_system/pvt/products/ProductGet/${item}`)).json(),
                            productREF = productVariations.RefId,
                            productSearch = await (await fetch(`/api/catalog_system/pub/products/search/${productREF}`)).json();

                            productSearch
                                && productSearch.map((data) => {
                                    dust.render('wishlist', data, (err, out) => {
                                        if (err) {
                                            throw new Error('Wish Dust error: ' + err);
                                        }

                                        $('.container').append(out);
                                    });
                            });
                    });
                });
            }
        } catch (err) {
            throw new Error('SharedPage Error: ' + err);
        }
    }

    this.init();
});