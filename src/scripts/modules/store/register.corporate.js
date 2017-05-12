/* globals store:true */
'use strict';

var CRM = require('modules/store/crm');
var validation = require('modules/store/validation');
var getAddress = require('modules/getAddress');

require('vendors/slick');

//var redirect = require('modules/store/redirect');

Nitro.module('register.corporate', function() {

	var self = this,
		primaryInfoComplete = false,
		$modalRegister = $('#modal-register'),
		$form = $('.form-register');

	this.setup = function() {
		
		self.addFormMask();

		$form.fields = $form.find('input[type="text"], input[type="email"], input[type="tel"], select');
		$form.fieldEmail = $form.fields.filter('input[name="email"]');
		$form.primaryFields = $form.find('.primary-info').find($form.fields);
		$form.fieldDocument = $form.primaryFields.filter('input[name="corporateDocument"]');
		$form.btnSubmit = $form.find('[type="submit"]');

		$form.submit(this.submit.bind($form));

		$(store)
			.on('store.user.not-found', this.fillUserEmail)
			.on('store.cep.data', function() {
				$('.address-info').fadeIn()
					.find('input, select').removeClass('error').tooltip('destroy');
			});

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

		$modalRegister.find('.checkbox #isento').change(function() {
			console.log('clicou', this.checked);
			if(this.checked) {
				$form.find('.stateRegistration').removeAttr('data-validation').attr('disabled', 'disabled');
			} else {
				$form.find('.stateRegistration').attr('data-validation', 'required stateRegistration'). removeAttr('disabled');
			}
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
					console.log(endereco);
					$form.find('.neighborhood').val(endereco.bairro).trigger('change');
					$form.find('.city').val(endereco.localidade).trigger('change');
					$form.find('.addressName').val(endereco.logradouro).trigger('change');
					$form.find('.state').val(endereco.uf).trigger('change');
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
		$form.fieldEmail.val(email);

		$modalRegister.vtexModal();
	};

	this.error = function(message, $field) {

		$field = message !== false ? $field : this.btnSubmit;

		//console.error( message );

		this.btnSubmit.removeClass('loading');

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
	this.validCompany = function() {

		console.log('validando CLiente');

		return CRM.clientSearchByCorporateDocument(self.getDocument())
			.done(function(client) {

				self.error.call($form, 'Esse CNPJ já foi cadastrado.', $form.fieldDocument);

			})
			.fail(self.nextStep);

	};

	this.nextStep = function() {
		$form.btnSubmit.removeClass('loading');
		primaryInfoComplete = true;
		$modalRegister.find('.steps').slick('slickGoTo', '1');
		$modalRegister.find('.buttons a').fadeIn();
	};

	/*this.validRegister = function() {
		console.log('validando registro');
		return CRM.registerSearch($form.fieldRe.val(), self.getDocument())
			.done(function() { //done

				$form.fieldDocument.add($form.fieldRe).prop('readonly', true);

				$('.step-1').fadeOut('slow', function() {
					$('.step-2').fadeIn();

					$form.btnSubmit.removeClass('loading');
				});

				primaryInfoComplete = true;

			})
			.fail(self.error.bind($form, 'RE não encontrado', $form.fieldRe));

	};
*/
	/*this.prepareLocationData = function(data, result) {

		if (result && result.Id) {
			data.userId = result.Id.replace('CL-', '');
		}

		return data;
	};*/

	/*this.register = function() {

		var data = {};

		$.map($form.serializeArray(), function(x) {
			if (!x.value || x.value === '') {
				return;
			}
			data[x.name] = x.value;
		});

		$.extend(data, {
			document: self.getDocument(data.document),
		});

		CRM.insertClient(data)
			.then(self.prepareLocationData.bind(self, data))
			.then(CRM.insertLocation)
			.done(redirect.register.bind(self, data), dataLayer.push({ event: 'logados-via-faca-parte', category: 'modal-taxa-de-login', action: 'logados-via-faca-parte', label: '-' }))
			.done(self.resetForm)
			.fail(self.error.bind($form, false));
	};*/

	/*this.resetForm = function() {

		this.btnSubmit.removeClass('loading');

		$modalRegister.vtexModal('close');

	};*/

	this.submit = function(e) {
		e.preventDefault();

		//this = form;


		if (!this.btnSubmit.is('.loading')) {

			if (primaryInfoComplete) { //first step done
				/*console.log('primayInfo');
				console.log('fields', this.fields);*/
				validation.validate(this.fields, this.btnSubmit)
					.done(self.register);
			} else {
				/*console.log('secondary');*/
				validation.validate(this.primaryFields, this.btnSubmit)
					.done(self.validCompany);
			}

		}

		return false;
	};

	this.setup();

});
