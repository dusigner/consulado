const UtilShared = {
    fetchSharedList(wishListID) {
        return fetch(`/api/dataentities/WL/search?id=${wishListID}&_fields=productReference`);
    },
    fetchProductVariations(ids) {
        return fetch(`/api/catalog_system/pvt/products/ProductGet/${ids}`);
    },
    fetchProductSearch(refID) {
        return fetch(`/api/catalog_system/pub/products/search/${refID}`);
    },
    formatPrice(p) {
        return p && p !== 0 ? p.toLocaleString('pt-br',{ style: 'currency', currency: 'BRL'}) : undefined;
    },
    encrypt(s) {
        return s.replace(/\-/gm, 'U2FsdGVkX186oi');
    },
    decrypt(s) {
        return s.replace(/\U2FsdGVkX186oi/gm, '-');
    },
    copyToClipBoard(t) {
        const textArea = document.createElement("textarea");

        document.body.appendChild(textArea);

        textArea.value = t;
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    },
}

module.exports = UtilShared;