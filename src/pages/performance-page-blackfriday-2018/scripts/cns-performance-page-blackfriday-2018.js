/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Consul Black Friday 2018
 *
 */
'use strict';

import 'vendors/nitro';

import './modules/tabs';
import './modules/shelfs';
import './modules/counter';
import './modules/prodStock';
import './modules/fast-buy';

Nitro.setup(['prodStock', 'tabs', 'shelfs', 'counter', 'fast-buy'], function(prodStock) {
	this.init = () => {
		prodStock.buildProductStock();
	};

	this.init();
});
