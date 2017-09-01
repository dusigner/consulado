/* global $: true, Nitro: true */
'use strict';

require('vendors/vtex-modal');

Nitro.module('sku-select', function() {


	var self = this;

	this.modalComplete = function(modal, content) {

		/*content.on('change', 'input', function() {

			var input = $(this);

			$('input[id="' + $(this).attr('for') + '"]').prop('checked', true);

			input.prop('checked', true);
		});*/

		// because we can't have two radios with the same name in a page;
		content.wrap($('<form />'));

		content.on('click', 'label', function() {
			//e.preventDefault();

			$(this).prev().trigger('click');
		});
	};

	this.buttonHandler = function(e, id, message) {

		if (message === 'Por favor, selecione o modelo desejado.') {

			$('#modal-sku').vtexModal({
				complete: self.modalComplete
			});
		}
	};

	$('.buy-button').on('buyButtonFailedAttempt.vtex', this.buttonHandler);

	if (!$('#modal-sku .buy-button.buy-button-ref').is(':visible')) {
			$('.notifyme-client-email').after('<input class="sku-notifyme-client-phone notifyme-client-phone" placeholder="Digite seu telefone..." type="tel" name="notifymeClientPhone" id="notifymeClientPhone" style="display: inline-block;">');
			$('#notifymeClientPhone').inputmask('(99) 9999[9]-9999');
			if ($(window).width() <= 768) {
				$('.sku-selector-container .dimension-Voltagem').on('click', function() {

						var templateVoltagem = {
							template: '<div id="modal-voltagem" class="modal-voltagem">' +
							'<div class="txt-indisponivel">O produto está disponível apenas em <strong>uma voltagem</strong> nos nossos estoques</div>' +
							'<a href="#" class="btn-avise">Avise-me disponibilidade</a>' +
							'</div>' 
						};

						$('#vtex-modal-sku .sku-indisponivel .btn-avise').css('top', '0px');

						$('#modal-sku').addClass('sku-indisponivel');

						if ($('.modal-voltagem').length === 0) {
							$('#modal-sku .options').append(templateVoltagem.template);
						}

						$('.btn-avise').click(function() {

							if ($('.modal-holder').is(':visible')) {
								$('.modal-holder').fadeOut('2000');
								$('.modal-avise').fadeIn('2000');
							}

							if ($('.modal-avise').length === 0) {
								$('#BuyButton .portal-notify-me-ref').addClass('modal-avise');
								$('#BuyButton .portal-notify-me-ref').appendTo('.vtex-modal');
							}

							if ($('.back-window').length === 0) {
								$('.notifyme-form').prepend('<span class="back-window"></span>');
							}

							$('.sku-notifyme-form.notifyme-form p').html('Insira seus dados abaixo para ser avisado quando o produto estiver <strong>disponível em outra voltagem.</strong>');

							$('.notifyme-button-ok').val('Avise-me');

							$('.back-window').click(function() {
								if ($('.modal-avise').is(':visible')) {
									$('.modal-avise').fadeOut('2000');
									$('.modal-holder').fadeIn('2000');
									$('.modal-voltagem').fadeIn('2000');
								}
							});
						});
					});
				}
			}

});
