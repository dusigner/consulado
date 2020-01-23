import cacheSelector from './cacheSelector.js';

const El = cacheSelector;

class wishList {
    constructor (productId, userEmail, elementSelector) {
        this.productId = productId;
        this.userEmail = userEmail;
        this.elementSelector = elementSelector;
    }

    async addProduct () {
        try {
            const dataBaseResponse = await (await fetch(`/api/dataentities/WL/search?email=${this.userEmail}&_fields=id,productId`)).json(),
                variantResponse = await (await fetch(`/api/catalog_system/pvt/products/ProductGet/${this.productId}`)).json(),
                referenceId = variantResponse.RefId,
                productId = dataBaseResponse.map(item => item.productId);

            console.log(this.userEmail);
            console.log(referenceId);
            console.log(productId);
        } catch(error) {
            console.log(error);
        }
    }
}

export default wishList;