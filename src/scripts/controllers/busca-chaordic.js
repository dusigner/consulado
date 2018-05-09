'use strict';

require('modules/list-more');
require('modules/listagem/filters');
require('modules/filters');
require('modules/prateleira');
require('modules/listagem/order-by');
require('modules/listagem/busca-chaordic');

Nitro.controller('busca-chaordic', ['list-more', 'filters', 'order-by', 'prateleira', 'busca-chaordic'], function() {
	var $body = $('body');

	// Limpar localstorage na página de busca
	if( $body.hasClass('busca') ) {
		localStorage.clear();
	}
});