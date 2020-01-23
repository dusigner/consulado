export const dataBaseFetch = (userEmail) => {
    return fetch(`/api/dataentities/WL/search?email=${userEmail}&_fields=id,productReference`);
}
export const variantFetch = (productId) => {
    return fetch(`/api/catalog_system/pvt/products/ProductGet/${productId}`);
}
export const patchVariantFetch =  (listID, userEmail, newArray) => {
    return new Request('/api/dataentities/WL/documents', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Accept': 'application/vnd.vtex.ds.v10+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: String(listID), email: userEmail, productReference: String(newArray).charAt(0) === ',' ? String(newArray).substr(1) : String(newArray)})
    });
}