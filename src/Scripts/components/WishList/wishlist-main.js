import cacheSelector from './cacheSelector.js';
import { arrayFormat, dataBaseFetch, variantFetch, patchVariantFetch } from './wishlist-utils.js';

const El = cacheSelector;

class wishList {
    constructor (productId, userEmail, elementSelector) {
        this.productId = productId;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
        this.newArray = [];
    }

    async addProduct () {
        try {
            const { productId, userEmail, elementSelector, newArray } = this,
                dataBaseResponse = await (await dataBaseFetch(userEmail)).json(),
                variantResponse = await (await variantFetch(productId)).json(),
                listID = dataBaseResponse.map(item => item.id),
                productCode = dataBaseResponse.map(item => item.productReference),
                referenceCode = variantResponse.RefId;

            (referenceCode && String(productCode).indexOf(referenceCode)) === -1 &&
                newArray.push(...productCode, referenceCode);

            if (newArray.length) {
                const localConfigs = { value: { id: String(listID), email: userEmail, productReference: arrayFormat(newArray)}};

                localStorage.setItem('WishList', JSON.stringify(localConfigs));
                fetch(patchVariantFetch(listID, userEmail, newArray));
            }
        } catch(err) {
            throw new Error('Ocorreu um erro ao favoritar este produto :(' + err);
        }
    }
}

export default wishList;