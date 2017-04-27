'use strict';

var Estimate = {
	getSla: function(selectedSla, slas) {
		var obj = slas.filter(function(e) {
			if (e.name === selectedSla) {
				return e.shippingEstimate;
			}
		});
		return obj[0];
	},
	calculateSla: function(orderDate, currentSla) {
		var isBusinessDay = (currentSla.shippingEstimate && currentSla.shippingEstimate.indexOf('bd')) ? true : false;
		var isScheduled = (currentSla.name && currentSla.name.indexOf('Agendada')) ? true : false;
		var estimateDate;

		if (isScheduled && currentSla.shippingEstimateDate) {
			// sem cálculo quando for agendada
			estimateDate = $.formatDatetimeBRL(currentSla.shippingEstimateDate);
		} else if (isBusinessDay) {
			// Calculo para dias comerciais
			estimateDate = $.calculateBusinessDays(orderDate, currentSla.shippingEstimate.replace('bd', ''));
			estimateDate = $.formatDatetimeBRL(estimateDate);
		} else {
			// Calculo para dias corridos
			estimateDate = $.calculateDays(orderDate, currentSla.shippingEstimate.replace('d', ''));
			estimateDate = $.formatDatetimeBRL(estimateDate);
		}

		return estimateDate;
	}
};

module.exports = Estimate;