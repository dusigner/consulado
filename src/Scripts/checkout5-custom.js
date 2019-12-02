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
		console.info(
			'%c %c %c Jussi | %s Build Version: %s %c %c ',
			'background:#dfdab0;padding:2px 0;',
			'background:#666; padding:2px 0;',
			'background:#222; color:#bada55;padding:2px 0;',
			(window.jsnomeLoja || '').replace(/\d/, '').capitalize(),
			VERSION,
			'background:#666;padding:2px 0;',
			'background:#dfdab0;padding:2px 0;'
		);

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
	// require('components/testeab-entrega');
	require('vendors/jquery.inputmask');
	require('vendors/slick');
	require('modules/customLogin');
	require('modules/store/callcenter');
	// require('modules/chaordic');
	require('modules/counting-working-days');
	require('modules/checkout/reinput');

	var CRM = require('modules/store/crm');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');
	Nitro.setup(
		[
			/*'chaordic'*/
			'workingdays-counter',
			'checkout.gae',
			'checkout.recurrence',
			'checkout.cotas',
			'checkout.pj',
			'reinput',
			/* 'testeab-entrega', */
			'checkout.default-message',
			'customLogin',
			'callcenter',
		],
		function(
			/*chaordic*/
			workingDays,
			gae,
			recurrence,
			cotas,
			pj,
			reinput,
			/*testeabEntrega*/
		) {
			var self = this,
				$body = $('body'),
				flagCoupon,
				modals = true;

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
				self.limitQuantityCart();

				this.orderFormUpdated(null, window.vtexjs && window.vtexjs.checkout.orderForm);

				if (window.hasher) {
					window.hasher.changed.add(function(current) {
						self.hashChanged();
						return self[current] && self[current].call(self);
					});
				}

				return (
					window.crossroads &&
					window.crossroads.routed.add(function(request) {
						self.hashChanged();
						return self[request] && self[request].call(self);
					})
				);
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

				$shippingItems.each((index, element) => {
					let shippingItemText = $(element)
						.text()
						.split('-');
					let newText = `<strong>${shippingItemText[0]}</strong>`;

					$(shippingItemText).each((i, e) => {
						if (i !== 0) {
							newText = `${newText} - ${e.replace(/Grátis|R\$ 0,00/gim, 'Frete Grátis')}`;
						}
					});

					$(element).html(newText);

					// Verifica se o frete é grátis
					self.hasFreeShipping(element);

					if (index + 1 === $shippingItems.length) $shippingToggle.addClass('has-interaction');
				});

				$shippingEstimate.html(`${$shippingEstimate.html()} <span> - ${monetary}</span>`);
			};

			// Verifica se o frete do produto é grátis
			this.hasFreeShipping = elementShipping => {
				const hasFreeSheeping =
					$(elementShipping)
						.text()
						.indexOf('Grátis') >= 0 ||
					$(elementShipping)
						.text()
						.indexOf('R$ 0,00') >= 0;

				if (hasFreeSheeping) {
					$(elementShipping)
						.parents('li')
						.addClass('frete-gratis');
				}
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

			this.checkCouponGTM = function(check) {
				let couponValue;

				check ? (couponValue = check) : (couponValue = 'Erro');

				dataLayer.push({
					event: 'generic-event-trigger',
					category: 'Cart',
					action: 'Adicionar cupom ',
					label: couponValue
				});
			};

			// Valida cupom no carrinho caso desconto não seja aplicado
			this.atualizaCoupon = function() {
				let $msgCoupon = $('.msg-coupon'),
					$contentMsg = $('.summary-template-holder .row-fluid.summary'),
					$renderMessage =
						'<span class="msg-coupon" style="display: none;">Cupom inválido, expirado ou já aplicado.</span>';

				$msgCoupon.length === 0 ? $contentMsg.append($renderMessage) : '';

				$(document).on('click', '#cart-coupon-add', function() {
					$('body').ajaxComplete(function(e, xhr, settings) {
						if (/\/api\/checkout\/pub\/orderForm\/.+\/coupons/.test(settings.url)) {
							if (
								window.vtexjs.checkout.orderForm.ratesAndBenefitsData.rateAndBenefitsIdentifiers
									.length === 0
							) {
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
				$('input#client-phone').inputmask('(99) [9]999-99999', {placeholder: ' ', showMaskOnFocus: false, keepStatic: true, clearMaskOnLostFocus: true});
				$('input#client-document').inputmask('999.999.999-99');
				$('input#summary-postal-code').inputmask('99999-999');
				$('input#creditCardpayment-card-0Number').inputmask('9999-9999-9999-9999');
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

				if ($(window).width() < 767) {
					$('.client-profile-data')
						.parent(0)
						.addClass('email-confirm');
					$('#btn-client-pre-email').on('click', function() {
						$('.client-profile-data')
							.parent(0)
							.removeClass('email-confirm');
					});
				}
				//desabilita o click no btn editar no box de pagamento - pemitindo email não seja apagado no box profile
				$('#payment-data .link-box-edit').click(function(e) {
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

				if (store.isCorp) {
					pj.pendingCompany();
				}

				if (self.isCart()) {
					self.cart();
				}

				// Verifica se está "logado"
				if (self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.email) {
					if ($(window).width() < 767) {
						$('.client-profile-data')
							.parent(0)
							.removeClass('email-confirm');
					}
					self.cotasInit();

					/**
					 * Se store userData não possui email do usuário e o usuário já for cadastrado na loja, seta o cookie com o usuário do orderForm
					 */
					if (store && store.userData && !store.userData.email && self.orderForm.userProfileId) {
						CRM.clientSearchByEmail(self.orderForm.clientProfileData.email).done(function(userData) {
							store.setUserData(userData, true);
						});
					}
				} else {
					self.userData = null;
				}

				// Verificar se o box de Brinde existe e aplica as class
				setTimeout(function() {
					if ($('.available-gift').length <= 0) {
						$('.summary-template-holder').removeClass('brinde-ativo');
						$('.cart-select-gift-placeholder').removeClass('show');
						// console.log('Remove Class Ativo');
					} else {
						$('.summary-template-holder').addClass('brinde-ativo');
						$('.cart-select-gift-placeholder').addClass('show');
						$('.cart-links-bottom').css('clear', 'both');
						// console.log('Adicina Class Ativo');
					}
				}, 1);


				reinput.setup();
				self.delivery();

				// testeabEntrega.checkoutSetup(orderForm);
				self.atualizaCoupon();
			};

			this.cotasInit = function() {
				// Verifica se está "logado"
				if (
					self.orderForm &&
					self.orderForm.clientProfileData &&
					self.orderForm.clientProfileData.email &&
					self.orderForm.userProfileId
				) {
					// Verifica se ainda não foram recuperados dados do CPF
					if (!self.userData) {
						// Pega dados atribui ao módulo e verifica limitação de Eletrodomésticos
						cotas.getData().then(function(data) {
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
			this.hashChanged = function() {
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
				$('.caret')
					.removeClass('caret')
					.addClass('icon icon-chevron-down');

				if (store && store.isCorp) {
					$('#cart-reset-postal-code').css('visibility', 'hidden');
					$('#cart-choose-more-products').attr('href', '/empresas');
				}

				// Start GAE and RECURRENCE
				if (store && store.isPersonal) {
					gae.setup();
				}
				recurrence.setup();

				// Priorizar a exibição de RECORRÊNCIA quando
				// os produtos forem da categoria purificadores

				// if (self.orderForm && self.orderForm.items && self.orderForm.items.length > 0) {
				// 	const checkoutProducts = self.orderForm.items;
				// 	const categoryName = window.store.isQA ? '2' : '190'; // Categoria de Purificadores
				// 	const categoryRegex = new RegExp(categoryName, 'gmi');

				// 	const someProductsHasRecurrence = checkoutProducts.some(prod => {
				// 		return recurrence.selectHasRecurrence(prod.attachmentOfferings);
				// 	});

				// 	const allProductsIsPurificadores = checkoutProducts.every(prod => {
				// 		return String(prod.productCategoryIds).match(categoryRegex) ? true : false;
				// 	});

				// 	const hasRecurrence = item => {
				// 		return item.attachmentOfferings.length > 0;
				// 	};

				// 	if (modals === true) {
				// 		const skuList = (sessionStorage.getItem('sku-cart')) ? sessionStorage.getItem('sku-cart') : '',
				// 			orderFormItems = self.orderForm.items;

				// 		let skuId = '',
				// 			recurrenceId = '',
				// 			isPurificator = false,
				// 			lastRecurrenceItem = '';

				// 		for (let i = 0; i < orderFormItems.length; i++) {
				// 			hasRecurrence(orderFormItems[i]) ? lastRecurrenceItem = orderFormItems[i].id : '';

				// 			if (!skuList.includes(orderFormItems[i].id)) {
				// 				if (hasRecurrence(orderFormItems[i])) {
				// 					recurrenceId = orderFormItems[i].id;
				// 				} else {
				// 					skuId = orderFormItems[i].id;
				// 					String(orderFormItems[i].productCategoryIds).match(categoryRegex) ? isPurificator = true : isPurificator = false;
				// 				}
				// 			}
				// 		}

				// 		if (isPurificator && lastRecurrenceItem !== '') {
				// 			let skuList = (sessionStorage.getItem('sku-cart')) ? sessionStorage.getItem('sku-cart').split(',') : [];
				// 			skuList.push(skuId);

				// 			recurrence.autoOpen(lastRecurrenceItem);

				// 			sessionStorage.setItem('sku-cart', skuList);
				// 		}
				// 		else if ((allProductsIsPurificadores && someProductsHasRecurrence) || (skuId === '' && recurrenceId !== '')) {
				// 			recurrence.autoOpen(recurrenceId);
				// 		} else if (skuId !== '') {
				// 			if (store && store.isPersonal) {
				// 				gae.autoOpen(skuId);

				// 			}
				// 		}

				// 		modals = false;
				// 	}
				// }

				this.modalInfoPj(self.orderForm);
				highlightVoltage($('.product-name > a'));

				$('.shipping-sla-options li').each(function() {
					var $elementShipping = $(this).find('a');
					workingDays.setShippingMessage($elementShipping);
				});

				$('.link-coupon-add').on('click', function() {
					flagCoupon = true;
				});

				self.dataLayerCoupon();

			};

			//state
			this.shipping = function() {
				console.info('shipping');

				$('#ship-number').attr('maxlength', 10);

				$('#ship-more-info').attr('maxlength', 50);

				$('#ship-street, #ship-name').attr('maxlength', 35);

				setTimeout(function() {
					$('.shipping-option-item-text-wrapper').each(function() {
						workingDays.setShippingMessage($(this));
					});
				}, 1000);

				return (
					$.listen &&
					$.listen('parsley:field:init', function(e) {
						$('.ship-more-info')
							.find('label span')
							.empty()
							.addClass('custom-label-complemento');
						$('.ship-reference')
							.show()
							.find('label span')
							.empty()
							.addClass('custom-label-referencia');

						if (e.$element.is('#ship-number')) {
							e.$element.attr({
								maxlength: 10,
								'data-parsley-maxlength': 10
							});
						}

						if (e.$element.is('#ship-more-info')) {
							e.$element.attr({
								maxlength: 50,
								'data-parsley-maxlength': 50
							});
						}

						if (e.$element.is('#ship-street, #ship-name')) {
							e.$element.attr({
								maxlength: 35,
								'data-parsley-maxlength': 35
							});
						}

						if (e.$element.is('#ship-postal-code')) {
							if ($('#ship-street').val().length > 35) {
								$('.ship-filled-data').addClass('hide');
								$('#ship-street')
									.parent()
									.removeClass('hide');
								$('#ship-number').blur();
								$('#ship-street').focus();
							}
						}
					})
				);
			};

			//state
			this.profile = function() {
				console.info('profile');

				if (self.orderForm && self.orderForm.clientProfileData && self.orderForm.clientProfileData.document) {
					//$('#client-document').attr('disabled', 'disabled');
				}

				if (store && store.isCorp) {
					$(
						'#client-company-name, #client-company-nickname, #client-company-ie, #client-company-document, #state-inscription'
					).attr('disabled', 'disabled');
					$('#not-corporate-client').remove();
				}

				if (window.vtex.accountName !== 'consulqa' && window.vtex.accountName !== 'consulempresa') {
					$('.box-client-info-pj').remove();
				}

				if (store.isCorp) {
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
				$('html, body').animate(
					{
						scrollTop: $('#client-profile-data').offset().top - 10 + 'px'
					},
					800
				);

				$('.payment-card-number input, .payment-card-cvv input').addClass('inspectletIgnore');

				recurrence.hidePayments();

				self.TrackMercadoPago();
			};

			this.TrackMercadoPago = function() {
				var $pagamentoMercadoPago = $('#payment-group-creditCardPaymentGroup');
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
						content = { Aceito: 'Aceito' };

					self.orderForm.items.forEach(function(elem, elemIndex) {
						elem.bundleItems
							.filter(function(bundle) {
								return bundle.attachmentOfferings.length > 0;
							})
							.forEach(function(bundle) {
								return vtexjs.checkout.addBundleItemAttachment(
									elemIndex,
									bundle.id,
									attachmentName,
									content
								);
							});
					});

					window.location.href = '#/orderform';

					// $('#modal-services').modal('show');
				} else {
					if ($('body').hasClass('teste-ab__login-email')) {
						if (self.orderForm.clientProfileData && self.orderForm.clientProfileData.email) {
							//se ja esta logado, vai para o 'finalizar compra'
							window.location.href = '#/orderform';
						} else {
							//se nao esta logado, abre modal pra colocar o email
							var formLogin = $('.orderform-template .pre-email .client-email').html();
							$('#modal-login .modal-body .login-email').html(formLogin);
							$('#modal-login #client-pre-email').attr('placeholder', 'E-mail');
							$('#modal-login #btn-client-pre-email').text('Entrar');
							$('#modal-login').modal('show');

							$('#modal-login #btn-client-pre-email').click(function() {
								$('#modal-login .close').trigger('click');
								$('.orderform-template #client-pre-email')
									.val($('#modal-login #client-pre-email').val())
									.change();

								setTimeout(function() {
									$('.orderform-template #btn-client-pre-email').trigger('click');
								}, 1000);
							});

							$('#modal-login .voltar').click(function() {
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
					$fakeButton = $('<a href="#" class="fake-buttom btn-success btn btn-large">Continuar</a>').appendTo(
						'.cart-links'
					);

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
						$('.accordion-group .table tfoot')
							.clone()
							.appendTo('.field-button');

						$fakeButtonClone.on('click', self.clickFakeButton);
					}
				} else {
					$('.field-button .monetary').text(
						$('.accordion-group .table tfoot .monetary')
							.first()
							.text()
					);
				}

				// oculta a barra fixa quando o carrinho estiver vazio
				if ($('.new-product-price').length === 0) {
					$('.field-button').hide();
				}
			};

			this.modalInfoPj = function(orderForm) {
				orderForm &&
					orderForm.messages.map(function(message) {
						if (/máximo \d+ itens/gim.test(message.text)) {
							$('#modal-info-pj').modal();
						}
					});
			};

			this.delivery = function() {
				var messageDelivery =
						'<div class="vtex-front-messages-template vtex-front-messages-template-opened corpo-messages-detail-delivery"> ' +
						'<span class="vtex-front-messages-detail messages-detail-delivery">Preencha a data da entrega agendada</span>' +
						'</div>',
					self = this;

				self.veryfication = function() {
					setTimeout(function() {
						if ($('.scheduled-sla.shipping-option-0').length >= 1 && $('.delivery-windows').length < 1) {
							$('.vtex-front-messages-placeholder').addClass(
								'vtex-front-messages-placeholder-opened delivery'
							);
							$('.scheduled-sla.shipping-option-0').addClass('active');
							if ($('.messages-detail-delivery').length < 1) {
								$(messageDelivery).insertAfter('button.vtex-front-messages-close-all.close');
							}

							$('.picker__day').on('click', function() {
								$('.vtex-front-messages-placeholder').removeClass(
									'vtex-front-messages-placeholder-opened delivery'
								);
								$('.scheduled-sla.shipping-option-0').removeClass('active');
							});
						}
					}, 100);
				};

				$('body').on('click', '.shipping-option-item[for*=EntregaAgendada]', function() {
					$('.btn-go-to-payment').trigger('click');
				});

				if ($('.scheduled-sla.shipping-option-0').length >= 1 && $('.delivery-windows').length < 1) {
					$('.btn-go-to-payment').trigger('click');
				}

				$('.btn-go-to-payment').click(function() {
					self.veryfication();
				});

				$('.shipping-option-item-text-wrapper').each(function() {
					workingDays.setShippingMessage($(this));
				});

				setTimeout(function() {
					$('.shipping-option-item-text-wrapper').each(function() {
						workingDays.setShippingMessage($(this));
					});
				}, 1000);

				$(document).on('click', '.shipping-option-item.label-vertical-group.input.btn', function() {
					setTimeout(function() {
						$('.shipping-option-item-text-wrapper').each(function() {
							workingDays.setShippingMessage($(this));
						});
					}, 1000);
				});
			};

			this.limitQuantityCart = function(){

				if (!store.isCorp){

					$('body').on('click','.item-quantity-change', function(){
						var prodId = $(this).closest('.product-item').index('.product-item'),
							prodQtde = $(this).closest('.product-item').find('.quantity input').val(),
							prodName = $(this).closest('.product-item').find('.product-name a:nth-child(1)').text(),
							item = vtexjs.checkout.orderForm.items[prodId];

						item.index = prodId;
						item.quantity = 5;


						if (prodQtde > 5) {

							vtexjs.checkout.getOrderForm().then(function() {
								var updateItem = {
									index: prodId,
									quantity: 5
								};
								return vtexjs.checkout.updateItems([updateItem], null, false);
							})
								.done(function() {
									window.vtex.checkout.MessageUtils.showMessage({
										text: 'Você só pode ter no máximo 5 itens do produto '+prodName+' no carrinho',
										status: 'error'
									});
								});
						}
					});
				}
			};

			this.dataLayerCoupon = () => {
				const pushDataLayer = (cat, act, lbl) => {
						dataLayer.push({
							event: 'generic',
							category: cat,
							action: act,
							label: lbl
						})
					},
					addCoupon = $('.link-coupon-add'),
					sendCoupon = $('#cart-coupon-add');

				addCoupon.on('click', function() {
					pushDataLayer('Cupom de Desconto - Carrinho', 'Adicionar Cupom', 'Adicionar cupom de desconto - checkout');
				});

				sendCoupon.on('click', function() {
					pushDataLayer(('Cupom de Desconto - Carrinho - ' + $('#cart-coupon').val()), 'Selecionar Cupom', 'Cupom selecionado no carrinho');
				});
			};

			this.init();

			$(window).on('orderFormUpdated.vtex', this.orderFormUpdated);
			$(window).on('orderFormUpdated.vtex', this.shippingSelectorInformation);
		}
	);
});

(function(window, document) {

  "use strict";

  window.updating_checkout_list = false;
  window.checkout_watcher       = false;
  window.last_step              = document.location.hash;

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setProducts() {
    if(document.querySelector('.chaordic.page-render iframe')) {
      document.querySelector('.chaordic.page-render iframe').contentDocument.addEventListener('mousedown', function(event) {
        var elem = event.target;
        var id;
        var product;

        window.dataLayer = window.dataLayer || [];

        if(elem.matches('.item a:not(.buy), .item a:not(.buy) *')) {
          id = elem.tagName.toLowerCase == 'a' ? elem.getAttribute('href') : elem.parentElement.getAttribute('href');
          id = id.split('idsku')[1].replace('=', '');
          window.dataLayer = window.dataLayer || [];
          for(var i = (window.dataLayer.length - 1), min  = 0 ; min < i ; i-=1) {
            if(window.dataLayer[i].checkout && window.dataLayer[i].page.impressions) {
              var products = window.dataLayer[i].checkout.products;
              for(var j = 0, max_products =  window.dataLayer[i].page.impressions.length ; j < max_products ; j+=1) {
                if(products[j].id_vtex == id) {
                  product = products[j];
                  break;
                }
              }
            }
          }
          window.dataLayer.push({
            'event': 'productClick',
            'product': [product]
          });

        } else if(elem.matches('.item a.buy')) {
          id = elem.getAttribute('id').replace('buy-', '');
          window.dataLayer = window.dataLayer || [];
          for(var i = (window.dataLayer.length - 1), min  = 0 ; min < i ; i-=1) {
            if(window.dataLayer[i].checkout && window.dataLayer[i].page.impressions) {
              var products = window.dataLayer[i].page.impressions;
              for(var j = 0, max_products =  window.dataLayer[i].page.impressions.length ; j < max_products ; j+=1) {
                if(products[j] && products[j].id_vtex == id) {
                  product = products[j];
                  break;
                }
              }
            }
          }
          window.dataLayer.push({
            'event': 'addToCart',
            'product': [product]
          });
        }

      });
    }
  }

  window.pushDataLayer = function(update = false) {
    var orderForm = vtexjs.checkout.orderForm;

    window.dataLayer = window.dataLayer || [];
    var ecommerce_infos, shipping, payment, installments, products = [], category_product_aux = [],
        warrantyType, warrantyPrice;
    for(var i = (window.dataLayer.length - 1), min = 0 ; min < i ; i-=1) {
      if(window.dataLayer[i].ecommerce) {
        ecommerce_infos = window.dataLayer[i].ecommerce;
        break;
      }
    }
    for(var j = 0, max = orderForm.totalizers.length ; j < max ; j+=1) {
      if(orderForm.totalizers[j].id && orderForm.totalizers[j].id == 'Shipping') {
          shipping = (orderForm.totalizers[j].value / 100);
          break;
      }
    }

    var user     = {
      'firstLogin': null,
      'loginStatus': 'Deslogado',
      'userId': ''
    };
    var userinfo;
    for(var d = 0, max_dataLayer = window.dataLayer.length ; d < max_dataLayer ; d+=1) {
      if(window.dataLayer[d].visitorId) {
        user = {
          'firstLogin': '',
          'loginStatus': window.dataLayer[d].visitorLoginState ? 'Logado' : 'Deslogado',
          'userId': window.dataLayer[d].visitorId
        };
      }
    }
    userinfo = (getCookie('userinfo') != '') ? JSON.parse(getCookie('userinfo')) : '';
    if(user.loginStatus == 'Deslogado' && (userinfo && userinfo !== '')) {
      user = {
        'firstLogin': userinfo.firstLogin,
        'loginStatus': userinfo.loginStatus,
        'userId': userinfo.userId
      }
    }

    if(orderForm.shippingData && orderForm.shippingData.logisticsInfo) {
      var selected_shipping      = '';
      var products_shipping_info = [];
      var shipping_price         = '';
      var shipping_name          = '';
      var shipping_estimate      = '';
      var prodId                 = '';
      for(var i = 0, max = orderForm.shippingData.logisticsInfo.length ; i < max ; i+=1) {
        selected_shipping = orderForm.shippingData.logisticsInfo[i].selectedSla;
        shipping_price         = '';
        shipping_name          = '';
        shipping_estimate      = '';
        for(var j = 0, max_slas = orderForm.shippingData.logisticsInfo[i].slas.length ; j < max_slas ; j+=1) {
            if(orderForm.shippingData.logisticsInfo[i].slas[j].id == selected_shipping) {
              shipping_name     = orderForm.shippingData.logisticsInfo[i].slas[j].name;
              shipping_price    = orderForm.shippingData.logisticsInfo[i].slas[j].price;
              shipping_estimate = orderForm.shippingData.logisticsInfo[i].slas[j].shippingEstimate;
            }
        }
        prodId = orderForm.shippingData.logisticsInfo[i].itemId;
        products_shipping_info.push({
          'selected_shipping': selected_shipping,
          'price': shipping_price,
          'name': shipping_name,
          'estimate': shipping_estimate,
          'prodId': prodId
        });
      }
    }
    var product_shipping_info;
    var additionalInfo;
    for(var k = 0, max = orderForm.items.length ; k < max ; k+=1) {
      category_product_aux = [];
      for(var prop in orderForm.items[k].productCategories) {
        category_product_aux.push(orderForm.items[k].productCategories[prop]);
      }
      product_shipping_info = null;
      for(var v = 0, max_products_shipping_info = products_shipping_info.length ; v < max ; v+=1) {
        if(products_shipping_info[v].prodId == orderForm.items[k].id) {
          product_shipping_info = products_shipping_info[v];
          break;
        }
      }
      warrantyType  = null;
      warrantyPrice = null;
      if(orderForm.items[k].bundleItems && orderForm.items[k].bundleItems.length) {
        for(var f = 0, max_bundleItems = orderForm.items[k].bundleItems.length ; f < max_bundleItems ; f+=1) {
          if(orderForm.items[k].bundleItems[f].name.indexOf('Garantia') >= 0) {
              warrantyType  = orderForm.items[k].bundleItems[f].name;
              warrantyPrice = orderForm.items[k].bundleItems[f].price;
              break;
          }
        }
      }
      additionalInfo = JSON.parse(localStorage.getItem('product_' + orderForm.items[k].productId));
      if(additionalInfo) {
        localStorage.setItem('product_' + orderForm.items[k].productId, JSON.stringify({
          'category_sap': additionalInfo.category_sap,
          'color': additionalInfo.color,
          'ref_id': orderForm.items[k].productRefId,
          'fullId': orderForm.items[k].refId,
          'originalPrice': additionalInfo.originalPrice,
          'warrantyType' : warrantyType,
          'warrantyPrice' : parseFloat(warrantyPrice / 100),
          'shippingPrice' : product_shipping_info ? (product_shipping_info.price / 100) : null,
          'shippingType' : product_shipping_info ? product_shipping_info.name : null,
          'shippingTime' : product_shipping_info ? product_shipping_info.estimate.replace(/bd/g, '') : null
        }));
      }
      products.push({
        'id' : orderForm.items[k].productRefId,
        'id_vtex' : orderForm.items[k].productId,
        'secondary_id_vtex' : orderForm.items[k].id,
        'fullId': orderForm.items[k].refId,
        'name' : orderForm.items[k].name,
        'brand' : orderForm.items[k].additionalInfo.brandName,
        'availability' : orderForm.items[k].availability == 'available' ? "Disponível" : "Indisponível",
        'quantity' : orderForm.items[k].quantity,
        'originalPrice' : additionalInfo ? additionalInfo.originalPrice : parseFloat(orderForm.items[k].listPrice / 100),
        'price' : parseFloat(orderForm.items[k].sellingPrice / 100),
        'categorySAP' : additionalInfo ? additionalInfo.category_sap : '',
        'category' : category_product_aux[1],
        'department' : category_product_aux[0],
        'color' : additionalInfo ? additionalInfo.color : '',
        'variant' : orderForm.items[k].skuName,
        'coupon' : "",
        'warrantyType' : warrantyType,
        'warrantyPrice' : parseFloat(warrantyPrice / 100),
        'shippingPrice' : product_shipping_info ? (product_shipping_info.price / 100) : null,
        'shippingType' : product_shipping_info ? product_shipping_info.name : null,
        'shippingTime' : product_shipping_info ? product_shipping_info.estimate.replace(/bd/g, '') : null,
        'comboName':  ''
      });
    }
    var step = '';
    var step_number = document.location.hash;
    switch(step_number) {
      case 1:
      case '#/cart':
        step = 'checkout_step_1_cart';
        step_number = 1;
        break;
      case 2:
      case '#/profile':
        step = 'checkout_step_2_contact';
        step_number = 2;
        break;
      case 3:
      case 4:
      case '#/shipping':
        step = 'checkout_step_3_shipping';
        step_number = 3;
        break;
      case 5:
      case '#/payment':
        step = 'checkout_step_4_payment';
        step_number = 4;
        break;
    }
    if(step == '') {
      return false;
    }
    window.dataLayer.push({
      'event': 'virtualPageview',
      'step': step,
      'page': {
        'type': 'checkout',
        'currencyCode': "BRL",
        'impressions': step == 'checkout_step_1_cart' ? window.productList : ''
      },
      'checkout': {
        'step': step_number,
        'products' : products
      },
      'user': user
    });

    if(! window.checkout_watcher) {
      getCheckoutChanges();
      setProducts();
    } else {
      setTimeout(function() {
        window.updating_checkout_list = false;
      }, 2000);
    }
  }

  function getCheckoutChanges() {
    window.checkout_watcher = true;
    window.onpopstate = function(event) {
      setTimeout(function() {
        if(window.last_step != document.location.hash) {
          window.last_step = document.location.hash;
          window.pushDataLayer();
        }
      }, 500);
    }
  }

  function setCheckoutEvents() {
    document.body.addEventListener('mousedown', function(event) {
      var elem = event.target;

      if(elem.matches('.item-link-remove, .item-link-remove *')) {
        elem = elem.classList.contains('item-link-remove') ? elem : elem.parentElement;
        var elem_id = elem.getAttribute('id');
        if(! (elem_id.indexOf('bundle') >= 0)) {
          var prod_id = elem_id.replace('item-remove-', ''),
              products,
              product;
          window.dataLayer = window.dataLayer || [];
          for(var i = (window.dataLayer.length - 1), min  = 0 ; min < i ; i-=1) {
            if(window.dataLayer[i].checkout && window.dataLayer[i].checkout.products) {
              var products = window.dataLayer[i].checkout.products;
              for(var j = 0, max_products =  window.dataLayer[i].checkout.products.length ; j < max_products ; j+=1) {
                if(products[j].secondary_id_vtex == prod_id) {
                  product = products[j];
                  break;
                }
              }
            }
          }
          window.dataLayer.push({
            'event': 'removeFromCart',
            'product': [product]
          });
        }
      } else if(elem.matches('.item-quantity-change-decrement, .item-quantity-change-decrement *')) {
        elem = elem.classList.contains('item-quantity-change-decrement') ? elem : elem.parentElement;
        var elem_id = elem.getAttribute('id');
        var prod_id = elem_id.replace('item-quantity-change-decrement-', ''),
            products,
            product;
        window.dataLayer = window.dataLayer || [];
        for(var i = (window.dataLayer.length - 1), min  = 0 ; min < i ; i-=1) {
          if(window.dataLayer[i].checkout && window.dataLayer[i].checkout.products) {
            var products = window.dataLayer[i].checkout.products;
            for(var j = 0, max_products =  window.dataLayer[i].checkout.products.length ; j < max_products ; j+=1) {
              if(products[j].secondary_id_vtex == prod_id) {
                product = products[j];
                break;
              }
            }
          }
        }
        window.dataLayer.push({
          'event': 'removeFromCart',
          'product': [product]
        });
      } else if(elem.matches('.item-quantity-change-increment, .item-quantity-change-increment *')) {
        elem = elem.classList.contains('item-quantity-change-increment') ? elem : elem.parentElement;
        var elem_id = elem.getAttribute('id');
        var prod_id = elem_id.replace('item-quantity-change-increment-', ''),
            products,
            product;
        window.dataLayer = window.dataLayer || [];
        for(var i = (window.dataLayer.length - 1), min  = 0 ; min < i ; i-=1) {
          if(window.dataLayer[i].checkout && window.dataLayer[i].checkout.products) {
            var products = window.dataLayer[i].checkout.products;
            for(var j = 0, max_products =  window.dataLayer[i].checkout.products.length ; j < max_products ; j+=1) {
              if(products[j].secondary_id_vtex == prod_id) {
                product = products[j];
                break;
              }
            }
          }
        }
        window.dataLayer.push({
          'event': 'addToCart',
          'product': [product]
        });
      }
    });
  }

  function init() {
    var initdataLayerSettings = setInterval(function() {
      if(typeof vtexjs != 'undefined' && vtexjs.checkout && vtexjs.checkout.orderForm) {
        clearInterval(initdataLayerSettings);
        if(! (document.location.hash.indexOf('cart') >= 0)) {
          window.pushDataLayer();
        }
      }
    }, 500);

    setCheckoutEvents();
  }

  window.onload  = (function() {
    init();
  });

})(window, document);


// GET PCI SCRIPT
(function (document, tag) {
	var scriptTag = document.createElement(tag);
	var firstScriptTag = document.getElementsByTagName(tag)[0];
	scriptTag.src = '/files/pci-frontend.js';
	firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

	$('head').append('<link rel="stylesheet" href="/files/pci-frontend.css" type="text/css" />');
}(document, 'script'));


/*$(window).on('stateUpdated.vtex', function (a, b, c) {
	console.log(a, b, c);
});*/

/*if( window.router ) {
	window.router.state.subscribe(function(newValue, b) {
		console.log('router', newValue, b);
	});
}*/
