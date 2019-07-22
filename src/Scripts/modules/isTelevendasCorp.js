/* global $: true, Nitro: true */

'use strict';

Nitro.module('isTelevendasCorp', function() {
	var self = this;

	this.checkTelevendas = function() {
		$(window).on('orderFormUpdated.vtex', function(e, orderform) {
			if (orderform.userType === 'callCenterOperator') {
				self.isTelevendas = true;
				$('body').on('click', '.welcome-message.show-corp .logout', function(e) {
					e.preventDefault();
					$.cookie('userData', null, { path: '/' });
					window.store.userData = {};
					window.location = '/';
				});
			}
		});
	};
	this.checkTelevendas();
});
