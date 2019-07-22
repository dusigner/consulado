/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */

'use strict';

require('expose-loader?store!modules/store/store');
require('Dust/checkout/reinput.html');

Nitro.module('reinput', function() {
	var self = this,
		userType = $('#vtex-callcenter').length;

	this.renderHtml = function() {
		dust.render('reinput', {}, function(err, out) {
			if (err) {
				throw new Error('Product Dust error: ' + err);
			}
			if ($('.fieldsReinput').length < 1) {
				$(out).insertAfter('.orderform-template .summary-template-holder');
			}
		});
	};

	this.lockpurchase = function() {
		$('input#isReinput:checked').each(function() {
			$('.previouOrderId').show();
			if (
				$('select#company').val() === 'Selecione' ||
				$('select#reason').val() === 'Selecione' ||
				$('select#alcada').val() === 'Selecione'
			) {
				setTimeout(function() {
					!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
						$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
				}, 200);
			} else {
				setTimeout(function() {
					!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
						$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);
				}, 200);
			}
		});
	};

	this.searchOrderId = function() {
		$('body').on('keyup', 'input#previouOrderId', function() {
			var pedidodigitado = $('input#previouOrderId').val();

			if (pedidodigitado.length > 7 && pedidodigitado.length < 11) {
				var getApi = {
					url: 'https://whirlpoolqa.hubinbeta.com/api/oms/pvt/findorder/' + pedidodigitado,
					method: 'GET',
					success: function(verify) {
						if (verify) {
							$('.company').show();
							$('li.previouOrderId')
								.addClass('load')
								.removeClass('error');
						}
					}
				};
				$.ajax(getApi);
			} else {
				$('.company, .reason, .alcada, .comment').hide();
				$('li.previouOrderId')
					.removeClass('load')
					.addClass('error');
				$('.company, .reason, .alcada, .comment').removeClass('load');
				!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
			}
		});
	};

	this.checkboxReinput = function() {
		$('input#isReinput').click(function() {
			$('.fieldsReinput form').submit(function(e) {
				e.preventDefault();
			});
			$('.previouOrderId, .company, .reason, .alcada, .comment')
				.hide()
				.removeClass('load');
			$('#previouOrderId').val('');
			$('li.previouOrderId').removeClass('load');
			!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
				$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);
			$('.fieldsReinput form').each(function() {
				this.reset();
			});
			self.lockpurchase();
		});
	};

	this.company = function() {
		$('select#company').click(function() {
			if ($('select#company').val() !== 'Selecione') {
				$('.reason').show();
				$('.company').addClass('load');
			} else {
				$('.company').removeClass('load');
				$('.reason, .alcada, .comment').hide();
				!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
			}
		});
	};

	this.reason = function() {
		$('select#reason').click(function() {
			if ($('select#reason').val() === 'Selecione') {
				!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
				$('.reason').removeClass('load');
				$('.alcada').val('Selecione');
				$('.alcada, .comment').hide();
			} else {
				$('.reason').addClass('load');
				$('.alcada').show();
			}
		});
	};

	this.alcada = function() {
		$('select#alcada').click(function() {
			if ($('select#alcada').val() === 'Selecione') {
				!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
				$('.alcada').removeClass('load');
				$('.comment').hide();
			} else {
				$('.alcada').addClass('load');
				$('.comment').show();
				!$('#payment-data-submit, #payment-data-submit:last-child').hasClass('disabled') &&
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);
			}
		});
	};

	this.storegeValues = function() {
		$('#payment-data-submit, #payment-data-submit:last-child').on('click', function() {
			$('input#isReinput:checked').each(function() {
				var emailtelevendas = $('#vtex-callcenter__user-email').text(),
					orderformId = vtexjs.checkout.orderForm.orderFormId,
					emailuser = store.userData.email,
					motivoReinput = $('select#company').val(),
					pedidoreinputado = $('input#previouOrderId').val(),
					motivoBoleto = $('select#reason').val(),
					motivoalcada = $('select#alcada').val(),
					obsreinpunt = $('textarea#obsreinpunt').val();

				localStorage.setItem('orderformId', orderformId);
				localStorage.setItem('istelevendas', emailtelevendas);
				localStorage.setItem('isuser', emailuser);
				localStorage.setItem('company', motivoReinput);
				localStorage.setItem('orderR', pedidoreinputado);
				localStorage.setItem('reason', motivoBoleto);
				localStorage.setItem('alcada', motivoalcada);
				localStorage.setItem('obsUser', obsreinpunt);
			});
		});
	};

	this.comment = function() {
		$('body').on('keyup', 'textarea#obsreinpunt', function() {
			var obsdigitado = $('textarea#obsreinpunt').val().length;
			if (obsdigitado > 0) {
				$('li.comment')
					.addClass('load')
					.removeClass('error');
			} else {
				$('li.comment').removeClass('load');
			}
		});
	};

	this.setup = function() {
		if (userType > 0) {
			self.renderHtml();
			self.searchOrderId();
			self.checkboxReinput();
			self.storegeValues();
			self.company();
			self.reason();
			self.alcada();
			self.comment();
			self.lockpurchase();
		}
	};
});
