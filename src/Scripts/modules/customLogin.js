/*
* @fileOverView Login
* @authors Matheus Gomide
*/

'use strict';

Nitro.module('customLogin', function() {
	var self = this,
		returnUrl = false,
		$modalBody = $('.modal-custom-login--body'),
		$subtitle = $('.modal-custom-login--subtitle2'),
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
							'<h3 class="modal-custom__inputitle">Bem pensado</h3>' +
							'<p class="modal-custom__inputext">Informe seu e-mail</p>' +
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
							'<h3 class="modal-custom__inputitle">Bem pensado</h3>' +
							'<p class="modal-custom__inputext">Informe o codigo enviado para seu email</p>' +
							'<div class="modal-custom-login-key__fields">' +
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
				'<h3 class="modal-custom__inputitle">Bem pensado</h3>' +
				'<p class="modal-custom__inputext">Informe seu e-mail</p>' +
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
								'<p class="modal-custom-login--sectitles">Entre com um email e senha:</p>' +
								'<form id="modal-custom-login--form">' +
									'<div class="modal-custom-login-mail_pass_login">' +
										'<div class="modal-custom-email--inputbox">' +
											'<input type="text" id="login" placeholder="seu@email.com.br" class="custom-label" name="login" autocomplete="off">' +
										'</div>' +
										'<div class="modal-custom-password--inputbox">' +
											'<input type="password" id="password" placeholder="Senha" class="custom-label" name="password">' +
										'</div>' +
										'<div class="modal-custom-login--formOptions">' +
											'<span class="forget_pass">Esqueci minha senha</span>' +
											'<span class="no_pass">Não tenho uma senha</span>' +
										'</div>' +
										'<div class="custom-login-buttons--checkbox">' +
										'<input type="checkbox" class="custom-login-btn-check" value="Concordo">' +
										'<span>Li e concordo com os <a href="https://consul.custhelp.com/app/answers/detail/a_id/511" target="_blank">termos e condições</a></span>' +
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
								((userInfos.faceLogin) ? '<button class="modal-custom-login-btn facebook_access">Entrar com <strong>Facebook</strong></button>' : '') +
								((userInfos.googleLogin) ? '<button class="modal-custom-login-btn google_access">Entrar com <strong>Google</strong></button>' : '') +
								'<button class="modal-custom-login-btn mailkey">' + ($(window).width() <= 768  ? 'Chave por e-mail' : 'Receber chave de acesso por email') + '</button>' +
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

	this.setListeners = function() {
		if ($(window).width() < 768 ) {
			$('.modal-custom-login--buttons .modal-custom-login-btn.mailkey').text('Chave por e-mail');
		}

		$(document).on('change', '.custom-login-buttons--checkbox input', ({currentTarget}) => {
			const $element = $(currentTarget);

			if ($element.is(':checked')) {
				$element.addClass('is--checked');
				$element.parents('#mail_pass_login').addClass('is--checked');
			} else {
				$element.removeClass('is--checked');
				$element.parents('#mail_pass_login').removeClass('is--checked');
			}
		});

		$('#modal-custom-login')
			.on('submit', '#modal-custom-login-email-access--form--setting-pw', function(e) {
				e.preventDefault();
				userInfos.email = $(this).find('#custom_login_email').val();

				if(helpers.isEmail(userInfos.email)) {
					self.request(routes.getEmailAcessKey,{
						email: userInfos.email,
						authenticationToken: userInfos.authenticationToken
					}).then(function(){
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

					self.request(routes.getEmailAcessKey,{
						email: userInfos.email,
						authenticationToken: userInfos.authenticationToken
					}).then(function(){
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
			.on('change focusout', '.custom-label', function() {
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
        const url = `/api/vtexid/pub/authentication/oauth/redirect?providerName=${origem}`

        //monitor the closing of a popup window
        const popup = window.open(
            url,
            "DescriptiveWindowName",
            "width=720,height=520,resizable,scrollbars=yes,status=1"
        );

        const redirect = window.setInterval(() => {
            $.get("/no-cache/profileSystem/getProfile", function (data) {
                if (data.IsUserDefined) {
                    popup.close();
                    clearTimer();
                }
            });
        }, 1000);

        function clearTimer() {
            clearInterval(redirect);
            self.redirectUrl();
        }
	};

	this.redirectUrl = () => {
        const referrerVerify = document.referrer.indexOf('login');
        const verifyConsul = document.referrer.indexOf('consul');
        const searchParam = new URL(window.location.href).searchParams;
        const actualUrl = window.location.href;
        let redirectParam = '';

        if (actualUrl.match(/returnUrl/g)) {
            redirectParam = searchParam.get('returnUrl');
        } else if (actualUrl.match(/ReturnUrl/g)) {
            redirectParam = searchParam.get('ReturnUrl')
        } else if (actualUrl.match(/returnURL/g)) {
            redirectParam = searchParam.get('returnURL')
        }

        if (redirectParam) {
            window.location.href = `${decodeURIComponent(redirectParam)}${window.location.hash}`;
        } else if (referrerVerify != -1) {
            location.href = "https://loja.consul.com.br/";
        } else if (verifyConsul != -1) {
            location.href = document.referrer;
        } else {
            location.href = "https://loja.consul.com.br/";
        }
	};

	// Layout: Inicial
	this.setDefaultLayout = function() {
		$modalBody.html(templates.defaultLayout);
		$subtitle.html('ACESSE SUA CONTA');
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

	function reload() {
		if (returnUrl) {
			window.location = window.location.origin + returnUrl;
		} else {
			location.reload();
		}
	}

	function focusFirstInput() {
		$('.modal-custom-login--body input').first().focus();
	}

	if (store && store.isPersonal) {
		this.init();
	}

	// Substituindo todos os triggers do botão #login e envia para /login
	var url_atual = window.location.pathname;
	var url = location.href;
	url = url.split('/');
	$('body').off('click','#login');
	$('body').on('click', '#login', function() {
		if (url[2] === 'busca.consul.com.br') {
			window.location='https://loja.consul.com.br/login?ReturnUrl=/';
		}else{
			window.location='/login?ReturnUrl=' + url_atual + '';

		}
	});

});
