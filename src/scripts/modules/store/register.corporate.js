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
			.on('store.user.not-found', this.fillUserEmail)/*
			.on('store.cep.data', function() {
				$('.address-info').fadeIn()
					.find('input, select').removeClass('error').tooltip('destroy');
			})*/;

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
			} else {
				$form.find('.stateRegistration').attr('data-validation', 'required stateRegistration').val('').removeAttr('readonly');
			}
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
					$form.find('.neighborhood').val(endereco.neighborhood).trigger('change');
					$form.find('.city').val(endereco.city).trigger('change');
					$form.find('.addressName').val(endereco.street).trigger('change');
					$form.find('.state').val(endereco.state).trigger('change');
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

		//console.error( message );

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
	this.validCompany = function() {

		return CRM.clientSearchByCorporateDocument(self.getDocument())
			.done(function(data) {
				if(data) {
					dataLayer.push(
						{ event : 'formularioInvalido'}
					);
					self.error.call($form, 'Esse CNPJ já foi cadastrado.', $form.fieldDocument);
				} else {
					self.nextStep();
				}
			});
			/* .fail(
				self.nextStep); */

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
	this.prepareLocationData = function(dataAddress, data, result) {

		if (result && result.Id) {
			dataAddress.userId = result.Id.replace('CL-', '');
		}

		dataAddress.street = data.addressName;
		dataAddress.receiverName = data.firstName + ' ' + data.lastName;
		dataAddress.country = 'BRA';
		dataAddress.addressType = 'residential';

		return dataAddress;
	};

	this.register = function() {

		var data = {},
			dataUser = {},
			dataAddress = {};

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

		$.extend(data, {
			corporateDocument: self.getDocument(data.corporateDocument),
			isCorporate: true,
			homePhone: data.phone,
			businessPhone: data.phone
		});

		dataUser = data;

		/**
		 * A nova API não permite enviar campos que não existem, retornando erro
		 * Para resolver rápido foi necessário criar 2 objetos adicionando e removendo o necessário para cada POST
		 * Ajeitar depois
		 * SHAME -> https://giphy.com/gifs/shame-Ob7p7lDT99cd2
		 */

		if(data.postalCode) {
			dataAddress.postalCode = data.postalCode;
			delete dataUser.postalCode;
		}
		if(data.addressName) {
			dataAddress.addressName = data.addressName;
			delete dataUser.addressName;
		}
		if(data.number) {
			dataAddress.number = data.number;
			delete dataUser.number;
		}
		if(data.complement) {
			dataAddress.complement = data.complement;
			delete dataUser.complement;
		}
		if(data.neighborhood) {
			dataAddress.neighborhood = data.neighborhood;
			delete dataUser.neighborhood;
		}
		if(data.country) {
			dataAddress.state = data.country;
			delete dataUser.country;
		}
		if(data.state) {
			dataAddress.state = data.state;
			delete dataUser.state;
		}
		if(data.city) {
			dataAddress.city = data.city;
			delete dataUser.city;
		}
		if(data.confirmEmail) {
			delete dataUser.confirmEmail;
		}
		if(data.termos) {
			delete dataUser.termos;
		}
		if(data.addressType) {
			dataAddress.addressType = data.addressType;
			delete dataUser.addressType;
		}

		CRM.insertClient(dataUser)
			.then(self.prepareLocationData.bind(self, dataAddress, data))
			.then(CRM.insertLocation)
			.done(redirect.register.bind(self, data))
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
