/* global $: true, Nitro: true */
'use strict';

import cacheSelector from './../Pages/shared/scripts/cache-selector.js';
import { decrypt, fetchSharedList, fetchProductVariations, fetchProductSearch, formatPrice } from './../Pages/shared/scripts/shared-wishlist.js';
import './Dust/wishlist/wishlist-shared.html'

const El = cacheSelector.selectorAndClasses, { sharedContainer, loaderContainer, Hide } = El;

Nitro.controller('shared', function() {
    this.init = () => {
        this.wishShared();
    };

    this.wishShared = async () => {
        try {
            const encryptedSearchParam = window.location.search.split('?listID=')[1],
            wishListID = decrypt(encryptedSearchParam),
            wishListRESPONSE = await (await fetchSharedList(wishListID)).json(),
            productIDS = wishListRESPONSE &&
                wishListRESPONSE.map(a => a.productReference);

            if (productIDS.length) {
                productIDS.find((ids) => {
                    ids.split(',').forEach(async (item) => {
                        const productVariations = await (await fetchProductVariations(item)).json(),
                            refID = productVariations.RefId,
                            productSearch = await (await fetchProductSearch(refID)).json();

                            productSearch
                                && productSearch.map((d) => {
                                    const imageUrl = d.items[0].images[0].imageUrl.split('.br/')[1],
                                        data = {
                                            productId: d.productId,
                                            productName: d.productName,
                                            productLink: d.link,
                                            productImage: imageUrl,
                                            listPrice: formatPrice(d.items[0].sellers[0].commertialOffer.ListPrice),
                                            Price: formatPrice(d.items[0].sellers[0].commertialOffer.Price)
                                        };

                                    dust.render('wishlist-shared', data, (err, out) => {
                                        if (err) {
                                            throw new Error('Wish Dust error: ' + err);
                                        }

                                        sharedContainer
                                            .removeClass(Hide)
                                            .append(out);
                                        loaderContainer.hide();
                                    });
                            });
                    });
                });
            }
        } catch (err) {
            loaderContainer.hide();
            window.alert('Ocorreu um erro ao carregar essa lista :(');
            window.location.href = '/';

            throw new Error('SharedPage Error: ' + err);
        }
    }

    this.init();
});