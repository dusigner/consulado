/* global VERSION: true, Nitro: true, $: true */

'use strict';

// Teste AB
setTimeout(function() {
	var $body2 = $('body');
	var urlTesteAb = window.location.search;
	var testeA = 'testeab=a';
	var testeB = 'testeab=b';

	if ( urlTesteAb.indexOf(testeA) >= 0 ) {
		$body2.addClass('hideOptionsA');
	}
	else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
		$body2.addClass('hideOptionsB');
	}
}, 400);


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
	require('custom/testeab-entregaAgendada');
	require('vendors/jquery.inputmask');
	require('vendors/slick');
	require('modules/customLogin');
	require('modules/chaordic');

	var CRM = require('modules/store/crm');
	var highlightVoltage = require('modules/checkout/checkout.highlight-voltage');

	Nitro.setup(['chaordic', 'checkout.gae', 'checkout.recurrence', 'checkout.cotas', 'checkout.pj', 'entrega-agendada', 'checkout.default-message', 'customLogin'], function(chaordic, gae, recurrence, cotas, pj, testeabEntregaAgendada) {

		var self = this,
			$body = $('body');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		var productsId = [];
		$.each(window.vtexjs.checkout.orderForm.items, function(i, val){
			productsId.push(val.id);
		});
		chaordic.init('cart');

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
			// Teste AB
			var urlTesteAb = window.location.search;
			var testeA = 'testeab=a';
			var testeB = 'testeab=b';

			if ( urlTesteAb.indexOf(testeA) >= 0 ) {
				$body.addClass('abMask');
			}
			else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
				$body.addClass('abMask');
			}

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

			if (self.isShipping()) {
				pj.hideChangeAddress();
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

			self.reinput();

			testeabEntregaAgendada.setup(orderForm);

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
			this.modalInfoPj(self.orderForm);
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

		// Reinput
		this.reinput = function () {
			console.info('Reinput');
			var userType = vtexjs.checkout.orderForm.userType;

			self.html = function () {
				var fields_input = '<div class="fieldsReinput"><h2 class="isReinput">Pedido Reinput ? <input type="checkbox" name="isReinput" id="isReinput"></h2><form><li class="previouOrderId"><label>Pedido anterior</label><input type="text" name="previouOrderId" id="previouOrderId" value=""></li><li class="company"><label>Empresa</label><select name="company" id="company"><option value="Selecione">Selecione</option><option value="consul">Consul</option><option value="brastemp">brastemp</option><option value="compracerta">compracerta</option></select></li><li class="reason"><label>Motivo</label><select name="reason" id="reason"><option value="Selecione">Selecione</option><option value="avaraia">Avaria no transporte</option><option value="erro">Produto errado</option></select></li></form></div>';
				if ($('.fieldsReinput').length < 1) {
					$(fields_input).insertAfter('.orderform-template .summary-template-holder');
				}
			};

			self.lockpurchase = function () {
				$('input#isReinput:checked').each(function () {
					$('.previouOrderId').show();
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
					console.log('a4');

					if ($('select#company').val() === 'Selecione') {
						$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
					} else if ($('select#reason').val() === 'Selecione') {
						$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', true);
					} else {
						$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);
						console.log('a5');
					}
				});
			};

			self.searchOrderId = function () {
				$('body').on('keyup', 'input#previouOrderId', function () {
					var pedidodigitado = $('input#previouOrderId').val().length;
					if (pedidodigitado === 16) {
						var pedidodigitadobusca = $('input#previouOrderId').val();
						$.ajax({
							url: '/api/dataentities/PD/search?_where=orderId=' + pedidodigitadobusca + '&_fields=orderId',
							type: 'GET',
						}).then(function (res) {
							if (res.length === 1) {
								$('li.previouOrderId').addClass('load').removeClass('error');
								$('.company').show();
							} else {
								$('li.previouOrderId').removeClass('load').addClass('error');
							}
							return res;
						});

					} else {
						$('.company, .reason').hide();
						$('li.previouOrderId').removeClass('load');
					}
				});
			};

			self.checkboxReinput = function () {
				$('input#isReinput').click(function () {
					$('.fieldsReinput form').submit(function (e) {
						e.preventDefault();
					});
					$('.previouOrderId, .company, .reason').hide().removeClass('load');
					$('#previouOrderId').val('');
					$('li.previouOrderId').removeClass('load');
					$('#payment-data-submit, #payment-data-submit:last-child').attr('disabled', false);
					$('.fieldsReinput form').each(function () {
						this.reset();
					});
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
						console.log('a3');

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
						console.log('a1');
					}
				});
			};

			self.storegeValues = function () {
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
								success: function (response) {
									console.info('response', response);
								},
								error: function (error) {
									console.info('error', error);
								},
								done: function (response) {
									console.info('response', response);
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

			if (userType === 'callCenterOperator' && $('body').hasClass('body-order-form')) {

				self.html();

				self.lockpurchase();

				self.searchOrderId();

				self.checkboxReinput();

				self.storegeValues();

				self.company();

				self.reason();

			}
		};


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