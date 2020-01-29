import cacheSelector from './cacheSelector.js';
import { arrayFormat, patchVariantFetch, dataBaseResponse, changingEvent } from './wishlist-utils.js';

const El = cacheSelector.utils, { wishContainer, Loading } = El;

class wishList {
    constructor (productID, userEmail, elementSelector) {
        this.productID = productID;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
        this.arr = new Array;
    }

    async addProduct() {
        const { productID, userEmail, elementSelector, arr } = this;

        elementSelector.parents(wishContainer)
            .addClass(Loading);

        try {
            const dataBaseReturn = await dataBaseResponse(userEmail), { listID, productCode } = dataBaseReturn;

            (productID && String(productCode).indexOf(productID)) === -1 &&
                arr.push(...productCode, productID);

            if (arr.length) {
                const localConfigs = { value: { id: String(listID), email: userEmail, productReference: arrayFormat(arr)}};

                localStorage.setItem('WishList', JSON.stringify(localConfigs));
                fetch(patchVariantFetch(listID, userEmail, arr)).then(() => changingEvent(elementSelector));
            }
        } catch (err) {
            elementSelector.parents(wishContainer)
                .removeClass(Loading);

            throw new Error('Ocorreu um erro ao favoritar este produto :(' + err);
        }
    }
}

export default wishList;