/* global $: true */

'use strict';

var getAddress = {

	byPostalCode: function(postalCode) {
		return $.getJSON('http://viacep.com.br/ws/' + postalCode + '/json/').then(function(res) {
			return res;
		});
	}
};

module.exports = getAddress;
