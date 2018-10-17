/**
 *
 * @fileOverview cupons page
 *
 */
'use strict';

const logger = require('js-pretty-logger');

Nitro.setup(['cupom-page'], function() {
	/**
	 * Função init bootstrap
	 */
	this.init = () => {

		this.log('Initialized...');
	};

	this.log = (message, type = 'info') => {
		logger('Cupom', message, { type });
	};

	// Start it
	this.init();
});
