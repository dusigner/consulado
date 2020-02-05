'use strict';

import CryptoJS from "crypto-js";

Nitro.module('wish-share', function() {
	this.init = () => {
    };

    this.getWishList = () => {
        const encryptedSearchParam = window.location.search.substr(1),
            wishListID = CryptoJS.AES.decrypt(encryptedSearchParam, 'WishListProtection').toString(CryptoJS.enc.Utf8);

        console.log(wishListID);
    };


	this.init();
});
