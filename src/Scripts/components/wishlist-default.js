import cacheSelector from './../modules/wishlist/cache-selector.js';
import { patchVariantFetch, dataBaseFetch, arrayFormat, changingEvent } from './../modules/wishlist/wishlist-utils.js';

const El = cacheSelector.utils, { wishContainer, Loading } = El;

class wishList {
    constructor (productID, res, elementSelector) {
        this.productID = productID;
        this.res = res;
        this.elementSelector = elementSelector;
        this.arr = new Array;
    }

    async favoritesEvents() {
        const { productID, res, elementSelector, arr } = this, { Email: userEmail, IsUserDefined } = res;

        if (IsUserDefined) {
            elementSelector.parents(wishContainer)
                .addClass(Loading);

            try {
                const dataBaseRes = await dataBaseFetch(userEmail),
                    listID = dataBaseRes.map(a => a.id),
                    productCode = dataBaseRes.map(a => a.productReference);

                if (productID) {
                    String(productCode).indexOf(productID) === -1 ?
                        arr.push(...productCode, productID) :
                        arr.push(...productCode[0].split(',')
                            .filter(f => f !== productID));

                    fetch(patchVariantFetch(listID, userEmail, arr)).then(() => changingEvent(elementSelector));
                }
            } catch (err) {
                elementSelector.parents(wishContainer)
                    .removeClass(Loading);

                throw new Error('Ocorreu um erro ao favoritar esse produto :( ' + err);
            }
        } else {
            window.location.href = `/login?ReturnUrl=${window.location.pathname}`;
        }
    }
}

export default wishList;