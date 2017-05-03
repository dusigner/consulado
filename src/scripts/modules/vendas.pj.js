/* global $: true */

'use strict';
require('vendors/jquery.inputmask');

/*jshint strict: false */
var CRM = require('modules/store/crm');
Nitro.module('vendas.pj', function() {

	var self = this;

	var $formPJ = $('#vtex-modal-pj form'),
		$submit = $formPJ.find('[type="submit"]'),
		$inputs = $formPJ.find('input[type="text"], input[type="email"], input[type="tel"]');

	//	self.anchor = function(){
	$('a.modal-call').click(function(e) {
		e.preventDefault();
		$($(this).attr('href')).vtexModal();

		if ($('body').width() <= 768) {
			$('html, body').animate({
				scrollTop: 0
			}, 'slow');
		}

		$formPJ = $('#vtex-modal-pj form');
		$submit = $formPJ.find('[type="submit"]');
		$inputs = $formPJ.find('input[type="text"], input[type="email"], input[type="tel"]');

		$inputs.filter('[type="tel"]').inputmask('(99) 9999[9]-9999');
		$inputs.filter('.cnpj').inputmask('99.999.999/9999-99');
		$formPJ.submit(self.submit);
	});
	//	};

	self.submit = function(e) {
		e.preventDefault();

		if (self.validateForm()) {
			var data = {};

			$.map($inputs, function(x) {
				if (!x.value || x.value === '') {
					return;
				}
				data[x.name] = x.value;
			});

			CRM.insertClient(data)
				.then(function() {
					$formPJ.hide();
					$('#vtex-modal-pj .success').fadeIn();
				})
				.fail(function() {
					// console.log('deu errado');
					$submit.removeClass('icon-loading');
				});
		}
	};

	self.validateForm = function() {
		var valid = false;

		$formPJ.removeClass('invalid');
		$inputs.removeClass('empty');

		if ($inputs.filter(':blank').length <= 0) {
			valid = true;
		}

		if (valid) {
			$submit.addClass('icon-loading');
		} else {
			$formPJ.addClass('invalid').show();
			$inputs.filter(':blank').addClass('empty');
			$inputs.focus(function() {
				$(this).removeClass('empty');
			});
		}

		return valid;
	};


});
