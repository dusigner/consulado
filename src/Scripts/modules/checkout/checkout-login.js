'use strict';

Nitro.module('checkout-login', function(){
	var self = this,
		returnUrl = false,
		$modalBody = $('.checkout-modal-custom-login--body'),
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
			templatesLogin:
				'<div class="checkout-modal-custom-login--forms">' +
					'<div class="checkout-checkout-modal-custom-login--body"></div>' +
					'<div class="checkout-modal-custom-login--forms-options">' +
						'<div class="checkout-modal-custom-login--forms-options-items">' +
							'<div class="checkout-modal-custom-login--forms-options-items-top">' +
								'<h2 id="checkout-login-modal-user"></h2>' +
								'<h3 class="checkout-modal-custom-login--forms-options-items-top--text">Use uma das opções para confirmar sua identidade</h3>' +
								'<button type="button" class="checkout-modal-custom-login--forms-options-items-top-close">×</button>' +
							'</div>' +
							'<div class="checkout-modal-custom-login--forms-options-items-bottom">' +
								'<button id="checkout-login-modal-key" type="button" class="checkout-modal-custom-login--forms-options-items-bottom-buttons">Receber chave de acesso rápido por email</button>' +
								'<button id="checkout-login-modal-email" type="button" class="checkout-modal-custom-login--forms-options-items-bottom-buttons">Receber chave de acesso rápido por email</button>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div id="checkout-mail_pass_login">' +
						'<p class="checkout-modal-custom-login--sectitles">Entre com um email e senha:</p>' +
						'<form id="checkout-modal-custom-login--form">' +
							'<div class="checkout-modal-custom-login-mail_pass_login">' +
								'<div class="checkout-modal-custom-email--inputbox">' +
									'<input type="text" id="login" placeholder="seu@email.com.br" class="custom-label" name="login" autocomplete="off">' +
								'</div>' +
								'<div class="checkout-modal-custom-password--inputbox">' +
									'<input type="password" id="password" placeholder="Senha" class="custom-label" name="password">' +
								'</div>' +
								'<div class="checkout-modal-custom-login--formOptions">' +
									'<span class="forget_pass">Esqueci minha senha</span>' +
									'<span class="no_pass">Não tenho uma senha</span>' +
								'</div>' +
								'<div class="checkout-custom-login-buttons--action--box">' +
								'<input type="submit" class="checkout-custom-login-btn checkout-btn-custom-secondary" value="Entrar">' +
								'</div>' +
							'</div>' +
						'</form>' +
					'</div>' +
				'</div>' +
				'<div class="checkout-modal-custom-login--forms__overlay"></div>',
		},
		helpers = {
			formtoobj : function(form) {
				var unindexed_array = form.serializeArray();
				var indexed_array = {};

				$.map(unindexed_array, function(n){
					indexed_array[n['name']] = n['value'];
				});

				return indexed_array;
			},
			authenticateUser : function(cookies, expire) {
				for (var i = 0, len = cookies.length; i < len; i++) {
					var cookie = cookies[i];

					if (cookie) {
						helpers.setCookie(cookie.Name, cookie.Value, '.' + location.hostname.split('.').reverse()[1] + '.' + location.hostname.split('.').reverse()[0], expire);
					}
				}
			},
			setCookie: function(name, value, domain, expire) {
				if (!name || !value) {return false;}

				document.cookie = name + '=' + value + ';expire=' + expire + ';path=/;';
			},
			urlToObject: function(url){
				var obj = JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
				return obj;
			},
			printError: function(errorText) {
				if ($('.modal-custom-login--errorBox').length > 0) {
					$('.modal-custom-login--errorBox').remove();
					$modalBody.prepend('<h4 class="modal-custom-login--errorBox">' + errorText + '</h4>');
				} else {
					$modalBody.prepend('<h4 class="modal-custom-login--errorBox">' + errorText + '</h4>');
				}
			},
			removeError: function() {
				$('.modal-custom-login--errorBox').remove();
			},
			isEmail: function(email) {
				if (!email) {return;}
				var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

				if (filtro.test(email)) {
					return true;
				} else {
					return false;
				}
			},
		}

	this.init = () => {
		self.accessModalLogin();
		self.htmlErrorValidadeEmail();
		self.validateEmail();
		self.verifyLogged();

		// init functions
		setEnviroment();

		function setEnviroment () {
			$('#client-pre-email').get(0).type = 'text';

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
		self.setListeners();
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

	this.removeDefault = () => {
		$('body').removeClass('validate-continue');
		$('body').removeClass('validate-email');
		$('.validate-erro-continue').css('display', 'none');
		$('.client-email .validate-erro-email').css('display', 'none');
	}

	this.htmlErrorValidadeEmail = () => {
		$('.row-fluid.orderform-template #orderform-to-cart').before('<span style="display: none;" class="validate-erro-continue">Não foi possível realizar o login, por favor tente </br> novamente ou escolha outra forma de login.</span>');
		$('.client-email #client-pre-email').after('<span style="display: none;" class="validate-erro-email"><strong>Insira um email válido: </strong> Inclua um “@” no endereço. "<span id="validate-erro-email-message"></span>" está com um “@” faltando.</span>');
	};

	this.validateEmail = () => {
		$('.client-email #btn-client-pre-email').on('click', () => {

			var $email	= $('#client-pre-email').val();

			var $emailFilter=/^.+@.+\..{2,}$/;
			var $illegalChars= /[\(\)\<\>\,\;\:\\\/\"\[\]]/

			if(!($emailFilter.test($email))||$email.match($illegalChars)) {

				if ( $email.length ) {
					$('.client-email #client-pre-email, .client-email #btn-client-pre-email').addClass('is--error');
					$('.validate-erro-continue').css('display', 'none');
					$('body').removeClass('validate-continue');
					$('#validate-erro-email-message').html($email);
					$('body').addClass('validate-email');
					$('.client-email .validate-erro-email').css('display', 'block');
				} else {
					$('.client-email #client-pre-email, .client-email #btn-client-pre-email').removeClass('is--error');
					$('.client-email .validate-erro-email').css('display', 'none');
					$('body').removeClass('validate-email');
					$('body').addClass('validate-continue');
					$('.validate-erro-continue').css('display', 'block');
					$('html').scrollTop(0)
				}
			} else {
				self.removeDefault();
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
		self.removeDefault();
		location.href = '/checkout/#/profile';
	};

	this.accessModalLogin = () => {
		$('body').on('click', '.modal-custom-login .modal-custom-login-btn.google_access', () => {
			self.socialModalLogin('Google');
		})

		$('body').on('click', '.modal-custom-login .modal-custom-login-btn.facebook_access', () => {
			self.socialModalLogin('Facebook');
		})
	}

	this.verifyLogged = () => {
		vtexjs.checkout.getOrderForm().done(function (_user_infos) {
			if (_user_infos.loggedIn !== true) {
				$('body').append(templates.templatesLogin);
				$('body').addClass('is--checkout-disconnected');
			} else {
				$('body').removeClass('is--checkout-disconnected');
			}
		});
	};

	function reload() {
		console.log('deu certo')
		// if (returnUrl) {
		// 	window.location = window.location.origin + returnUrl;
		// } else {
		// 	location.reload();
		// }
	}

	this.setListeners = () => {
		$('body').on('submit', '#checkout-modal-custom-login--form', function(ev) {
			ev.preventDefault();
			var params = $.extend(helpers.formtoobj($(this)), {
				recaptcha: '',
				authenticationToken: userInfos.authenticationToken
			});
			// console.log(params);
			self.request(routes.authenticateLogin, params)
				.then(function(data) {
					if (data.authStatus === 'Success') {
						helpers.authenticateUser([data.authCookie, data.accountAuthCookie], data.expiresIn);
						reload();
					} else if (data.authStatus === 'WrongCredentials') {
						helpers.printError('E-mail ou senha inválidos.');
					} else {
						helpers.printError(data.authStatus);
					}
				}, function(err) {
					helpers.printError(err);
				});
		})
	}

	// init functions
	this.init();
});
