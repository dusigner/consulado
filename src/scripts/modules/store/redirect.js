/* globals store:true, vtexid:true */

'use strict';

var Uri = require('vendors/Uri');
/*var CRM = require('modules/store/crm');*/

var redirect = module.exports.redirect = function (data) {

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

	if(data.status === 'Register') {
		$('<p>Seu cadastro foi enviado para análise. Assim que aprovado você será notificado por e-mail.</p>').vtexModal({
			id: 'cadastro-sucesso',
			title: 'Quase lá!',
			destroy: true
		});
	} else { // status = Login
		vtexid.start({
			email: data.email,
			returnUrl: uri.toString()
		});
	}

	//trigger click de email e senha login
	$(window).on('rendered.vtexid', function () {
		$('.vtexIdUI-providers-list .vtexIdUI-others-send-email').click();
	});


	/*if (store.isCorp) { //window.vtexid.getAuthData().email
		vtexid.start({
			email: data.email,
			returnUrl: uri.toString()
		});

		//trigger click de email e senha login
		$(window).on('rendered.vtexid', function () {
			$('.vtexIdUI-providers-list .vtexIdUI-others-send-email').click();
		});

	} else {

		window.location.href = uri.toString();

	}*/

};

module.exports.login = function (data) {

	if (!window.store) {
		window.store = this;
	}



	$.extend(data, {
		status: 'Login'
	});

	if (data.approved) {
		redirect(data);
	} else {
		$('<p>Ainda estamos validando o seu cadastro. Assim que aprovado você será notificado por e-mail.</p>').vtexModal({
			id: 'nao-aprovado',
			title: 'Quase lá!',
			destroy: true
		});
	}



};

module.exports.register = function (data) {

	$.extend(data, {
		status: 'Register'
	});
	redirect(data);

};

/*module.exports.callcenter = function (partner) {

	store.setUserData({
		partner: partner.codigoParceria,
		condition: partner.condicaoParceria
	});

	window.location.href = store.uri
		.replaceQueryParam('utmi_pc', partner.codigoParceria)
		.replaceQueryParam('utmi_cp', partner.condicaoParceria)
		.toString();
};
*/

/*module.exports.pap = function (vendor, region, representante) {

	$.cookie('PAP', store.uri.uriParts.relative, {
		path: '/'
	});

	window.location.href = new Uri('/parceiro')
		.addQueryParam('utm_source', vendor)
		.addQueryParam('utmi_pc', region)
		.addQueryParam('utm_campaign', representante)
		.addQueryParam('sc', 6)
		.toString();

};*/

/*module.exports.home = function () {

	if (!window.store) {
		window.store = this;
	}

	window.location.href = store.uri
		.replaceQueryParam('ReturnUrl', store.uri.path())
		.setPath('/')
		.deleteQueryParam('idsku')
		.toString();

};
*/