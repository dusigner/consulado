/* globals store:true */
'use strict';

var CRM = require('modules/store/crm');
var redirect = require('modules/store/redirect');

var validation = require('modules/store/validation');

Nitro.module('login', function () {

	var self = this,
		$form;

	this.setup = function () {
		$form = $('.form-login');

		$form.each(function () {
			var _self = $(this);

			_self.fields = _self.find('input[type="text"], input[type="email"]');
			_self.fieldEmail = _self.find('input[name="email"]');
			_self.btnSubmit = _self.find('[type="submit"]');

			_self.submit(self.submit.bind(_self));

		});

		$form.fieldEmail = $form.find('input[name="email"]');

		this.init();
	};

	this.init = function () {

		var email = store.userData.email || store.uri.getQueryParamValue('email');

		if (email) {
			$form.fieldEmail.val(email);
		}

	};

	this.error = function (message) {

		this.btnSubmit.removeClass('loading');

		this.fieldEmail.data({
			title: message || this.data('msg-error'),
			html: true,
			placement: 'top',
			trigger: 'manual'
		}).tooltip('show');

	};

	this.submit = function (e) {
		e.preventDefault();

		//this = form;

		if (!this.btnSubmit.is('.loading')) {

			var form = this;

			validation.validate(this.fields, this.btnSubmit)
				.then(CRM.clientSearchByEmail.bind(null, form.fieldEmail.val()))
				.done(function(data) {
					if(data) {
						redirect.login(data);
					} else {
						var msg = 'Usuário não encontrado';

						$(store).trigger('store.user.not-found', form.fieldEmail.val());

						self.error.call(form, msg);
					}
				}.bind(form));
				/* .done(redirect.login)
				.fail(function (e, status, message) {

					var msg;

					if (message === 'Not Found') {
						msg = 'Usuário não encontrado';

						$(store).trigger('store.user.not-found', this.fieldEmail.val());
					}

					self.error.call(this, msg);

				}.bind(this)); */
		}

		return false;
	};

	this.setup();

});
