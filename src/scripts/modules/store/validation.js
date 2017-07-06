'use strict';

var CRM = require('modules/store/crm');

require('bootstrap/tooltip');

function Validation() {

	//this.$errorBox = $('<span class="error text-center" data-placement="bottom" data-html="true" />');

}

Validation.prototype.setError = function(el, type, deferred) {
	type = type || 'error';

	if( type === 'checkbox' ) {
		el.addClass('error').parents('.checkbox').data({
			title: el.data('msg-' + type),
			html: true,
			placement: 'bottom',
			trigger: 'manual'
		}).tooltip('show');
	} else {
		el.addClass('error').data({
			title: el.data('msg-' + type),
			html: true,
			placement: 'bottom',
			trigger: 'manual'
		}).tooltip('show');
	}


	deferred.reject(el, type);
};

Validation.prototype.validate = function(inputs, submit) {
	var _self = this,
		deferred = $.Deferred(),
		pending = false;

	inputs.tooltip('destroy').closest('form').find('span.error').remove();

	inputs.add($(inputs).parents('.checkbox'))
		.removeClass('error')
		.one('focus change', function() {
			$(this).removeClass('error').tooltip('destroy').next('span.error').remove();
		});
	inputs.each(function() {
		var self = $(this),
			validation = self.data('validation');

		if (/required/.test(validation) && self.is(':blank')) {
			_self.setError(self, 'required', deferred);
		} else if (self.val().length < self.data('minlength')) {
			_self.setError(self, 'minlength', deferred);
		} else if (/email/.test(validation) && !self.validEmail()) {
			_self.setError(self, 'email', deferred);
		} else if (/cpf/.test(validation) && !self.validCpf()) {
			_self.setError(self, 'cpf', deferred);
		} else if (/cnpj/.test(validation) && !self.validCnpj()) {
			_self.setError(self, 'cnpj', deferred);
		} else if (/confirm/.test(validation) && self.val() !== inputs.filter('input[name="' + self.data('confirm') + '"]').val()) {
			_self.setError(self, 'confirm', deferred);
		} else if (/checkbox/.test(validation) && !self.is(':checked')) {
			_self.setError(self, 'checkbox', deferred);
		} else if (/partner/.test(validation) && deferred.state() !== 'rejected') {
			pending = true;

			CRM.partnerSearch(self.val())
				.done(deferred.resolve)
				.fail(_self.setError.bind(_self, self, 'partner', deferred));
		}
	});

	if (deferred.state() !== 'rejected') {
		submit.addClass('loading');

		if (!pending) {
			deferred.resolve('valid');
		}
	}

	deferred.fail(function() {
		submit.removeClass('loading');
	});

	deferred.done(function() {
		submit.removeClass('loading');
	});

	return deferred.promise();
};

module.exports = exports = new Validation();
