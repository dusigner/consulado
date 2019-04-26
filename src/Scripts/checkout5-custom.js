/* global VERSION: true, Nitro: true, $: true */

'use strict';

// // Teste AB
// setTimeout(function() {
// 	var $body2 = $('body');
// 	var urlTesteAb = window.location.search;
// 	var testeA = 'testeab=a';
// 	var testeB = 'testeab=b';

// 	if ( urlTesteAb.indexOf(testeA) >= 0 ) {
// 		$body2.addClass('hideOptionsA');
// 	}
// 	else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
// 		$body2.addClass('hideOptionsB');
// 	}
// }, 400);

$(document).on('ready', function() {
	require('modules/helpers');

	if (VERSION) {

		console.info('%c %c %c Jussi | %s Build Version: %s %c %c ', 'background:#dfdab0;padding:2px 0;', 'background:#666; padding:2px 0;', 'background:#222; color:#bada55;padding:2px 0;', (window.jsnomeLoja || '').replace(/\d/, '').capitalize(), VERSION, 'background:#666;padding:2px 0;', 'background:#dfdab0;padding:2px 0;');

		window._trackJs = window._trackJs || {};

		window._trackJs.version = VERSION;
	}

	//load Nitro Lib
	require('vendors/jquery.cookie');
	require('vendors/nitro');
	require('vendors/vtex-modal');

	require('expose-loader?store!modules/store/store');

	require('modules/checkout/checkout.gae');
	require('modules/checkout/checkout.recurrence');
	require('modules/checkout/checkout.modify');
	require('modules/checkout/checkout.cotas');
	require('modules/checkout/checkout.pj');
	require('modules/checkout/checkout.default-message');
	//require('custom/testeab-entregaAgendada');
	require('vendors/jquery.inputmask');
	require('vendors/slick');
	require('modules/customLogin');
	require('modules/store/callcenter');
	// require('modules/chaordic');
	require('modules/checkout/reinput');

	var CRM = require('modules/store/crm');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');
	Nitro.setup([/*'chaordic'*/ 'checkout.gae', 'checkout.recurrence', 'checkout.cotas', 'checkout.pj', 'reinput', 'checkout.default-message', 'customLogin', 'callcenter'], function(/*chaordic*/ gae, recurrence, cotas, pj, reinput) {
		var self = this,
			$body = $('body'),
			flagCoupon;

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		// var productsId = [];
		// if (window.vtexjs.checkout.orderForm && window.vtexjs.checkout.orderForm.items){
		// 	$.each(window.vtexjs.checkout.orderForm.items, function(i, val){
		// 		productsId.push(val.id);
		// 	});
		// 	chaordic.init('cart');
		// }

		// Teste AB
		// var urlTesteAb = window.location.search;
		// var testeA = 'testeab=a';
		// var testeB = 'testeab=b';

		// if ( urlTesteAb.indexOf(testeA) >= 0 ) {
		// 	$body.addClass('ab-test__mobile--show-a');
		// }
		// else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
		// 	$body.addClass('ab-test__mobile--show-b');
		// }

		this.userData = null;

		this.init = function() {
			self.hashChanged();
			self.delivery();
			self.shippingSelector();
			self.shippingSelectorInformation();

			this.orderFormUpdated(null, window.vtexjs && window.vtexjs.checkout.orderForm);

			if (window.hasher) {
				window.hasher.changed.add(function(current) {
					self.hashChanged();
					return self[current] && self[current].call(self);
				});
			}

			return window.crossroads && window.crossroads.routed.add(function(request) {
				self.hashChanged();
				return self[request] && self[request].call(self);
			});
		};

		this.shippingSelector = function() {
			const $btnShippingSelector = $('.shipping-sla-selector .btn-mini');
			const $shippingOptions = $('.shipping-sla-options');

			$btnShippingSelector.removeAttr('data-toggle');

			$btnShippingSelector.click(() => {
				$shippingOptions.slideToggle();
			});
		};

		this.shippingSelectorInformation = function() {
			const $shippingToggle = $('.shipping-sla-button');
			const $shippingItems = $('.shipping-sla-options li a span');
			const $shippingEstimate = $shippingToggle.find('.shipping-estimate');
			const monetary = $('.full-cart .Shipping .monetary').text();

			$shippingItems.each( (index, element) => {
				let shippingItemText = $(element).text().split('-');
				let newText = `<strong>${shippingItemText[0]}</strong>`;

				$(shippingItemText).each((i, e) => {
					if(i !== 0) {
						newText = `${newText} - ${e}`;
					}
				});

				$(element).html(newText);

				if (index + 1 === $shippingItems.length) $shippingToggle.addClass('has-interaction');
			});

			$shippingEstimate.html(`${$shippingEstimate.html()} <span> - ${monetary}</span>`);
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

		this.checkCouponGTM = function (check) {
			let couponValue;

			check ? couponValue = check : couponValue = 'Erro';

			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Cart',
				action: 'Adicionar cupom ',
				label: couponValue
			});
		};

		// Valida cupom no carrinho caso desconto não seja aplicado
		this.atualizaCoupon = function () {
			let $msgCoupon = $('.msg-coupon'),
				$contentMsg = $('.summary-template-holder .row-fluid.summary'),
				$renderMessage = '<span class="msg-coupon" style="display: none;">Cupom inválido, expirado ou já aplicado.</span>';

			$msgCoupon.length === 0 ? $contentMsg.append($renderMessage) : '';

			$(document).on('click', '#cart-coupon-add', function () {

				$('body').ajaxComplete(function(e, xhr, settings) {
					if (/\/api\/checkout\/pub\/orderForm\/.+\/coupons/.test(settings.url)) {
						if (window.vtexjs.checkout.orderForm.ratesAndBenefitsData.rateAndBenefitsIdentifiers.length === 0) {
							$('.msg-coupon').show();
							$('.coupon-fields .info, .coupon-fields .loading-inline.loading-coupon').hide();
							$('.coupon-fields span:first-child').show();
							if (flagCoupon) {
								self.checkCouponGTM(false);
								flagCoupon = false;
							}
						} else {
							if (flagCoupon) {
								self.checkCouponGTM($('#cart-coupon').val());
								flagCoupon = false;
							}
						}

						$('body').unbind('ajaxComplete');
						$('body').off('ajaxComplete');
					}
				});
			});

			setTimeout(() => {
				$msgCoupon.fadeOut();
			}, 4000);

		};

		//event
		this.orderFormUpdated = function(e, orderForm) {
			console.info('orderFormUpdated');

			// Teste AB
			// var urlTesteAb = window.location.search;
			// var testeA = 'testeab=a';
			// var testeB = 'testeab=b';

			// if ( urlTesteAb.indexOf(testeA) >= 0 ) {
			// 	$body.addClass('abMask');
			// }
			// else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
			// 	$body.addClass('abMask');
			// }

			if($(window).width() < 767) {
				$('.client-profile-data').parent(0).addClass('email-confirm');
				$('#btn-client-pre-email').on('click', function() {
					$('.client-profile-data').parent(0).removeClass('email-confirm');
				});
				if($('body').hasClass('abMask')) { //inserir essa classe para *(teste AB)*
					//insere a mascara de inpu somente em mobile no metodo de pagamento campos de cpf e phone
					$('input#client-document').inputmask('999.999.999-99');
					$('input#client-phone').inputmask('(99) 9999[9]-9999');
					$('input#summary-postal-code').inputmask('99999-999');
					$('input#creditCardpayment-card-0Number').inputmask('9999-9999-9999-9999');
				}
			}
			//desabilita o click no btn editar no box de pagamento - pemitindo email não seja apagado no box profile
			$('#payment-data .link-box-edit').click(function(e){
				e.preventDefault();
				return false;
			});
			self.orderForm = gae.orderForm = recurrence.orderForm = cotas.orderForm = orderForm;

			if (self.isOrderForm()) {
				$('.modal-masked-info-template .masked-info-button').text('Voltar');
				gae.info();
				recurrence.hidePayments();
				highlightVoltage($('.fn.product-name'));

			}

			if(store.isCorp) {
				pj.pendingCompany();
			}

			if (self.isCart()) {
				self.cart();
			}

			// Verifica se está "logado"
			if ( self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.email ) {
				if($(window).width() < 767) {
					$('.client-profile-data').parent(0).removeClass('email-confirm');
				}
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


			// Verificar se o box de Brinde existe e aplica as class
			setTimeout(function(){
				if ( $('.available-gift').length <= 0 ) {
					$('.summary-template-holder').removeClass('brinde-ativo');
					$('.cart-select-gift-placeholder').removeClass('show');
					// console.log('Remove Class Ativo');
				}else {
					$('.summary-template-holder').addClass('brinde-ativo');
					$('.cart-select-gift-placeholder').addClass('show');
					$('.cart-links-bottom').css('clear','both');
					// console.log('Adicina Class Ativo');
				}
			}, 1);

			if($('body').hasClass('body-cart')){
				self.smartbeer();
			}

			reinput.setup();
			self.delivery();

			//testeabEntregaAgendada.setup(orderForm);
			self.atualizaCoupon();
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
				if (store && store.isCorp === true) {
					pj.changeProfileData();
				}
			}

		};

		//state
		this.cart = function() {
			console.info('cart');
			this.fakeButton();

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

			this.modalInfoPj(self.orderForm);
			highlightVoltage($('.product-name > a'));

			$('.link-coupon-add').on('click', function() {
				flagCoupon = true;
			});
		};

		//state
		this.shipping = function() {
			console.info('shipping');

			$('#ship-more-info, #ship-number').attr('maxlength', 10);

			$('#ship-street, #ship-name').attr('maxlength', 35);

			return ($.listen && $.listen('parsley:field:init', function(e) {

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
				//$('#client-document').attr('disabled', 'disabled');
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

			$('#client-last-name, #client-first-name').bind('keypress', function(e) {
				if (!e.key.match(/[A-Za-záàâãéèêíïóôõöúùüçñÁÀÂÃÉÈÍÏÓÔÕÖÚÙÜÇÑ' ]/)) {
					return false;
				}
			});
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

			self.TrackMercadoPago();
		};

		this.TrackMercadoPago = function() {
			var $pagamentoMercadoPago = $('#payment-group-MercadoPagoPaymentGroup');
			$pagamentoMercadoPago.click(function() {
				dataLayer.push({
					event: 'generic',
					category: 'Botão de Compra',
					action: 'Opção de Compra com 2 cartões ',
					label: 'Pagar com 2 cartões '
				});
			});
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

				var attachmentName = 'Aceite do Termo',
					content = { 'Aceito': 'Aceito' };

				self.orderForm.items.forEach(function(elem, elemIndex) {

					elem.bundleItems.filter(function(bundle) {
						return bundle.attachmentOfferings.length > 0;
					}).forEach(function(bundle) {
						return vtexjs.checkout.addBundleItemAttachment(elemIndex, bundle.id, attachmentName, content);
					});
				});

				window.location.href = '#/orderform';

				// $('#modal-services').modal('show');
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

			// $body.addClass('ab-test__mobile--show-b');

			var $fakeButton = $('.fake-buttom'),
				$fieldBuyButton = $('.cart-template.full-cart');

			// adiciona fake button no Desktop
			if ($fakeButton.length === 0) {
				$fakeButton = $('<a href="#" class="fake-buttom btn-success btn btn-large">Continuar</a>').appendTo('.cart-links');

				$fakeButton.on('click', self.clickFakeButton);

				$('.btn-place-order').addClass('hide');
				$('.link-choose-more-products-wrapper #cart-choose-more-products').css('display', 'inline-block');
			}

			// monta a barra fixa no mobile dentro do carrinho
			if ($fakeButton.length !== 0 && $(window).width() <= 768 && $('.field-button').length === 0) {
				var $fakeButtonClone = $fakeButton.clone(true);
				$fieldBuyButton.append('<div class="field-button"></div>');

				if ($('.field-button .fake-buttom').length === 0) {
					$fakeButtonClone.appendTo('.field-button');
					$('.accordion-group .table tfoot').clone().appendTo('.field-button');

					$fakeButtonClone.on('click', self.clickFakeButton);
				}
			} else {
				$('.field-button .monetary').text($('.accordion-group .table tfoot .monetary').first().text());
			}

			// oculta a barra fixa quando o carrinho estiver vazio
			if ($('.new-product-price').length === 0) {
				$('.field-button').hide();
			}

		};

		this.modalInfoPj = function (orderForm) {
			orderForm && orderForm.messages.map(function(message) {
				if(/máximo \d+ itens/gmi.test(message.text)) {
					$('#modal-info-pj').modal();
				}
			});
		};

		// lock smartbeer cart
		this.smartbeer = function (){
			console.info('update-smartbeer');
			var productItems = [],
				checkoutItems = vtexjs.checkout.orderForm.items,
				checkoutItemsLength = checkoutItems.length,
				btn_smartbeer = $('.btn_smartbeer'),
				arrDeCervejeiras = ['2003600', '2003599', '2003598'];

			for (var i = 0; i < checkoutItemsLength; i++) {
				productItems.push(checkoutItems[i].productId);
			}

			var hasCervejeira = productItems.some(function (item) {
				return arrDeCervejeiras.indexOf(item) >= 0;
			});

			var hasOnlyCervejeira = productItems.every(function (item) {
				return arrDeCervejeiras.indexOf(item) >= 0;
			});

			this.locksmartbeer = function () {
				$('.fake-buttom').addClass('hide');
				$('.product-item').removeClass('unavailable lookatme');
				$('.item-unavailable').css('display', 'none');
				$('.cart-items').css('position', 'relative');
				$('span[data-i18n="global.unavailable"]').addClass('shipping-estimate-date').html('a calcular');

				if (btn_smartbeer.length <= 0) {
					$('<a class="btn-success btn_smartbeer btn btn-large">Continuar</a>').appendTo('.cart-links');

					if ($(window).width() <= 768) {
						$('<a class="btn-success btn_smartbeer btn btn-large mobile">Continuar</a>').appendTo('.field-button');
					}
				}

				$('.btn_smartbeer').on('click', function () {
					$('#modal-smartbeer').vtexModal();
				});

				$.each($('.product-item'), function () {
					var data_sku = $(this).attr('data-sku'),
						aviso_smart = '<tr><td class="aviso-smartbeer" colspan="7">A pré venda desse produto é <strong>exclusiva</strong> e sua compra deverá ser realizada <strong>separadamente</strong> de outros produtos.</td></tr>';
					if (data_sku === '2004517' || data_sku === '2004518' || data_sku === '2004519' || data_sku === '2004520' || data_sku === '2004521' || data_sku === '2004522') {
						$(this).addClass('smartbeer');
						$(aviso_smart).insertAfter(this);
					}
				});
			};

			this.unlockSmarbeer = function () {
				$('.fake-buttom').removeClass('hide');
				$('.btn_smartbeer').addClass('hide');
				$('.aviso-smartbeer').addClass('hide');
			};

			if (hasCervejeira && !hasOnlyCervejeira) {
				this.locksmartbeer();
			}
			else {
				this.unlockSmarbeer();
			}


		};

		this.delivery = function () {
			var messageDelivery = '<div class="vtex-front-messages-template vtex-front-messages-template-opened corpo-messages-detail-delivery"> '+
									'<span class="vtex-front-messages-detail messages-detail-delivery">Preencha a data da entrega agendada</span>'+
								'</div>',
				self = this;

			self.veryfication = function(){
				setTimeout(function(){
					if($('.scheduled-sla.shipping-option-0').length >= 1 && $('.delivery-windows').length < 1) {
						$('.vtex-front-messages-placeholder').addClass('vtex-front-messages-placeholder-opened delivery');
						$('.scheduled-sla.shipping-option-0').addClass('active');
						if($('.messages-detail-delivery').length < 1){
							$(messageDelivery).insertAfter('button.vtex-front-messages-close-all.close');
						}

						$('.picker__day').on('click', function(){
							$('.vtex-front-messages-placeholder').removeClass('vtex-front-messages-placeholder-opened delivery');
							$('.scheduled-sla.shipping-option-0').removeClass('active');
						});
					}
				},100);

			};

			$('body').on('click', '.shipping-option-item[for*=EntregaAgendada]', function(){
				$('.btn-go-to-payment').trigger('click');
			});

			if($('.scheduled-sla.shipping-option-0').length >= 1 && $('.delivery-windows').length < 1) {
				$('.btn-go-to-payment').trigger('click');
			}

			$('.btn-go-to-payment').click( function(){
				self.veryfication();
			});
		};

		this.init();

		$(window).on('orderFormUpdated.vtex', this.orderFormUpdated);
		$(window).on('orderFormUpdated.vtex', this.shippingSelectorInformation);
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
