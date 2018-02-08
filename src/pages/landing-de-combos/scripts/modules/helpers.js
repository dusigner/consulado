'use strict';

var Helpers = {
	self: this,
	getInstallmentPrice: function (totalPrice) {
		var result;
		totalPrice = Helpers.formatFloat(totalPrice);
		result = totalPrice / 10;
		return _.formatCurrency(result);
	},
	sumPrice: function (prices) {
		return prices.reduce(function (previousValue, currentValue) {
			return previousValue + currentValue;
		});
	},
	formatFloat: function (valor) {
		return isNaN(valor) === false ? parseFloat(valor) : parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.'));
	}
};

module.exports = Helpers;
