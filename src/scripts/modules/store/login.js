/* globals store:true */
'use strict';

var CRM = require('modules/store/crm');
var redirect = require('modules/store/redirect');

var validation = require('modules/store/validation');

Nitro.module('login', function () {

	var self = this,
		$modalRegister = $('#modal-register'),
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

		if (!this.btnSubmit.is('.loading')) {

			var form = this,
				fields = 'id,userId,email,firstName,lastName,homePhone,xAdditionalPhone,corporateDocument,corporateName,tradeName,stateRegistration,isFreeStateRegistration,xBusinessType,xContribuinteICMS,xRegimeApuracaoPIS,xValidationPJ,xApprovedDate',
				dateNow = new Date().getTime();

			validation.validate(this.fields, this.btnSubmit)
				.then(CRM.clientSearchByEmail.bind(null, form.fieldEmail.val(), fields))
				.done(function(data) {
					if (data) { //e-mail cadastrado
						var dateApproved = new Date(data.xApprovedDate).getTime();

						//se já foi aprovado há mais de 6 meses, solicita revalidação dos dados
						if (data.xValidationPJ === 'aprovado' && (dateNow - dateApproved) >= 15768000000) {
							//abre modal de revalidação
							$('#modal-register').attr('data-title', 'Atualize os dados cadastrais para continuar no site');

							$modalRegister.vtexModal({
								open: function () {
									$('#modal-register').addClass('revalidation');
									//busca informações de endereço
									// var address = self.getAddressInfo(form.fieldEmail.val());

									//preenche formulário com informações cadastradas
									self.fullRevalidationForm(data);
								}
							});
						} else {
							redirect.login(data);
						}
					} else { //e-mail não cadastrado
						var msg = 'Usuário não encontrado';

						$(store).trigger('store.user.not-found', form.fieldEmail.val());

						self.error.call(form, msg);
					}
				}.bind(form));
		}

		return false;
	};

	this.getAddressInfo = function (email) {
		return $.getJSON(CRM.formatUrl('AD', 'search'), {
			_fields: 'postalCode,street,number,complement,neighborhood,state,city',
			userId: email
		}).then(function (res) {
			return res && res[0];
		});
	};

	this.fullRevalidationForm = function (data) {
		$modalRegister.find('.corporateDocument').attr('readonly', true);
		$modalRegister.find('.corporateDocument').val(data.corporateDocument);
		$modalRegister.find('.corporateName').val(data.corporateName);
		$modalRegister.find('.tradeName').val(data.tradeName);
		$modalRegister.find('.stateRegistration').val(data.stateRegistration);
		$modalRegister.find('.businessType').val(data.xBusinessType);
		$modalRegister.find('.xRegimeApuracaoPIS').val(data.xRegimeApuracaoPIS);

		if (data.isFreeStateRegistration) {
			$modalRegister.find('#isFreeStateRegistration').siblings('label').trigger('click');
		}

		if (data.xContribuinteICMS) {
			$modalRegister.find('#xContribuinteICMS').siblings('label').trigger('click');
		}

		$modalRegister.find('.email').val(data.email);
		$modalRegister.find('.confirmEmail').val(data.email);
		$modalRegister.find('.firstName').val(data.firstName);
		$modalRegister.find('.lastName').val(data.lastName);
		$modalRegister.find('.phone').val(data.homePhone);
		$modalRegister.find('.xAdditionalPhone').val(data.xAdditionalPhone);
	};

	this.setup();

});
