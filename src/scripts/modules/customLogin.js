/*
* @fileOverView Login
* @authors Matheus Gomide
*/

'use strict';

require('vendors/vtex-modal');

Nitro.module('customLogin', function() {
	var self = this,
		returnUrl = false,
		$modalBody = $('.modal-custom-login--body'),
		$subtitle = $('.modal-custom-login--subtitle2'),
		routes = {
			authenticateByEmailKey: '/pub/authentication/accesskey/validate',
			authenticateLogin: '/pub/authentication/classic/validate',
			getEmailAcessKey: '/pub/authentication/accesskey/send',
			getToken: '/pub/authentication/start',
			setPassword: '/pub/authentication/classic/setpassword',
			getOAuthUrl: 'https://vtexid.vtex.com.br/api/vtexid/pub/authentication/oauth/redirect'
		},		
		userInfos = {
			initialCallback: {
				callbackUrl: window.location.protocol + '//' + window.location.host + '/api/vtexid/pub/authentication/finish',
				scope: window.jsnomeLoja,
				user: null, 
				locale: 'pt-BR'
			},
			faceLogin : false,
			googleLogin : false
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
		},
		templates = {
			emailAcessLayout:
			'<div id="email_access_login" class="modal-custom-login--email-access-layout">' +
				'<form id="modal-custom-login-email-access--form">' +
					'<div class="modal-custom-login-mail_pass_login">' +
						'<div class="modal-custom-email--inputbox">' +
							'<input type="text" id="custom_login_email" class="custom-label" name="custom_login_email">' +
						'</div>' +
						'<div class="custom-login-buttons--action--box">' +
							'<span class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--toDefault">Voltar</span>' +
							'<button type="submit" class="custom-login-btn btn-custom-secondary">Confirmar</button>' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>',
			keysLayout: function (resetPw) {
				return '' +
				'<div id="access_key_fiels" class="modal-custom-login--key-access-layout">' + 
					'<form id="modal-custom-login-key-access--form' + ((resetPw) ? '-setting-pw' : '') + '">' +
						'<div class="modal-custom-login-key">' +
						'    <div class="modal-custom-login-key__fields">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
								'<input type="tel" maxlength="1" class="acess_key_value">' +
							'</div>' +
							'<div class="custom-login-buttons--action--box">' +
								'<span class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--' + ((resetPw) ? 'toDefault' : 'toEmail') + '">Voltar</span>' +
								'<input type="submit" class="custom-login-btn btn-custom-secondary" value="' + ((resetPw) ? 'Confirmar' : 'Entrar') + '">' +
							'</div>' +
						'</div>' +
					'</form>' +
				'</div>';
			},
			emailToPassLayout:
			'<div id="email-to-pass" class="modal-custom-login-email-to-pw">' +
				'<form id="modal-custom-login-email-access--form--setting-pw">' +
					'<div class="modal-custom-login-mail_pass_login">' +
						'<div class="modal-custom-email--inputbox">' +
							'<input type="text" id="custom_login_email" class="custom-label" name="custom_login_email">' +
						'</div>' +			
						'<div class="custom-login-buttons--action--box">' +
							'<span class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--toDefault">Voltar</span>' +
							'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Continuar">' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>',
			setPwLayout:
			'<div id="setting-pw" class="modal-custom-login-email-to-pw">' +
				'<form id="modal-custom-login-setting-pw">' +
					'<div class="modal-custom-login-set-pw">' +
						'<div class="modal-custom--inputbox modal-custom-set-password--inputbox">' +
							'<input type="password" id="custom-login-sett-pw" class="custom-label" name="password">' +
						'</div>' +		
						'<div class="modal-custom--inputbox modal-custom-set-confirm-password--inputbox">' +
							'<input type="password" id="custom-login-confirm-sett-pw" class="custom-label" name="confirm_password">' +
						'</div>' +	
						'<div class="password-validate-indicators">' +
						'<span class="password-validate--title">Sua senha deve ter</span>' +
						'<ul>' +
							'<li class="hasMinimum">- Mínimo de 8 caractéres</li>' +
							'<li class="hasDigitIndicator">- 1 número</li>' +
							'<li class="hasLowercaseIndicator">- 1 letra minúscula</li>' +
							'<li class="hasUppercaseIndicator">- 1 letra maiúscula</li>' +
						'</ul>' +
						'</div>' +
						'<div class="custom-login-buttons--action--box">' +
							'<span class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--toDefault">Voltar</span>' +
							'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Continuar">' +
						'</div>' +
					'</div>' +
				'</form>' +
			'</div>'
		},
		hasUppercase = '(?=.*?[A-Z])',
		hasLowercase = '(?=.*?[a-z])',
		hasDigit = '(?=.*?[0-9])',
		hasMinium = '.{8,}';

	this.init = function() {
		self.setListeners();
		
		userInfos.initialCallback.scope = window.jsnomeLoja;

		setEnviroment();
		window.setInterval(setEnviroment, 1000 * 60 * 5);

		function setEnviroment() {
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
					'<div class="modal-custom-login--init-layout">' +
						'<div class="modal-custom-login--forms">' +
							'<div id="mail_pass_login">' +
								'<p class="modal-custom-login--sectitles">Entre com um email e senha</p>' +
								'<form id="modal-custom-login--form">' +
									'<div class="modal-custom-login-mail_pass_login">' +
										'<div class="modal-custom-email--inputbox">' +
										'<input type="text" id="login" class="custom-label" name="login" autocomplete="off">' +
										'</div>' +								
										'<div class="modal-custom-password--inputbox">' +
										'<input type="password" id="password" class="custom-label" name="password">' +
										'</div>' +				
										'<div class="modal-custom-login--formOptions">' +
										'<span class="forget_pass">Esqueci minha senha</span>' +
										'<span class="no_pass">Não tenho uma senha</span>' +
										'</div>' +			
										'<div class="custom-login-buttons--action--box">' +	
										'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Entrar">' +
										'</div>' +
									'</div>' +
								'</form>' +
							'</div>' +
						'</div>' +
						'<div class="modal-custom-login--buttons">' +
							'<p class="modal-custom-login--sectitles">Ou entre por uma das opções abaixo:</p>' +
							'<div class="modal-custom-login--buttons--box">' + 
								'<button class="modal-custom-login-btn mailkey"><i class="icon icon-email"></i>' + 
								($(window).width() <= 768  ? 'Chave por e-mail' : 'Receber chave de acesso por email') + '</button>' +
								((userInfos.faceLogin) ? '<button class="modal-custom-login-btn facebook_access">Entrar com Facebook</button>' : '') +
								((userInfos.googleLogin) ? '<button class="modal-custom-login-btn google_access">Entrar com Google</button>' : '') +					
							'</div>' +
						'</div>' +
					'</div>';
				});
		}

		if (window.location.href.indexOf('/login') > -1) {
			var url_string = window.location.href; //window.location.href
			var url = new URL(url_string);
			var c = url.searchParams.get('ReturnUrl');
			returnUrl = c;			
			setTimeout(initModal, 2000);
		}

		function initModal() {
			self.setDefaultLayout();		
			$('#modal-custom-login').vtexModal();

			setTimeout(function() {
				// get the password field
				var el = document.getElementById('password');
				el.focus();
				el.select();
				var noChars = el.selectionEnd;

				document.querySelector('input#login.custom-label').focus();

				if (noChars !== 0) {
					$('#password').parent().addClass('label-on');
				}

			}, 1000);
		}

		if (window.vtexid) {
			window.vtexid.start = function() {
				initModal();
			};
		}

		// self.verifyLogin();
		self.setDefaultLayout();
	};

	this.request = function(route, params) {
		return $.ajax({
			url: 'https://vtexid.vtex.com.br/api/vtexid' + route,
			data: params,
			dataType: 'jsonp'
		});
	};

	this.setListeners = function() {
		if ($(window).width() < 768 ) {
			$('.modal-custom-login--buttons .modal-custom-login-btn.mailkey').text('Chave por e-mail');
		}

		$('#modal-custom-login')
			.on('submit', '#modal-custom-login-email-access--form--setting-pw', function(e) {
				e.preventDefault();
				userInfos.email = $(this).find('#custom_login_email').val();
				
				if(helpers.isEmail(userInfos.email)) {
					self
					.request(routes.getEmailAcessKey,
						{
							email: userInfos.email,
							authenticationToken: userInfos.authenticationToken
						}
						)
					.then(function(){
						self.setKeysLayout(true);
						focusFirstInput();
					}, function() {
						helpers.printError('Ops, encontramos um erro, por favor tente novamente mais tarde.');
					});
				} else {
					helpers.printError('E-mail inválido.');
				}
			})
			// SUBMIT CHAVE ENVIADA PRO EMAIL
			.on('submit', '#modal-custom-login-key-access--form', function(e) {
				e.preventDefault();
				var key = '';

				$(this).find('.acess_key_value').each(function() {
					key += $(this).val();
				});

				if (key.length < 6 || key.length > 6) {
					helpers.printError('Chave de acesso inválida. Verifique a digitação.');
					$('.modal-custom-login-key__fields').addClass('invalid__key');
				} else {
					self.request(routes.authenticateByEmailKey, 
						{							
							login: userInfos.email,
							accesskey: key,
							authenticationToken: userInfos.authenticationToken
						}
					).then(function(data) {
						if (data.authStatus === 'Success') {
							helpers.authenticateUser([data.authCookie, data.accountAuthCookie], data.expiresIn);
							reload();
						} else if (data.authStatus === 'WrongCredentials') {
							helpers.printError('Chave de acesso inválida. Verifique a digitação.');
							$('.modal-custom-login-key__fields').addClass('invalid__key');
						} else {
							helpers.printError(data.authStatus);
						}
					}, function(err) {
						helpers.printError(err);
					});
				}
			})
			// Voltar set Layout: Set email
			.on('click', '.btn--voltar--toEmail', function(e) {		
				e.preventDefault();	
				self.setEmailAccessLayout();
			})
			// No password: Set email to pass
			.on('click', '.no_pass', function(e) {		
				e.preventDefault();	
				self.setEmailToPwLAyout(true);
			})
			// Forget password: Set new pass
			.on('click', '.forget_pass', function(e) {		
				e.preventDefault();
				self.setEmailToPwLAyout(true);
			})
			// VALIDAR CADASTRO DE SENHA
			.on('keyup', '#custom-login-sett-pw', function() {
				var pass = $(this).val();

				(pass.match(hasUppercase)) ? $('.hasUppercaseIndicator').addClass('validated') : $('.hasUppercaseIndicator').removeClass('validated');
				(pass.match(hasLowercase)) ? $('.hasLowercaseIndicator').addClass('validated') : $('.hasLowercaseIndicator').removeClass('validated');
				(pass.match(hasDigit)) ? $('.hasDigitIndicator').addClass('validated') : $('.hasDigitIndicator').removeClass('validated');
				(pass.match(hasMinium)) ? $('.hasMinimum').addClass('validated') : $('.hasMinimum').removeClass('validated');

			})
			// SUBMIT CADASTRO DE SENHA	
			.on('submit', '#modal-custom-login-setting-pw', function(e) {
				e.preventDefault();
				var newPass = $(this).find('#custom-login-sett-pw').val();

				if ($(this).find('#custom-login-sett-pw').val() !== $(this).find('#custom-login-confirm-sett-pw').val()) {
					helpers.printError('A senhas devem ser iguais');
				} else if (!newPass.match(hasUppercase) || !newPass.match(hasLowercase) || !newPass.match(hasDigit) || !newPass.match(hasMinium)) {
					helpers.printError('Sua senha não possui as regras exigidas.');
				} else {
					self.request(routes.setPassword, {
						authenticationToken: userInfos.authenticationToken,
						newPassword: newPass,
						login: userInfos.email,
						accesskey: userInfos.accesskey
					}).then(function(data) {
						helpers.authenticateUser([data.authCookie, data.accountAuthCookie], data.expiresIn);
						reload();
						// window.location.href = '/';
					});
				}				
			})
			// Submit solicitar chave para e-mail
			.on('submit', '#modal-custom-login-email-access--form', function(e) {
				e.preventDefault();
				userInfos.email = helpers.formtoobj($(this)).custom_login_email;

				if(helpers.isEmail(userInfos.email)) {
					self
						.request(routes.getEmailAcessKey,
						{
							email: userInfos.email,
							authenticationToken: userInfos.authenticationToken
						}
						)
						.then(function(){
							self.setKeysLayout();
							focusFirstInput();
						}, function() {
							helpers.printError('Ops, encontramos um erro, por favor tente novamente mais tarde.');
						});
				} else {
					helpers.printError('E-mail inválido.');
				}					
			})	
			.on('submit', '#modal-custom-login-key-access--form-setting-pw', function(e) {				
				e.preventDefault();
				var key = '';

				$(this).find('.acess_key_value').each(function() {
					key += $(this).val();
				});

				if (key.length < 6 || key.length > 6) {
					helpers.printError('Chave de acesso inválida. Verifique a digitação.');
					$('.modal-custom-login-key__fields').addClass('invalid__key');
				} else {
					userInfos.accesskey = key;
					self.setPwLayout();
					focusFirstInput();
				}
			})
			// Submit form login e senha
			.on('submit', '#modal-custom-login--form', function(e) {		
				e.preventDefault();	
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
			// Botão voltar set Layout: Default
			.on('click', '.btn--voltar--toDefault', function(e) {		
				e.preventDefault();	
				self.setDefaultLayout();

				focusFirstInput();
			})
			// Botão "Acesso por e-mail" set Layout: Solicitar chave pelo e-mail
			.on('click', '.modal-custom-login-btn.mailkey', function() {			
				self.setEmailAccessLayout();
				focusFirstInput();
			})
			// Botão Access Facebook
			.on('click', '.modal-custom-login-btn.facebook_access', function() {			
				self.socialLogin('Facebook');
			})
			// Botão Access Google
			.on('click', '.modal-custom-login-btn.google_access', function() {			
				self.socialLogin('Google');
			})
			.on('focusin', '.custom-label', function() {			
				$(this).parent().addClass('label-on');
			})
			.on('change', '.custom-label', function() {
				$('.custom-label').each(function() {
					if (this.value.length === 0) {
						$(this).parent().removeClass('label-on');
					} else {
						$(this).parent().addClass('label-on');
					}
				});
			})
			.on('focusout', '.custom-label', function() {
				$('.custom-label').each(function() {
					if (this.value.length === 0) {
						$(this).parent().removeClass('label-on');
					} else {
						$(this).parent().addClass('label-on');
					}
				});
			})
			.on('keyup', '.acess_key_value', function(event) {
				var keypressed = event.key;
				if (keypressed.match(hasDigit)) {
					$(this).val(keypressed);
					if($(this).next().hasClass('acess_key_value')) {
						$(this).next().focus();
					}
				}
				// if($(this).next().hasClass('acess_key_value') && $(this).val().match(hasDigit)) {
				// 	$(this).next().focus();
				// }
			})			
			.on('click', '.modal-custom-email--inputbox', function() {
				$(this).find('input').focus();
			})
			.on('click', '.modal-custom-password--inputbox', function() {
				$(this).find('input').focus();
			})
			.on('click', '.modal-custom--inputbox', function() {
				$(this).find('input').focus();
			});
	};

	this.socialLogin = function(origem) {
		var urlAuthentication = routes.getOAuthUrl;
		
		urlAuthentication += '?authenticationToken=' + encodeURIComponent(userInfos.authenticationToken).replace(/ /g,'+');
		urlAuthentication += '&providerName=' + encodeURIComponent(origem);

		var oauthPopUp = window.open(urlAuthentication,'Authenticate', 'width=800,height=600,scrollbars=yes');

		var pollTimer = window.setInterval(function() {
			
			try {					

				if (oauthPopUp.location.href.indexOf(window.location.host) !== -1) {

					window.clearInterval(pollTimer);

					var obj = helpers.urlToObject(oauthPopUp.location.search.substring(1));

					obj.authStatus && (self.validateSocialOAuth(obj), oauthPopUp.close());				

				} 
			} catch(e) {
				//console.error(e);
			}
		}, 50);
	};

	this.validateSocialOAuth = function(data) {

		window.authenticationToken = data.authenticationToken ? data.authenticationToken.split('#')[0] : window.authenticationToken;
		
		if (data.authStatus === 'Success') {
			
			helpers.setCookie(decodeURIComponent(data.authCookieName), decodeURIComponent(data.authCookieValue), '.' + location.hostname.split('.').reverse()[1] + '.' + location.hostname.split('.').reverse()[0], data.expiresIn);
			
			helpers.setCookie(decodeURIComponent(data.accountAuthCookieName), decodeURIComponent(data.accountAuthCookieValue), '.' + location.hostname.split('.').reverse()[1] + '.' + location.hostname.split('.').reverse()[0], data.expiresIn);
			
			$.magnificPopup.close();

			$(window).trigger('loggedBySocialOAuth.vtexid');
			$(window).trigger('logged.vtexid');

			reload();
			
		} else if (data.authStatus === 'Pending') {
			
			// console.warn('SessÃ£o pendente');
			
		} else if (data.authStatus === 'WrongCredentials'){
					
			// console.warn('Credenciais erradas');
			
		} else if (data.authStatus === 'MultipleAccount') {
			
			// console.warn('Logado em mais de uma conta');
		}
	},

	// Layout: Inicial
	this.setDefaultLayout = function() {		
		$modalBody.html(templates.defaultLayout);
		$subtitle.html('ACESSE SUA CONTA');
		focusFirstInput();
	};
	
	// Layout: Solicitar chave pelo e-mail
	this.setEmailAccessLayout = function() {		
		$modalBody.html(templates.emailAcessLayout);
		$subtitle.html('Informe seu e-mail');
		focusFirstInput();
	};	

	// Layout: Inserir chave
	this.setKeysLayout = function(resetinPw) {		
		if(resetinPw) {
			$modalBody.html(templates.keysLayout(true));
		} else {
			$modalBody.html(templates.keysLayout());
		}
		$subtitle.html('Informe o código enviado para o email <b>' + userInfos.email + '</b>');
	};

	// Layout: E-mail para password
	this.setEmailToPwLAyout = function() {		
		$modalBody.html(templates.emailToPassLayout);
		$subtitle.html('Informe seu e-mail');
		focusFirstInput();
	};

	// Layout: Layout para redefinir a Senha
	this.setPwLayout = function() {
		$subtitle.html('Cadastre uma senha');
		$modalBody.html(templates.setPwLayout);
		focusFirstInput();
	};

	function focusFirstInput() {
		$('.modal-custom-login--body input').first().focus();
	}

	function reload() {
		if (returnUrl) {
			window.location = window.location.origin + returnUrl;
		} else {
			location.reload();
		}
	}

	if (store.isPersonal) {
		this.init();
	}
});
