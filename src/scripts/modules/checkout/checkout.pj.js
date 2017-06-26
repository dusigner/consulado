'use strict';

Nitro.module('checkout.pj', function() {

	var interval;

	this.hideChangeAddress = function() {

		interval = setInterval(function(){

			if($('.address-list-placeholder .address-edit').length !== 0) {
				$('.address-list-placeholder .address-edit, .address-list-placeholder .address-create').remove();

				clearInterval(interval);
			}
		}, 300);

		setTimeout(function() { clearInterval(interval); }, 5000);
	};

	this.disableInputs = function(e) {

		$('.ship-street-text .link-edit, #dont-know-postal-code').remove();

		if (e.$element.is('#ship-postal-code, #ship-number')) {
			e.$element.attr('disabled', 'disabled');
		}
	};

	this.changeProfileData = function() {
		var $boxProfile = $('#client-profile-data'),
			$clientProfileSummary = $boxProfile.find('.client-profile-summary'),
			corporateDocument = store.userData.corporateDocument.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1 $2 $3/$4-$5');

		var templateSummary = '<span>Nome do Responsável:</span> <span>' + store.userData.firstName + ' ' + store.userData.lastName + '</span>';
		templateSummary += '<br/><span>Nome da Empresa:</span> <span>' + store.userData.corporateName + '</span>';
		templateSummary += '<br/><span>Nome da Fantasia:</span> <span>' + store.userData.tradeName + '</span>';
		templateSummary += '<br/><span>CNPJ:</span> <span>' + corporateDocument + '</span>';
		templateSummary += '<br/><span>Inscrição Estadual:</span> <span>' + store.userData.stateRegistration + '</span>';
		templateSummary += '<br/><span>Telefone:</span> <span>' + store.userData.phone + '</span>';

		$boxProfile.find('.accordion-toggle span').text('Dados da Empresa');
		$boxProfile.find('.link-logout-container').remove();

		$clientProfileSummary.html(templateSummary);
	};


});
