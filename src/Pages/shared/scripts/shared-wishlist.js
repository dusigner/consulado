const UtilShared = {
    async fetchSharedList(wishListID) {
        try {
            return $.ajax({
                url: `/api/dataentities/WL/search?id=${wishListID}&_fields=id,productReference`,
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'Content-type': 'application/json',
                },
                cache: false
            });
        } catch (err) {
            UtilShared.errorReturn();
            console.log('SharedPage Error: ', err)
        }
    },

    async fetchProductSearch(productID) {
        try {
            const res = await fetch(`/api/catalog_system/pub/products/search?fq=productId:${productID}`);
            return await res.json();
        } catch (err) {
            UtilShared.errorReturn();
            console.log('SharedPage Error: ', err)
        }
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

    errorReturn() {
        $('.shared__ws-container')
            .append('<h1 style="text-align:center;">Não há produtos favoritados nessa lista :(</h1>')
            .removeClass('hide');
        $('.shared__ws-loader-container').hide();
    }
}

module.exports = UtilShared;