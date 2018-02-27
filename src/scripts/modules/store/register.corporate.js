/* globals store:true */
'use strict';

var CRM = require('modules/store/crm');
var validation = require('modules/store/validation');
var getAddress = require('modules/store/getAddress');
var redirect = require('modules/store/redirect');

require('vendors/slick');

Nitro.module('register.corporate', function() {

	var self = this,
		primaryInfoComplete = false,
		$modalRegister = $('#modal-register'),
		$modalTermo = $('#modal-termo'),
		$form = $('.form-register');

	this.setup = function() {

		self.addFormMask();

		$form.fields = $form.find('input[type="text"], input[type="email"], input[type="tel"], select, input[type="checkbox"]');
		$form.fieldEmail = $form.fields.filter('input[name="email"]');
		$form.primaryFields = $form.find('.primary-info').find($form.fields);
		$form.fieldDocument = $form.primaryFields.filter('input[name="corporateDocument"]');
		$form.btnSubmit = $form.find('[type="submit"]');
		$form.anchorTermo = $form.find('.anchor-termo');

		$form.submit(this.submit.bind($form));

		$(store)
		.on('store.user.not-found', this.fillUserEmail)
		.on('store.user.revalidation', this.fillUserEmail);

		$modalRegister.on('elementOpenVtexModal', function() {
			$modalRegister.find('.steps').slick({
				infinite: false,
				dots: false,
				arrows: false,
				draggable: false
			});
		}).on('elementCloseVtexModal', function () {
			$modalRegister.find('.steps').slick('unslick');
		});

		$modalRegister.find('.buttons a').click(function() {
			$modalRegister.find('.steps').slick('slickGoTo', '0');
		});

		$modalRegister.find('.checkbox #isFreeStateRegistration').change(function() {
			if(this.checked) {
				$form.find('.stateRegistration').removeAttr('data-validation').val('Isento').attr('readonly', 'readonly');
				$form.find('#xContribuinteICMS').removeAttr('checked').attr('disabled', 'disabled');
			} else {
				$form.find('.stateRegistration').attr('data-validation', 'required stateRegistration').val('').removeAttr('readonly');
				$form.find('#xContribuinteICMS').removeAttr('disabled');
			}
		});

		$modalRegister.find('.checkbox #xContribuinteICMS').change(function() {
			if(this.checked) {
				$form.find('#isFreeStateRegistration').removeAttr('checked').attr('disabled', 'disabled');
			} else {
				$form.find('#isFreeStateRegistration').removeAttr('disabled');
			}
		});

		//verifica se o campo de inscrição tem os caracteres necessários
		$form.find('.stateRegistration').keyup(function(e) {
			var val = $(this).val();
			val = val.replace(/[a-zA-Z]/g, '');
			$(this).val(val);
		});

		$form.anchorTermo.click(function(e) {
			e.preventDefault();
			$modalTermo.vtexModal();
		});
	};


	this.addFormMask = function () {
		$form.find('.corporateDocument').inputmask({
			mask: '99.999.999/9999-99',
			greedy: false,
			clearIncomplete: true
		});

		$form.find('.postalCode').inputmask({
			mask: '99999-999',
			greedy: false,
			clearIncomplete: true,
			oncomplete: function() {
				var poscalCode = $(this).val().replace(/\D/g, '');
				getAddress.byPostalCode(poscalCode).done(function(endereco) {
					endereco.neighborhood ? $form.find('.neighborhood').val(endereco.neighborhood).trigger('change').attr('readonly', 'readonly') : $form.find('.neighborhood').val('').removeAttr('readonly');
					endereco.city ? $form.find('.city').val(endereco.city).trigger('change').attr('readonly', 'readonly') : $form.find('.city').val('').removeAttr('readonly');
					endereco.street ? $form.find('.addressName').val(endereco.street).trigger('change').attr('readonly', 'readonly') : $form.find('.addressName').val('').removeAttr('readonly');
					endereco.state ? $form.find('.state').val(endereco.state).trigger('change').attr('readonly', 'readonly') : $form.find('.state').val('').removeAttr('readonly');
				});
			}
		});

		$form.find('.phone, .xAdditionalPhone').inputmask({
			mask: '(99) 9999-9999[9]',
			greedy: false,
			clearIncomplete: true
		});
	};


	this.fillUserEmail = function(e, email) {
		dataLayer.push(
			{ event : 'emailNãoCadastrado'}
		);

		$form.fieldEmail.val(email);

		$modalRegister.vtexModal();
	};

	this.error = function(message, $field) {

		$field = message !== false ? $field : $form.btnSubmit;

		$form.btnSubmit.removeClass('loading');

		$field.data({
			title: message || this.data('msg-error'),
			html: true,
			placement: 'top',
			trigger: 'manual'
		}).tooltip('show');

	};

	this.getDocument = function(document) {
		return (document || $form.fieldDocument.val() || '').replace(/[^\d]+/g, '');
	};


	/*
	busca na tabela de clientes pelo cnpj, caso cnpj não for encontrado
	avança para o passo seguinte do form
	*/
	this.validCompany = function () {

		return CRM.clientSearchByCorporateDocument(self.getDocument())
			.done(function (data) {
				if (data && !$('#modal-register').hasClass('revalidation')) {
					dataLayer.push(
						{ event: 'formularioInvalido' }
					);
					self.error.call($form, 'Esse CNPJ já foi cadastrado.', $form.fieldDocument);
				} else {
					self.nextStep();
				}
			});

	};

	this.nextStep = function() {

		dataLayer.push(
			{ event : 'cadastroValidado' }
		);
		$form.btnSubmit.removeClass('loading');
		primaryInfoComplete = true;
		$modalRegister.find('.steps').slick('slickGoTo', '1');
		$modalRegister.find('.buttons a').fadeIn();
	};
	
	this.prepareUserData = function(data) {

		var dataUser = {};

		dataUser.businessPhone           = data.phone;
		dataUser.corporateDocument       = self.getDocument(data.corporateDocument);
		dataUser.corporateName           = data.corporateName;
		dataUser.email                   = data.email;
		dataUser.firstName               = data.firstName;
		dataUser.homePhone               = data.phone;
		dataUser.isCorporate             = true;
		dataUser.isFreeStateRegistration = data.isFreeStateRegistration;
		dataUser.lastName                = data.lastName;
		dataUser.phone                   = data.phone;
		dataUser.stateRegistration       = data.stateRegistration;
		dataUser.tradeName               = data.tradeName;
		dataUser.xAdditionalPhone        = data.xAdditionalPhone;
		dataUser.xBusinessType           = data.xBusinessType;
		dataUser.xContribuinteICMS       = data.xContribuinteICMS;
		dataUser.xRegimeApuracaoPIS      = data.xRegimeApuracaoPIS;
		dataUser.xValidationPJ           = 'pendente';

		return dataUser;
	};
	this.prepareLocationData = function(data, result) {

		var dataAddress = {};

		if (result && result.Id) {
			dataAddress.userId = result.Id.replace('CL-', '');
		}

		dataAddress.addressName  = data.addressName;
		dataAddress.addressType  = 'residential';
		dataAddress.city         = data.city;
		dataAddress.complement   = data.complement;
		dataAddress.country      = 'BRA';
		dataAddress.neighborhood = data.neighborhood;
		dataAddress.number       = data.number;
		dataAddress.postalCode   = data.postalCode;
		dataAddress.receiverName = data.firstName + ' ' + data.lastName;
		dataAddress.state        = data.state;
		dataAddress.street       = data.addressName;

		return dataAddress;
	};

	this.register = function() {

		var data = {};

		$.map($form.serializeArray(), function(x) {
			if (!x.value || x.value === '') {
				return;
			}
			if (x.value === 'on') { //chenge checkbox on - off to true - false
				data[x.name] = true;
			} else if(x.value === 'off') {
				data[x.name] = false;
			} else {
				data[x.name] = x.value;
			}
		});

		if (data.phone) {
			data.phone = '+55' + data.phone;
		}

		var dataRegister = JSON.stringify(self.prepareUserData(data));

		CRM.insertCadastroSerialize({ dados: dataRegister });

		CRM.insertClient(self.prepareUserData(data))
			.then(self.prepareLocationData.bind(self, data))
			.then(CRM.insertLocation)
			.done($('#modal-register').hasClass('revalidation') ? redirect.revalidation.bind(self, data) : redirect.register.bind(self, data))
			.done(self.resetForm)
			.fail(self.error.bind($form, false));
	};

	this.resetForm = function() {

		$form.btnSubmit.removeClass('loading');

		$modalRegister.vtexModal('close');

	};

	this.submit = function(e) {
		e.preventDefault();

		//this = form;


		if (!$form.btnSubmit.is('.loading')) {

			if (primaryInfoComplete) { //first step done
				validation.validate(this.fields, $form.btnSubmit)
					.done(self.register);
			} else {
				validation.validate(this.primaryFields, $form.btnSubmit)
					.done(self.validCompany);
			}

		}

		return false;
	};

	this.setup();

});
