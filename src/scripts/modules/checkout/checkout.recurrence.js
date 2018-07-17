/* global $: true, Nitro: true, dust: true, dust: true, _: true, vtexjs:true */
'use strict';

require('Dust/checkout.recurrenceSteps.html');
require('Dust/checkout.recurrenceModal.html');

Nitro.module('checkout.recurrence', function() {

	var self = this;

	//WHY?!
	this.setup = function() {
		self.render();
		self.autoOpen();
	};

	//Skus e respectivos periodos de recorrência (do html, tentando facilitar a troca disso e não tive mais ideias)
	this.periods = eval($('.global-recurrence-periods').text());

	/**
	 * Verifica se existe alguma oferta de recorrência no produto
	 * @param {Object} orderform.items[array].attachmentOfferings
	 * @return {Boolean}
	 */
	this.selectHasRecurrence = function(attachmentOfferings) {
		var hasRecurrence = false;

		$.each(attachmentOfferings, function(i, v) {
			if(v.name.indexOf('Recorrência') !== -1) {
				hasRecurrence = true;
				return false;
			}
		});

		return hasRecurrence;
	};

	/**
	 * Verifica se existe alguma recorrência selecionada/ativa no produto
	 * @param {Object} orderform.items[array].attachments
	 * @return {Boolean}
	 */
	this.hasActiveRecurrence = function(attachments) {
		var hasActiveRecurrence = false;

		$.each(attachments, function(i, v) {
			if(v.name.indexOf('Recorrência') !== -1) {
				hasActiveRecurrence = true;
				return false;
			}
		});

		return hasActiveRecurrence;
	};

	/**
	 * Cria modal com CTA de adicionar recorrência
	 * @param templateData {Object} dados para renderização
	 */
	this.recurrenceModal = function(templateData) {
		dust.render('checkout.recurrenceModal', templateData, function(err, out) {
			if (err) {
				throw new Error('RecurrenceModal Dust error: ' + err);
			}

			$('body').append(out);

			$('#modal-recurrence').modal().on('hidden.bs.modal', function() {
				$('#modal-recurrence').remove();
			});

			var $openRecurrenceToggle = $('.js-select-toggle'),
				$addRecurrence = $('.js-recurrence-add'),
				$selectRecurrence = $('.js-select-option');

			//CTA de adicionar sku
			$addRecurrence.click(function(e) {
				e.preventDefault();

				var $self = $(this);

				self.actionsAttachment($self, function(item, content) {
					vtexjs.checkout.addItemAttachment(item, 'Recorrência', content).then(function() {
						$('#modal-recurrence').modal('hide');
					});
				});
			});

			$openRecurrenceToggle.click(function(e) {
				e.preventDefault();

				$(this).toggleClass('modal-recurrence__select-current--active');
				$('.modal-recurrence__select-period').stop().stop().slideToggle('fast');
			});

			$selectRecurrence.click(function(e) {
				e.preventDefault();

				var $self = $(this);

				$addRecurrence.data('period', $self.attr('data-originalPeriod'));
				$openRecurrenceToggle.trigger('click');
				$selectRecurrence.show();
				$openRecurrenceToggle.find('.js-select-current').text($self.text());
				$self.hide();
			});

			//ACCORDION MOBILE
			if($(window).width() <= 768) {
				$('.js-recurrence-accordion').click(function() {
					$(this).toggleClass('modal-recurrence__advantage-title--active');
					$(this).siblings('.modal-recurrence__advantage-body').slideToggle();
				});
			}
		});
	};

	/**
	 * Renderiza na tela o componente de botões (2 passos) de recorrência -> botões abrir modal e cancelar
	 */
	this.render = function() {
		$.each(self.orderForm.items, function(i, v) {
			var $self = $($('.product-item').get(i)), //seleciona table>tr do produto no html
				$attachmentContainer = $self.find('.add-item-attachment-container'), //container que deve renderizar o componente
				$currentContainer = $self.find('.recurrence__link'),
				templateData = {}, //objeto com dados p/ renderizar
				hasActiveRecurrence = self.hasActiveRecurrence(v.attachments);

			if(self.selectHasRecurrence(v.attachmentOfferings)) {
				//previne renderizar o modulo mais de uma vez
				if($currentContainer.length > 0) {
					return false;
				}

				//seleciona objeto de recorrência
				var attachmentRecurrence = $.grep(v.attachmentOfferings, function(v){
						return v.name === 'Recorrência';
					}),
					selfPeriod = self.periods[v.refId];

				if(hasActiveRecurrence) {
					var selectedRecurrence = $.grep(v.attachments, function(v){
						return v.name === 'Recorrência';
					});

					templateData.hasActiveRecurrence = hasActiveRecurrence;
					templateData.selectedRecurrence = selectedRecurrence[0].content.periodo;
				}

				//verifica se recorrência é aberta, ou fixa com um único periodo
				if(Array.isArray(selfPeriod)) {
					templateData.isOpen = true;

					selfPeriod = $.map(selfPeriod, function(v){
						if(attachmentRecurrence[0].schema.periodo.domain.indexOf(v) >= 0) {
							return v;
						}
					});
				} else {
					//se não existe a recorrência dos períodos do módulo no objeto da vtex
					if( attachmentRecurrence[0].schema.periodo.domain.indexOf(selfPeriod) < 0 ) {
						return false;
					}
				}

				templateData.index = i;
				templateData.period = selfPeriod;

				if(!templateData.period) {
					return false;
				}

				if($attachmentContainer.length === 0) {
					$self.find('.product-name').append('<div class="add-item-attachment-container"></div>');
					$attachmentContainer = $self.find('.add-item-attachment-container');
				}

				dust.render('checkout.recurrenceSteps', templateData, function(err, out) {
					if (err) {
						throw new Error('RecurrenceSteps Dust error: ' + err);
					}

					$attachmentContainer.html(out);

					if(hasActiveRecurrence) {
						self.changeStep('three');
					}

					self.events($self, templateData);

					//render mobile tip
					if($(window).width() <= 768) {
						var mobileTip = '<div class="recurrence__tip--mobile">' +
											'<button type="button" data-dismiss="modal" aria-label="Close" class="close i-close js-close-tip"><i class="icon icon-remove item-remove-ico"></i></button>' +
											'<p class="recurrence__tip--title">Compra Recorrente</p>' +
											'<p>A compra recorrente permite que o produto selecionado seja comprado automaticamente no intervalo de tempo selecionado. Dessa forma você não precisa se preocupar em comprar toda vez que estiver próximo ao vencimento.</p>' +
											'<p>Você poderá pausar ou cancelar a qualquer momento em "meus pedidos".</p>' +
											'<p><strong>Atenção: A recorrência só pode ser ativada caso o meio de pagamento seja cartão de crédito. Caso haja reajuste no valor do produto, você será informado por e-mail.</strong></p>' +
										'</div>';
						$attachmentContainer.after(mobileTip);

						$('.js-tip-mobile').click(function(e) {
							e.preventDefault();

							$('.recurrence__tip--mobile').stop().stop().fadeIn();
						});

						$('.js-close-tip').click(function(e) {
							e.preventDefault();

							$('.recurrence__tip--mobile').stop().stop().fadeOut();
						});
					}
				});
			}
		});
	};

	/**
	 * Eventos de cliques/acções dos botões do módulo recorrência
	 * @param elem {Object} seletor jquery da linha do produto em questão
	 */
	this.events = function(elem, templateData) {
		var $self = elem;

		$self.find('.js-recurrence-nav').click(self.changeStep);

		$self.find('.js-recurrence-remove').click(function() {
			self.actionsAttachment($(this), function(item, content) {
				vtexjs.checkout.removeItemAttachment(item, 'Recorrência', content);
			});
		});

		$self.find('.js-modal-open').click(function() {
			self.recurrenceModal(templateData);
		});
	};

	/**
	 * Troca de passo na interface de recorrência, verifica se foi um clique em um botão com parâmetro (ex.: [data-go="one"]), ou se é para um passo fixo.
	 * @param {String: 'one', 'two', 'three'} or {Object}
	 */
	this.changeStep = function(step) {
		var $self = $(this),
			nextStep = (typeof step === 'object' ) ? $self.data('go') : step;

		$('.recurrence__step').addClass('hide');
		$('.recurrence__step--' + nextStep).removeClass('hide');
	};

	/**
	 * Ações de recorrência no orderForm com base nos dados passados do componente
	 * @param elem {Object} seletor jquery do botão clicado
	 * @param callback {Function} função callback que executará a ação final
	 *  *para adicionar recorrência através do método "vtexjs.checkout.addItemAttachment" do orderForm (https://github.com/vtex/vtex.js/tree/master/docs/checkout#additemattachmentitemindex-attachmentname-content-expectedorderformsections-splititem)
	 *  *para remover recorrência através do método "vtexjs.checkout.removeItemAttachment" do orderForm (https://github.com/vtex/vtex.js/tree/master/docs/checkout#removeitemattachmentitemindex-attachmentname-content-expectedorderformsections)
	 */
	this.actionsAttachment = function(elem, callback) {
		var $self = elem,
			item = $self.data('index'),
			currentPeriod = $self.data('period'),
			content = { periodo: currentPeriod };

		if(!currentPeriod) {
			window.vtex.checkout.MessageUtils.showMessage({
				text: 'Você deve selecionar pelo menos um período de recorrência',
				status: 'error'
			});

			return false;
		}

		$self.siblings('.loading-text').removeClass('hide');

		return callback(item, content);
	};


	/**
	 * Trigga click no último CTA de recorrente para abrir automaticamente o modal ao acessar o checkout
	 */
	this.autoOpen = function() {
		setTimeout(function() {
			//Inicia o modal com o ultimo produto adicionado,
			//caso já tenha sido chamado adiciona a classe been-called
			var $cartTemplate = $('.cart-template');

			//if($(window).width() > 1000){
			if (!$cartTemplate.is('.been-called') && $('.js-modal-open').length > 0) {
				$cartTemplate.find('.js-modal-open').last().trigger('click');
				$cartTemplate.addClass('been-called');
			}
			//}
		}, 1500);
	};

	this.hidePayments = function() {
		$.each(self.orderForm.items, function(i, v) {
			if(self.hasActiveRecurrence(v.attachments)){
				$('.payment-group-item:not(#payment-group-creditCardPaymentGroup)').addClass('hide');
				$('#payment-group-creditCardPaymentGroup').click();
				return false;
			}
		});
	};

});

/*jshint strict: false */
dust.filters.intAsCurrency = function(value) {
	return _.intAsCurrency(value);
};

dust.filters.recurrenceSemanas = function(value) {
	var intPeriod = value.match(/^\d{1,}/gmi);

	if(intPeriod && intPeriod[0] > 12) {
		value = (intPeriod / 4) + ' meses';
	}

	return value;
};