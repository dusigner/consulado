import cacheSelector from './cacheSelector.js';
import { dataBaseFetch, variantFetch, patchVariantFetch } from './wishRequests.js';

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

                console.log(referenceCode);

            String(productCode).indexOf(referenceCode) == -1 &&
                newArray.push(...productCode, referenceCode);

            newArray.length
                && fetch(patchVariantFetch(listID, userEmail, newArray));
        } catch(error) {
            console.log(error);
        }
    }
}

export default wishList;