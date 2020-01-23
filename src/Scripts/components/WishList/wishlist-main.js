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
            let newArray = [];
            const dataBaseResponse = await (await fetch(`/api/dataentities/WL/search?email=${this.userEmail}&_fields=id,productId`)).json(),
                variantResponse = await (await fetch(`/api/catalog_system/pvt/products/ProductGet/${this.productId}`)).json(),
                listId = dataBaseResponse.map(item => item.id),
                productCode = dataBaseResponse.map(item => item.productReference),
                referenceCode = variantResponse.RefId,
                wishData = {
                    id: listId,
                    email: this.userEmail,
                    productId: newArray.push(productCode, referenceCode)
                },
                request = new Request(url, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/vnd.vtex.ds.v10+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(wishData)
                });

                fetch(request);
        } catch(error) {
            console.log(error);
        }
    }
}

export default wishList;