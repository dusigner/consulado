import cacheSelector from './cacheSelector.js';
import { arrayFormat, dataBaseFetch, variantFetch, patchVariantFetch } from './wishlist-utils.js';

const El = cacheSelector;

class wishList {
    constructor (productID, userEmail, elementSelector) {
        this.productID = productID;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
        this.arr = new Array;
    }

    async addProduct () {
        try {
            const { productID, userEmail, elementSelector, arr } = this,
                dataBaseResponse = await (await dataBaseFetch(userEmail)).json(),
                listID = dataBaseResponse.map(item => item.id),
                productCode = dataBaseResponse.map(item => item.productReference);

            (productID && String(productCode).indexOf(productID)) === -1 &&
                arr.push(...productCode, productID);

            if (arr.length) {
                const localConfigs = { value: { id: String(listID), email: userEmail, productReference: arrayFormat(arr)}};

                localStorage.setItem('WishList', JSON.stringify(localConfigs));
                fetch(patchVariantFetch(listID, userEmail, arr));
            }
        } catch (err) {
            throw new Error('Ocorreu um erro ao favoritar este produto :(' + err);
        }
    }
}

export default wishList;