/* global $: true, Nitro: true */

require('../../templates/minicart.html');

require('vendors/portal-minicart');

Nitro.module('cart', function() {

	'use strict';

	$('.minicart')
		.minicart({
			showMinicart: false,
			showTotalizers: true
		});

});