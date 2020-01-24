import cacheSelector from './cacheSelector.js';
import { arrayFormat, dataBaseFetch, variantFetch, patchVariantFetch } from './wishlist-utils.js';

const El = cacheSelector;

class wishList {
    constructor (productId, userEmail, elementSelector) {
        this.productId = productId;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
        this.arr = new Array;
    }

    async addProduct () {
        try {
            const { productId, userEmail, elementSelector, arr } = this,
                dataBaseResponse = await (await dataBaseFetch(userEmail)).json(),
                variantResponse = await (await variantFetch(productId)).json(),
                listID = dataBaseResponse.map(item => item.id),
                productCode = dataBaseResponse.map(item => item.productReference),
                referenceCode = variantResponse.RefId;

            (referenceCode && String(productCode).indexOf(referenceCode)) === -1 &&
                arr.push(...productCode, referenceCode);

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