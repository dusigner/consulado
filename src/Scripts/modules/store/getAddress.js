'use strict';

var getAddress = {
	byPostalCode: function(postalCode) {
		return vtexjs.checkout
			.getAddressInformation({
				postalCode: postalCode,
				country: 'BRA'
			})
			.then(function(res) {
				return res;
			});
	}
};

module.exports = getAddress;
