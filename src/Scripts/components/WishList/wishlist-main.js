import cacheSelector from './cacheSelector.js';
import { patchVariantFetch, dataBaseFetch, arrayFormat, changingEvent } from './wishlist-utils.js';

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
                const dataBaseRes = await (await dataBaseFetch(userEmail)).json(),
                    listID = dataBaseRes.map(a => a.id),
                    productCode = dataBaseRes.map(a => a.productReference);

                if (productID) {
                    String(productCode).indexOf(productID) === -1 ?
                        arr.push(...productCode, productID) :
                        arr.push(...productCode[0].split(',').filter(f => f !== productID));

                    const localConfigs = { value: { id: String(listID), email: userEmail, productReference: arrayFormat(arr)}};

                    localStorage.setItem('WishList', JSON.stringify(localConfigs));
                    fetch(patchVariantFetch(listID, userEmail, arr)).then(() => changingEvent(elementSelector));
                }
            } catch (err) {
                elementSelector.parents(wishContainer)
                    .removeClass(Loading);

                throw new Error('Wish failed :( : ' + err);
            }
        } else {
            window.location.href = `/login?ReturnUrl=${window.location.pathname}`;
        }
    }
}

export default wishList;