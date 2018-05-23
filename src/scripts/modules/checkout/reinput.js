/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */

'use strict';

require('../../../templates/reinput.html');

Nitro.module('reinput', function() {
	var self = this,
		userType = $('#vtex-callcenter').length;
	
	// Reinput
	self.init = function () {
		if ( userType > 0 && $('body').hasClass('body-order-form') ) {

			self.html();

			self.lockpurchase();
			
			self.searchOrderId();
			
			self.checkboxReinput();
			
			self.storegeValues();

			self.company();

			self.reason();

		}		
	};

	$('.fieldsReinput form').submit(function (e) {
		e.preventDefault();
	});
						
	self.html = function () {
		dust.render('reinput', {}, function(err, out) {
			if (err) {throw new Error('Erro no reinput: ' + err);}
			if ($('.fieldsReinput').length < 1) {
				$(out).insertAfter('.orderform-template .summary-template-holder');
			}
		});
	};

	self.lockpurchase = function () {
		$('input#isReinput:checked').each(function () {
			$('.previouOrderId').show();
			$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);			
			var pedidodigitado = $('input#previouOrderId').val().length;
			if (pedidodigitado < 1){
				$('.fieldsReinput form').each(function () {
					this.reset();
				});
			}
		});
	};
	
	self.searchOrderId = function () {
		$('body').on('keyup', 'input#previouOrderId', function () {
			var pedidodigitado = $('input#previouOrderId').val().length;
			if (pedidodigitado > 0) {
				$('li.previouOrderId').addClass('load').removeClass('error');
				$('.company').show();
			} else {
				$('.company, .reason').hide();
				$('.fieldsReinput li').removeClass('load');				
				self.lockpurchase();
			}
		});
	};

	self.checkboxReinput = function (){
		$('input#isReinput').click(function () {			
			$('.previouOrderId, .company, .reason').hide().removeClass('load');			
			$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);			
			self.lockpurchase();			
		});
	};

	self.company = function () {
		$('select#company').click(function () {
			if ($('select#company').val() !== 'Selecione') {
				$('.reason').show();
				$('.company').addClass('load');
			} else {
				$('.company').removeClass('load');
				$('.reason').hide();
			}
		});
	};

	self.reason = function () {
		$('select#reason').click(function () {
			if ($('select#reason').val() === 'Selecione') {
				$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
				$('.reason').removeClass('load');
			} else {
				$('.reason').addClass('load');
				$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);						
			}
		});				
	};

	self.storegeValues = function (){
		$('#payment-data-submit, #payment-data-submit:last-child').on('click', function () {
			$('input#isReinput:checked').each(function () {

				var emailtelevendas = $('#vtex-callcenter__user-email').text(),
					orderformId = vtexjs.checkout.orderForm.orderFormId,
					emailuser = store.userData.email,
					companySelected = $('select#company').val(),
					pedidoreinputado = $('input#previouOrderId').val(),
					reasonSelected = $('select#reason').val();

				localStorage.setItem('orderformId', orderformId);
				localStorage.setItem('istelevendas', emailtelevendas);
				localStorage.setItem('isuser', emailuser);
				localStorage.setItem('company', companySelected);
				localStorage.setItem('orderR', pedidoreinputado);
				localStorage.setItem('reason', reasonSelected);


				self.sendOrderCustomData = function (customField, customValue) {
					$.ajax({
						type: 'PUT',
						url: '/api/checkout/pub/orderForm/' + orderformId + '/customData/reinputorder/' + customField,
						data: JSON.stringify({ 'expectedOrderFormSections': ['customData'], 'value': customValue }),
						dataType: 'JSON',
						'headers': { 'content-type': 'application/json', 'accept': 'application/json' },
						error: function (error) {
							console.info('error', error);
						}
					});
				};

				self.sendOrderCustomData('isReinput', 'sim');
				self.sendOrderCustomData('company', companySelected);
				self.sendOrderCustomData('previousOrderId', pedidoreinputado);
				self.sendOrderCustomData('reason', reasonSelected);
				
			});
		});
	};

});