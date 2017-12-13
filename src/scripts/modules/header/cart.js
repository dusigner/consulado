/* global $: true, Nitro: true */
'use strict';

require('../../../templates/minicart.html');

require('vendors/portal-minicart');

Nitro.module('cart', function() {


	$('.minicart')
		.minicart({
			showMinicart: false,
			showTotalizers: true
		});

});
