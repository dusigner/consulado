import cacheSelector from './cacheSelector.js';

const El = cacheSelector;

class wishList {
    constructor (productId, elementSelector) {
        this.productId = productId;
        this.elementSelector = elementSelector;
    }

    async addProduct () {
        try {
            const userInfos = await (await fetch(`/no-cache/profileSystem/getProfile`)).json();

            if (userInfos.IsUserDefined) {
                const variantResponse = await (await fetch(`/api/catalog_system/pvt/products/ProductGet/${this.productId}`)).json(),
                    dataBaseResponse = await (await fetch(`/api/dataentities/WL/search?email=${userInfos.Email}&_fields=id,productId`)).json(),
                    referenceId = variantResponse.RefId,
                    productId = dataBaseResponse.map(item => item.productId);

                console.log(dataBaseResponse);
                console.log(referenceId);
                console.log(productId);
            }
        } catch(error) {
            console.log(error);
        }
    }
}

export default wishList;