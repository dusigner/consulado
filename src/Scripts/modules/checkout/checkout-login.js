'use strict';

Nitro.module('checkout-login', function(){
	var self = this,
		routes = {
			authenticateByEmailKey: '/pub/authentication/accesskey/validate',
			authenticateLogin: '/pub/authentication/classic/validate',
			getEmailAcessKey: '/pub/authentication/accesskey/send',
			setPassword: '/pub/authentication/classic/setpassword',
			getToken: '/pub/authentication/start',
			getOAuthUrl: 'https://vtexid.vtex.com.br/api/vtexid/pub/authentication/oauth/redirect'
		},
		userInfos = {
			initialCallback: {
				callbackUrl: window.location.protocol + '//' + window.location.host + '/api/vtexid/pub/authentication/finish',
				scope: (location.host.indexOf('vtexcommercestable') > -1 || location.host.indexOf('vtexlocal') > -1) ? location.host.split('.')[0] : window.jsnomeLoja || location.host,
				user: null,
				locale: 'pt-BR'
			},
			faceLogin : false,
			googleLogin : false
		},
		templates = {

		}

	this.init = () => {
		self.accessModalLogin();
		self.htmlErrorValidadeEmail();
		self.validateEmail();

		// init functions
		setEnviroment();

		function setEnviroment () {
			self.request(routes.getToken, userInfos.initialCallback)
				.done(function(response) {
					userInfos.authenticationToken = response.authenticationToken;
					if (response.oauthProviders.filter(function (el) {
						return el.providerName === 'Facebook';
					}).length > 0) {
						userInfos.faceLogin = true;
					}

					if (response.oauthProviders.filter(function (el) {
						return el.providerName === 'Google';
					}).length > 0) {
						userInfos.googleLogin = true;
					}

					templates.defaultLayout =
					'<div class="modal-custom-login">' +
						'<p class="modal-custom-login--title">Ou entre por uma das opções abaixo:</p>' +
						'<div class="modal-custom-login--box">' +
							((userInfos.faceLogin) ? '<button class="modal-custom-login-btn facebook_access">Facebook</button>' : '') +
							((userInfos.googleLogin) ? '<button class="modal-custom-login-btn google_access">Google</button>' : '') +
						'</div>' +
					'</div>'
					;

					self.htmlLoginFacebookAndGoogle();
				});
		}
	};

	this.request = function(route, params) {
		// const isStartRoute = route.toString().includes('start');
		const isStartRoute = route.toString().indexOf('start') > -1 ? true : false;
		let data = params;

		if (!isStartRoute) {
			data = new FormData();
			for (var attribute in params) {
				data.set(attribute, params[attribute]);
			}
		}

		return $.ajax({
			type: isStartRoute ? 'GET' : 'POST',
			url: '/api/vtexid' + route,
			data: data,
			...isStartRoute && { dataType: 'jsonp' },
			...!isStartRoute && { processData: false },
			...!isStartRoute && { contentType: false },

			complete: function (data) {
				return data;
			}
		});
	};

	this.htmlLoginFacebookAndGoogle = () => {
		$('.pre-email .client-email').append(templates.defaultLayout);
	};

	this.htmlErrorValidadeEmail = () => {
		$('.client-email #client-pre-email').after('<span style="display: none;" class="validate-erro">Não foi possível realizar o login, por favor tente novamente ou escolha outra forma de login.</span>');
	};

	this.validateEmail = () => {
		$('.client-email #btn-client-pre-email').on('click', () => {

			var $email	= $('#client-pre-email').val();

			var $emailFilter=/^.+@.+\..{2,}$/;
			var $illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/

			if(!($emailFilter.test($email))||$email.match($illegalChars)) {
				$('.client-email #client-pre-email, .client-email #btn-client-pre-email').addClass('is--error');
				$('.client-email .validate-erro').css('display', 'block');
			}
		});
	};

	this.socialModalLogin = function(origem) {
		const url = `/api/vtexid/pub/authentication/oauth/redirect?providerName=${origem}`
		//monitor the closing of a popup window
		const popup = window.open(
			url,
			'DescriptiveWindowName',
			'width=720,height=520,resizable,scrollbars=yes,status=1'
		);

		const redirect = window.setInterval(() => {
			$.get('/no-cache/profileSystem/getProfile', function (data) {
				if (data.IsUserDefined) {
					popup.close();
					clearTimer();
				}
			});
		}, 1000);

		function clearTimer() {
			clearInterval(redirect);
			self.redirectModalUrl();
		}
	};

	this.redirectModalUrl = () => {
		location.href = '/checkout/#/profile';
	};

	// modal login
	this.accessModalLogin = () => {
		$('body').on('click', '.modal-custom-login .modal-custom-login-btn.google_access', () => {
			self.socialModalLogin('Google');
		})

		$('body').on('click', '.modal-custom-login .modal-custom-login-btn.facebook_access', () => {
			self.socialModalLogin('Facebook');
		})
	}

	// init functions
	this.init();
});
