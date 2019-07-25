'use strict';

var CRM = require('modules/store/crm');

Nitro.module('checkout.pj', function() {
	this.disableInputs = function(e) {
		$('.ship-street-text .link-edit, #dont-know-postal-code').remove();

		if (e.$element.is('#ship-postal-code, #ship-number')) {
			e.$element.attr('disabled', 'disabled');
		}
	};

	this.changeProfileData = function() {
		var $boxProfile = $('#client-profile-data'),
			$clientProfileSummary = $boxProfile.find('.client-profile-summary'),
			corporateDocument = store.userData.corporateDocument.replace(
				/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
				'$1 $2 $3/$4-$5'
			);

		var templateSummary =
			'<span>Nome do Responsável:</span> <span>' +
			store.userData.firstName +
			' ' +
			store.userData.lastName +
			'</span>';
		templateSummary += '<br/><span>Nome da Empresa:</span> <span>' + store.userData.corporateName + '</span>';
		templateSummary += '<br/><span>Nome da Fantasia:</span> <span>' + store.userData.tradeName + '</span>';
		templateSummary += '<br/><span>CNPJ:</span> <span>' + corporateDocument + '</span>';
		templateSummary +=
			'<br/><span>Inscrição Estadual:</span> <span>' + store.userData.stateRegistration + '</span>';
		templateSummary += '<br/><span>Telefone:</span> <span>' + store.userData.homePhone + '</span>';

		$boxProfile.find('.accordion-toggle span').text('Dados da Empresa');
		$boxProfile.find('.link-logout-container').remove();

		$clientProfileSummary.html(templateSummary);

		//removendo opção de editar dados no checkout
		$('#edit-profile-data').remove();
	};

	this.pendingCompany = function() {
		var $paymentButton = $('.payment-submit-wrap');
		if (store.userData && store.userData.xValidationPJ !== 'aprovado') {
			$paymentButton.hide();
			if ($('.pending-wrap').length === 0) {
				$paymentButton.before('<div class="pending-wrap"></div>');
			}

			var $pendingWrap = $('.pending-wrap');

			var validatePendingCompany = function() {
				$pendingWrap.html('').addClass('loading');
				CRM.clientSearchByEmail(store.userData.email).done(function(user) {
					store.setUserData(user, true);

					$pendingWrap.removeClass('loading');

					if (user.xValidationPJ === 'aprovado') {
						$paymentButton.show();
						$pendingWrap.hide();
					} else if (user.xValidationPJ === 'reprovado') {
						$paymentButton
							.html(
								'<p>Infelizmente seu cadastro não foi realizado com sucesso.<br /> Pedimos que entre em contato com nossa Central de Atendimento para a confirmação de alguns dados.</p>'
							)
							.show();
					} else {
						$pendingWrap.html(
							'<p>Ainda estamos validando o seu cadastro. Tente novamente mais tarde ou <a href="#" class="retry-buy">clique aqui.</a></p>'
						);
						$('.retry-buy').click(function(e) {
							e.preventDefault();
							validatePendingCompany();
						});
					}
				});
			};

			validatePendingCompany();
		}
	};
});
