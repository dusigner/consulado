/* global $: true */

'use strict';
var CRM = require('../modules/store/crm');
$(document).ready(function() {


	var url = window.location.href;

	var self = this;


	if (url.indexOf('descadastrar-email') !== -1) {
		$('#modal-emailCRM').vtexModal();

		var $formOptOut = $('#vtex-modal-emailCRM form'),
			$avancar = $formOptOut.find('.avancar'),
			$step1 = $formOptOut.find('.step1'),
			$step2 = $formOptOut.find('.step2'),
			$success = $formOptOut.find('.step3');
		//$submit = $formOptOut.find('[type="submit"]'),
		//$inputs = $formOptOut.find('input[type="radio"]');

		$avancar.click(function() {
			$step1.hide();
			$step2.fadeIn();
		});

		$formOptOut.submit(self.submit);
	}



	self.submit = function(e) {
		e.preventDefault();

		var data = {},
			xEmalTriggerUnsubscribeReason = $formOptOut.serializeArray();

		xEmalTriggerUnsubscribeReason = xEmalTriggerUnsubscribeReason[0].value;

		data = {
			'email': _.urlParams().email,
			'xIsEmalTriggerOptIn': false,
			'xEmalTriggerUnsubscribeReason': xEmalTriggerUnsubscribeReason
		};



		CRM.insertClient(data)
			.then(function() {
				$step2.hide();
				$success.fadeIn();
			});
		/*				.fail(function () {
							console.log('deu errado');
						});*/
	};

});
