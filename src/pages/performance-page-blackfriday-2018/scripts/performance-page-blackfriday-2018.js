/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Consul Black Friday 2018
 *
 */
'use strict';

require('./modules/counter');

Nitro.setup(['counter'], function() {
	/**
	 * Função init bootstrap
	 */
	this.init = () => {

		this.method();
	};

	/**
	 * Apenas um exemplo arrow func com retorno
	 * @param  {String} param um texto que será concatenado
	 * @returns {String} texto example with concatenando param
	 */
	this.method = param => `example with ${param}`;

	// Start it
	this.init();
});
