/**
 *
 * @fileOverview This is a performance page to show new components that will be used on Brastemp Black Friday 2018
 *
 */
'use strict';

import 'vendors/nitro';

import './modules/tabs';
import './modules/shelfs';

Nitro.setup(['tabs', 'shelfs'], function() {
	// /**
	//  * Função init bootstrap
	//  */
	// this.init = () => {
	// 	this.method();
	// };

	// /**
	//  * Apenas um exemplo arrow func com retorno
	//  * @param  {String} param um texto que será concatenado
	//  * @returns {String} texto example with concatenando param
	//  */
	// this.method = param => `example with ${param}`;

	// // Start it
	// this.init();
});
