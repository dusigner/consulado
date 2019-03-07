/**
 *
 * @fileOverview Style guide new consul
 *
 */
'use strict';

Nitro.controller('styleguide', [], function() {
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
