/* global $: true, Nitro: true */
'use strict';

require('vendors/jquery.inputmask');

/*jshint strict: false */
var CRM = require('modules/store/crm');

Nitro.module('checkout.phones', function() {
	const self             = this;
	const $modalMorePhones = $('#modal-more-phones');
	const $formPhones      = $('#formPhones');
	const $submit          = $formPhones.find('[type="submit"]');
	const $inputsPhones    = $formPhones.find('input[type="tel"]');
	const $requiredPhone   = $('#CL_phone');
	const $phoneError      = $('.phone-error-message');

	this.setup = function() {
		$inputsPhones.inputmask('(99) 9999[9]-9999');

		CRM.clientSearchByEmail(self.getEmailClient())
			.done(self.fillPhones)
			.always(function() {
				$modalMorePhones.modal({ backdrop: 'static' });
			});

		$formPhones.submit(this.submit);

		this.handleAddPhone();
	};

	this.handleAddPhone = function() {
		$('.add-phone').click(function() {
			$(this).toggleClass('is--active');
		});
	};

	this.getEmailClient = function() {
		if (store && store.userData && store.userData.email) {
			self.clientEmail = store.userData.email;
		}
		else if (!self.clientEmail) {
			self.clientEmail = $('strong.cconf-client-email').text().replace(/\s+/g, '');
		}

		return self.clientEmail;
	};

	this.fillPhones = function(data) {
		if (data) {
			if (data.phone) {
				$inputsPhones.filter('[name="phone"]').val(data.phone.replace('+55', ''));
			}

			if (data.xAdditionalPhone) {
				$inputsPhones.filter('[name="xAdditionalPhone"]').val(data.xAdditionalPhone.replace('+55', ''));
			}
		}
	};

	this.validateForm = function() {
		$('.alert-danger').removeClass('active');

		$inputsPhones.on('change input', () => $phoneError.removeClass('active'));

		if ($requiredPhone.val() === '' || $requiredPhone.val() === undefined) {
			$phoneError.addClass('active');
			return;
		}

		$phoneError.removeClass('active');
		$submit.addClass('icon-loading');
		$submit.text('');

		return true;
	};

	this.submit = function(e) {
		e.preventDefault();

		if (self.validateForm()) {
			var data = {};

			$.map($inputsPhones, item => {
				data[item.name] = item.value;
			});

			data.email = self.getEmailClient();

			self.saveClientData(data);
		}
	};

	this.saveClientData = function(clientData) {
		CRM.insertClient(clientData)
			.then(function () {
				$formPhones.find('.data, .default-message').hide();
				$formPhones.find('.messages,.success-message').fadeIn();

				setTimeout(function () {
					$modalMorePhones.modal('hide');
				}, 2000);
			})
			.fail(function () {
				$submit.removeClass('icon-loading');
			});
	}
});
