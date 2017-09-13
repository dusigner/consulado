/* global VERSION: true, Nitro: true, $: true */

'use strict';

$(window).on('load', function() {

	require('modules/helpers');

	if (VERSION) {

		console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

		window._trackJs = window._trackJs || {};

		window._trackJs.version = VERSION;
	}

	//load Nitro Lib
	require('vendors/nitro');

	require('expose?store!modules/store/store');

	require('modules/checkout/checkout.gae');
	require('modules/checkout/checkout.recurrence');
	require('modules/checkout/checkout.modify');
	require('modules/checkout/checkout.cotas');
	require('modules/checkout/checkout.pj');
	require('modules/checkout/checkout.default-message');

	var CRM = require('modules/store/crm');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');

	Nitro.setup(['checkout.gae', 'checkout.recurrence', 'checkout.cotas', 'checkout.pj', 'checkout.default-message'], function(gae, recurrence, cotas, pj) {

		var self = this,
			$body = $('body');

		this.userData = null;

		this.init = function() {
			this.orderFormUpdated(null, window.vtexjs && window.vtexjs.checkout.orderForm);

			if (window.hasher) {
				window.hasher.changed.add(function(current) {
					self.hashChanged();
					return self[current] && self[current].call(self);
				});
			}

			return window.crossroads && window.crossroads.routed.add(function(request) {
				//console.log('crossroads', request, data);
				self.hashChanged();
				return self[request] && self[request].call(self);
			});
		};

		this.isCart = function() {
			return $body.hasClass('body-cart');
		};

		this.isOrderForm = function() {
			return $body.hasClass('body-order-form');
		};

		this.isShipping = function() {
			return $('.shipping-data').hasClass('active');
		};

		//event
		this.orderFormUpdated = function(e, orderForm) {
			console.info('orderFormUpdated');

			self.orderForm = gae.orderForm = recurrence.orderForm = cotas.orderForm = orderForm;

			if (self.isOrderForm()) {
				$('.modal-masked-info-template .masked-info-button').text('Voltar');
				gae.info();
				recurrence.hidePayments();
				highlightVoltage($('.fn.product-name'));

				if(store.isCorp) {
					pj.pendingCompany();
				}

			}

			if (self.isCart()) {
				self.cart();
			}

			if (self.isShipping()) {
				pj.hideChangeAddress();
			}
			// self.rioOlimpiadas();

			// Verifica se está "logado"
			if ( self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.email ) {
				self.cotasInit();

				/**
				 * Se store userData não possui email do usuário e o usuário já for cadastrado na loja, seta o cookie com o usuário do orderForm
				 */
				if( store && store.userData && !store.userData.email && self.orderForm.userProfileId) {
					CRM.clientSearchByEmail(self.orderForm.clientProfileData.email).done(function(userData) {
						store.setUserData(userData, true);
					});
				}

			} else {
				self.userData = null;
			}


		};

		this.cotasInit = function() {

			// Verifica se está "logado"
			if( self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.email && self.orderForm.userProfileId ) {

				// Verifica se ainda não foram recuperados dados do CPF
				if ( !self.userData ) {

					// Pega dados atribui ao módulo e verifica limitação de Eletrodomésticos
					cotas.getData()
						.then(function(data) {
							self.userData = data;
							cotas.limitQuantity(self.userData.xSkuSalesChannel5);
						});
				} else {

					// Verifica limitação de Eletrodomésticos
					cotas.limitQuantity(self.userData.xSkuSalesChannel5);
				}
			} else {

				self.userData = null;
			}
		};

		//hash changed
		this.hashChanged = function () {
			if (self.isOrderForm()) {
				if (store && store.isCorp) {
					pj.changeProfileData();
				}
			}

		};

		//state
		this.cart = function() {
			console.info('cart');

			$('.info-shipping').remove();

			$('.Shipping td:first').prepend('<span class="info-shipping">Frete para</span>');
			$('.Shipping td:first').attr('colspan', '4');
			$('.caret').removeClass('caret').addClass('icon icon-chevron-down');

			if(store && store.isPersonal) {
				gae.setup();
			}

			if (store && store.isCorp) {
				$('#cart-reset-postal-code').css('visibility', 'hidden');
				$('#cart-choose-more-products').attr('href', '/empresas');
			}

			recurrence.setup();

			this.fakeButton();
			highlightVoltage($('.product-name > a'));
		};

		//state
		this.shipping = function() {
			console.info('shipping');

			$('#ship-more-info, #ship-number').attr('maxlength', 10);

			$('#ship-street, #ship-name').attr('maxlength', 35);

			if (store && store.isCorp) {
				pj.hideChangeAddress();
			}


			return ($.listen && $.listen('parsley:field:init', function(e) {

				if (store && store.isCorp) {
					pj.disableInputs(e);
				}
				$('.ship-more-info').find('label span').empty().addClass('custom-label-complemento');
				$('.ship-reference').show().find('label span').empty().addClass('custom-label-referencia');

				if (e.$element.is('#ship-more-info, #ship-number')) {
					e.$element.attr({
						'maxlength': 10,
						'data-parsley-maxlength': 10
					});
				}

				if (e.$element.is('#ship-street, #ship-name')) {
					e.$element.attr({
						'maxlength': 35,
						'data-parsley-maxlength': 35
					});
				}

				if (e.$element.is('#ship-postal-code')) {
					if ($('#ship-street').val().length > 35) {
						$('.ship-filled-data').addClass('hide');
						$('#ship-street').parent().removeClass('hide');
						$('#ship-number').blur();
						$('#ship-street').focus();
					}
				}

			}));
		};

		//state
		this.profile = function() {
			console.info('profile');

			if (self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.document) {
				$('#client-document').attr('disabled', 'disabled');
			}

			if (store && store.isCorp) {
				$('#client-company-name, #client-company-nickname, #client-company-ie, #client-company-document, #state-inscription').attr('disabled', 'disabled');
				$('#not-corporate-client').remove();
			}

			if(window.vtex.accountName !== 'consulqa' && window.vtex.accountName !== 'consulempresa') {
				$('.box-client-info-pj').remove();
			}

			if(store.isCorp) {
				$('#is-corporate-client').click();
			}
		};

		//state
		this.payment = function() {
			console.info('payment');

			// Subir a página com a intenção de exibir as formas de pagamento ainda no primeiro scroll
			$('html, body').animate({
				scrollTop: $('#client-profile-data').offset().top - 10 + 'px'
			}, 800);

			$('.payment-card-number input, .payment-card-cvv input').addClass('inspectletIgnore');

			recurrence.hidePayments();

		};

		this.clickFakeButton = function(e) {
			e.preventDefault();

			/**
			* Caso tenha a clase disable, retorna a função para não executar nada no clique
			*/
			if ($(this).prop('disabled') || $(this).is('.disabled')) {
				return;
			}

			if (gae.hasAnyActiveWarranty()) {
				$('#modal-services').modal('show');
			} else {
				if ($('body').hasClass('teste-ab__login-email')) {
					if ((self.orderForm.clientProfileData && self.orderForm.clientProfileData.email)) { //se ja esta logado, vai para o 'finalizar compra'
						window.location.href = '#/orderform';
					} else { //se nao esta logado, abre modal pra colocar o email
						var formLogin = $('.orderform-template .pre-email .client-email').html();
						$('#modal-login .modal-body .login-email').html(formLogin);
						$('#modal-login #client-pre-email').attr('placeholder','E-mail');
						$('#modal-login #btn-client-pre-email').text('Entrar');
						$('#modal-login').modal('show');

						$('#modal-login #btn-client-pre-email').click(function(){
							$('#modal-login .close').trigger('click');
							$('.orderform-template #client-pre-email').val($('#modal-login #client-pre-email').val()).change();

							setTimeout(function(){
								$('.orderform-template #btn-client-pre-email').trigger('click');
							},1000);
						});

						$('#modal-login .voltar').click(function(){
							$('#modal-login .close').trigger('click');
						});
					}
				} else {
					window.location.href = '#/orderform';
				}
			}

			return false;
		};

		this.fakeButton = function() {

			var $fakeButton = $('.fake-buttom');

			if ($fakeButton.length === 0) {
				$fakeButton = $('<a href="#" class="fake-buttom btn-success btn btn-large">Fechar pedido</a>').appendTo('.cart-links');

				$fakeButton.on('click', self.clickFakeButton);

				$('.btn-place-order').addClass('hide');
			}
		};

		// this.rioOlimpiadas = function() {
		//     // console.log(self.orderForm);
		//     if (self.orderForm && self.orderForm.shippingData.address) {
		//         var $cep = self.orderForm.shippingData.address.postalCode;
		//         $cep = $.currencyToInt($cep);
		//         if ($cep >= 20000001 && $cep <= 23799999) {
		//             window.vtex.checkout.MessageUtils.showMessage({
		//                 text: 'Importante: Os prazos de entrega para a cidade do Rio de Janeiro podem sofrer atrasos durante as Olimpíadas, uma vez que muitas vias estão interditadas.',
		//                 status: 'info'
		//             });
		//         }
		//     }
		// };

		this.init();

		$(window).on('orderFormUpdated.vtex', this.orderFormUpdated);

	});

});


/*$(window).on('stateUpdated.vtex', function (a, b, c) {
	console.log(a, b, c);
});*/

/*if( window.router ) {
	window.router.state.subscribe(function(newValue, b) {
		console.log('router', newValue, b);
	});
}*/

