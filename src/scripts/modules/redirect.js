/* global $: true, Nitro: true */

'use strict';

Nitro.module('redirect', function() {

	var path = window.location.pathname;

	if( path === '/atendimento' ) {
		$(location).attr('href', '//consul.custhelp.com/');
	}
});