const Utils = {
    arrayFormat(arr) {
        return String(arr).charAt(0) === ',' ? String(arr).substr(1) : String(arr);
    },

    dataBaseFetch(userEmail) {
        return fetch(`/api/dataentities/WL/search?email=${userEmail}&_fields=id,productReference`);
    },

    patchVariantFetch(listID, userEmail, arr) {
        return new Request('/api/dataentities/WL/documents', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Accept': 'application/vnd.vtex.ds.v10+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: String(listID), email: userEmail, productReference: Utils.arrayFormat(arr)})
        });
    }
}

module.exports = Utils;