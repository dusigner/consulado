/* global $: true, Nitro: true, vtexid: true */
'use strict';

require('vendors/vtex-modal');

Nitro.module('customLogin', function() {
	var self = this,
		$modalBody = $('.modal-custom-login--body'),
		$modalHeader = $('.mode-custom-login--header'),
		$subtitle = $('.modal-custom-login--subtitle2'),
		routes = {
			authenticateByEmailKey: '/pub/authentication/accesskey/validate',
			authenticateLogin: '/pub/authentication/classic/validate',
			getEmailAcessKey: '/pub/authentication/accesskey/send',
			getToken: '/pub/authentication/start'
		},
		helpers = {
			formtoobj : function(form) {
				var unindexed_array = form.serializeArray();
				var indexed_array = {};
			
				$.map(unindexed_array, function(n, i){
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
			}
		},
		templates = {
			emailAcessLayout:
			'<div id="email_access_login" class="modal-custom-login--email-access-layout">' +
				'<p class="modal-custom-login--sectitles">Por favor informe seu email e fique atento, te enviaremos um código de acesso.</p>' +
				'<form id="modal-custom-login-email-access--form">' +
					'<div class="modal-custom-login-mail_pass_login">' +
						'<div class="modal-custom-email--inputbox">' +
							'<input type="text" id="custom_login_email" class="custom-label" name="custom_login_email">' +
						'</div>' +			
						'<button class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--toDefault">Voltar</button>' +
						'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Solicitar chave">' +
					'</div>' +
				'</form>' +
			'</div>',
			defaultLayout: 
			'<div class="modal-custom-login--init-layout">' +
				'<div class="modal-custom-login--forms">' +
					'<div id="mail_pass_login">' +
						'<p class="modal-custom-login--sectitles">Entre com um email e senha</p>' +
						'<form id="modal-custom-login--form">' +
							'<div class="modal-custom-login-mail_pass_login">' +
								'<div class="modal-custom-email--inputbox">' +
									'<input type="text" id="custom_login_email" class="custom-label" name="custom_login_email">' +
								'</div>' +									
								'<div class="modal-custom-password--inputbox">' +
									'<input type="text" id="custom_login_password" class="custom-label" name="custom_login_password">' +
								'</div>' +				
								'<div class="modal-custom-login--formOptions">' +
									'<span class="forget_pass">Esqueci minha senha</span>' +
									'<span class="no_pass">Não tenho uma senha</span>' +
								'</div>' +				
								'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Entrar">' +
							'</div>' +
						'</form>' +
					'</div>' +
				'</div>' +
				'<div class="modal-custom-login--buttons">' +
					'<p class="modal-custom-login--sectitles">Ou entre por uma das opções abaixo:</p>' +
					'<button class="modal-custom-login-btn mailkey">Receber chave de acesso por email</button>' +
					'<button class="modal-custom-login-btn facebook_access">Entrar com Facebook</button>' +
					'<button class="modal-custom-login-btn google_access">Entrar com Google</button>' +
				'</div>' +
			'</div>',
			keysLayout:
			'<div id="access_key_fiels" class="modal-custom-login--key-access-layout">' +
				'<form id="modal-custom-login-key-access--form">' +
					'<div class="modal-custom-login-key">' +
					'    <div class="modal-custom-login-key__fields">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
							'<input type="text" maxlength="1" class="acess_key_value">' +
						'</div>' +
						'<button class="custom-login-btn btn-custom-primary btn--voltar btn--voltar--toEmail">Voltar</button>' +
						'<input type="submit" class="custom-login-btn btn-custom-secondary" value="Entrar">' +
					'</div>' +
				'</form>' +
			'</div>'
		},
		userInfos = {};

	this.init = function() {
		self.setListeners();
		self.request(routes.getToken)
			.done(function(response) {
				userInfos.authenticationToken = response.authenticationToken;
			});

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
		$('#modal-custom-login')
			// SUBMIT CHAVE ENVIADA PRO EMAIL
			.on('submit', '#modal-custom-login-key-access--form', function(e) {
				e.preventDefault();
				var key = '';

				$(this).find('.acess_key_value').each(function() {
					key += $(this).val();
				});

				if (key.length < 6 || key.length > 6) {
					console.log('Chave inválida.');
				} else {
					self.request(routes.authenticateByEmailKey, 
						{							
                            login: userInfos.email,
                            accesskey: key,
                            authenticationToken: userInfos.authenticationToken
						}
					).then(function(data) {
						helpers.authenticateUser([data.authCookie, data.accountAuthCookie], data.expiresIn);
						// window.location.href = '/';
					}, function(err) {
						// console.log(err);
					});
				}
			})
			// Voltar set Layout: Set email
			.on('click', '.btn--voltar--toEmail', function(e) {		
				e.preventDefault();	
				self.setEmailAccessLayout();
			})
			// Submit solicitar chave para e-mail
			.on('submit', '#modal-custom-login-email-access--form', function(e) {
				e.preventDefault();
				userInfos.email = helpers.formtoobj($(this)).custom_login_email;
				self.request(routes.getEmailAcessKey,
					{
						email: userInfos.email,
						authenticationToken: userInfos.authenticationToken
					}
					).then(function(response){
						self.setKeysLayout();
					}, function(err) {
						console.log('Não foi possivel enviar a chave de acesso', err);
					});
			})	
			// Submit form login e senha
			.on('submit', '#modal-custom-login--form', function(e) {		
				e.preventDefault();	
				// var params = $.extend(helpers.formtoobj($(this)), {authenticationToken: userInfos.authenticationToken});
				// self.request(routes.authenticateLogin, params)
				// 	.done(function(response) {
				// 		console.log(response);
				// 	});	
			})		
			// Botão voltar set Layout: Default
			.on('click', '.btn--voltar--toDefault', function(e) {		
				e.preventDefault();	
				self.setDefaultLayout();
			})
			// Botão "Acesso por e-mail" set Layout: Solicitar chave pelo e-mail
			.on('click', '.modal-custom-login-btn.mailkey', function() {			
				self.setEmailAccessLayout();
			})
			// efeitos labels
			.on('focusin', '.custom-label', function(e) {			
				$(this).parent().addClass('label-on');
			})
			.on('focusout', '.custom-label', function(e) {	
				if (this.value.length === 0) {
					$(this).parent().removeClass('label-on');
				}
			});

		// Substituindo todos os triggers do botão #login para somente abrir o modal novo
		$('body').off('click','#login');
		$('body').on('click', '#login', function() {
			$('#modal-custom-login').vtexModal();
		});	

	};

	// Layout: Inicial
	this.setDefaultLayout = function() {		
		$modalBody.html(templates.defaultLayout);
		$subtitle.html('Acesse sua conta');
	};
	
	// Layout: Solicitar chave pelo e-mail
	this.setEmailAccessLayout = function() {		
		$modalBody.html(templates.emailAcessLayout);
		$subtitle.html('Informe seu e-mail');
	};	

	// Layout: Inserir chave
	this.setKeysLayout = function() {		
		$modalBody.html(templates.keysLayout);
		$subtitle.html('Informe o código enviado para o email <b>' + userInfos.email + '</b>');
	};

	this.init();
});
