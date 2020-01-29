import cacheSelector from './cacheSelector.js';
import { patchVariantFetch, dataBaseFetch, arrayFormat, changingEvent } from './wishlist-utils.js';

const El = cacheSelector.utils, { wishContainer, Loading } = El;

class wishList {
    constructor (productID, userEmail, elementSelector) {
        this.productID = productID;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
        this.arr = new Array;
    }

    async handleEvents() {
        const { productID, userEmail, elementSelector, arr } = this;

        elementSelector.parents(wishContainer)
            .addClass(Loading);

        try {
            const dataBaseRes = await (await dataBaseFetch(userEmail)).json(),
                listID = dataBaseRes.map(item => item.id),
                productCode = dataBaseRes.map(item => item.productReference);

            if (productID) {
                String(productCode).indexOf(productID) === -1 ?
                    arr.push(...productCode, productID) :
                    arr.push(...productCode[0].split(',').filter(item => item !== productID));

                const localConfigs = { value: { id: String(listID), email: userEmail, productReference: arrayFormat(arr)}};

                localStorage.setItem('WishList', JSON.stringify(localConfigs));
                fetch(patchVariantFetch(listID, userEmail, arr)).then(() => changingEvent(elementSelector));
            }
        } catch (err) {
            elementSelector.parents(wishContainer)
                .removeClass(Loading);

            throw new Error('Wish failed :(' + err);
        }
    }
}

export default wishList;