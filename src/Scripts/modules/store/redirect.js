/* globals store:true, vtexid:true */

'use strict';

var Uri = require('vendors/Uri');
var CRM = require('modules/store/crm');

var redirect = (module.exports.redirect = function(data) {
	$(document).trigger('redirect', data);

	store.setUserData(data, true);

	var uri = new Uri(),
		uriRedirect = store.uri.getQueryParamValue('ReturnUrl');

	if (uriRedirect && (uriRedirect.indexOf('http') >= 0 || uriRedirect.indexOf('https') >= 0)) {
		uriRedirect = uriRedirect.split('.br')[1];
	}

	//uri.setPath(uriRedirect || (store.isColab ? '/colaboradorwhp'  : ( store.isMobile ? '/parceiro/mobile' : '/parceiro' ) ));

	if (uriRedirect) {
		uri.setPath(uriRedirect);
	} else {
		uri.setPath('/empresas');
	}

	uri.addQueryParam('utmi_pc', '10100511');

	/**
	 * Se o usuário acabou de se registrar data.status = Register
	 * abre o modal de cadastro com sucesso
	 * Caso não seja registro, abre o modal de Login
	 */
	if (data.status === 'Register') {
		CRM.clientSearchByEmail(data.email).done(function(user) {
			store.logout();
			store.setUserData(user, true);

			vtexid.start({
				email: data.email,
				returnUrl: uri.toString()
			});
		});
	} else if (data.status === 'Login') {
		vtexjs.checkout.getOrderForm().done(function(res) {
			if (res.loggedIn || res.userType === 'callCenterOperator') {
				window.location.href = store.uri
					.setPath(uriRedirect ? uriRedirect : '/empresas')
					.deleteQueryParam('ReturnUrl')
					.toString();
			} else {
				vtexid.start({
					email: data.email,
					returnUrl: uri.toString()
				});
			}
		});
	} else if (data.status === 'Revalidation') {
		vtexid.start({
			email: data.email,
			returnUrl: uri.toString()
		});
	}

	//trigger click de email e senha login
	$(window).on('rendered.vtexid', function() {
		$('.vtexIdUI-providers-list .vtexIdUI-others-send-email').click();
	});
});

module.exports.login = function(data) {
	dataLayer.push({ event: 'emailCadastrado' });

	if (!window.store) {
		window.store = this;
	}

	$.extend(data, {
		status: 'Login'
	});

	//Atualiza cotas de eletrodomesticos por CPF antes de redirecionar
	if (data.xValidationPJ !== 'reprovado') {
		var documento = store.isCorp ? data.corporateDocument : data.document;
		var tipoDocumento = store.isCorp ? 'corporateDocument' : 'document';

		if (documento) {
			CRM.clientSearchByDocument(documento, tipoDocumento).done(function(res) {
				var qntd = 0;

				//soma a quantidade de Eletrodomésticos comprados por esses usuários
				$.each(res, function(index, user) {
					qntd += user.xSkuSalesChannel5;
				});

				data.xSkuSalesChannel5PerDocument = qntd;

				redirect(data);
			});
		} else {
			data.xSkuSalesChannel5PerDocument = data.xSkuSalesChannel5;
			redirect(data);
		}
	} else {
		$(
			'<p>Infelizmente seu cadastro não foi realizado com sucesso.<br /> Pedimos que entre em contato com nossa Central de Atendimento para a confirmação de alguns dados.</p>'
		).vtexModal({
			id: 'nao-aprovado',
			title: 'Algo deu errado =/',
			destroy: true
		});
	}
};

module.exports.register = function(data) {
	$.extend(data, {
		status: 'Register'
	});
	redirect(data);
};

module.exports.revalidation = function(data) {
	$.extend(data, {
		status: 'Revalidation'
	});
	redirect(data);
};

module.exports.home = function() {
	if (!window.store) {
		window.store = this;
	}

	window.location.href = store.uri
		.replaceQueryParam('ReturnUrl', store.uri.path())
		.setPath('/')
		.deleteQueryParam('idsku')
		.toString();
};
