/**
 *
 * @fileOverview 
 *
 */
'use strict';

Nitro.controller('performance-page-blackfriday-2018', [], function() {
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
