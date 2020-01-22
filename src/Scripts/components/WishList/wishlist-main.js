import cacheSelector from './cacheSelector.js';

const El = cacheSelector;

class wishList {
    constructor (productId, elementSelector) {
        this.productId = productId;
        this.elementSelector = elementSelector;
    }

    addProduct () {
        fetch(`/api/catalog_system/pvt/products/ProductGet/${this.productId}`).then(res => res.json().then(res => console.log(res)));
    }
}

export default wishList;