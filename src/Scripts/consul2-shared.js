/* global $: true, Nitro: true */
'use strict';

import { decrypt } from './../Pages/shared/scripts/shared-wishlist.js';
import './Dust/wishlist/wishlist-shared.html'

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

                            console.log(productSearch);

                            productSearch
                                && productSearch.map((r) => {
                                    const imageUrl = r.items[0].images[0].imageUrl.split('.br/')[1],
                                        data = {
                                            productId: r.productId,
                                            productName: r.productName,
                                            productLink: r.link,
                                            productImage: imageUrl,
                                            listPrice: r.items[0].sellers[0].commertialOffer.ListPrice.toLocaleString('pt-br',{ style: 'currency', currency: 'BRL'}),
                                            Price: r.items[0].sellers[0].commertialOffer.Price.toLocaleString('pt-br',{ style: 'currency', currency: 'BRL'})
                                        };

                                    console.log(data);

                                    dust.render('wishlist-shared', data, (err, out) => {
                                        if (err) {
                                            throw new Error('Wish Dust error: ' + err);
                                        }

                                        $('.shared__ws-container').append(out);
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