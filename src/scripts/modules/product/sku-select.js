/* global $: true, Nitro: true, skuJson: true */
'use strict';

require('vendors/vtex-modal');

Nitro.module('sku-select', function() {


	var self = this;

	this.modalComplete = function(modal, content) {

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

	$('.notifyme-client-email').after('<input class="sku-notifyme-client-phone notifyme-client-phone" placeholder="Digite seu telefone..." type="tel" name="notifymeClientPhone" id="notifymeClientPhone" style="display: inline-block;">');
	$('#notifymeClientPhone').inputmask('(99) 9999[9]-9999');

	$(window).on('skuSelected.vtex', function(a, b, c) {

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

		if (skuJson.skus[0].available === true && skuJson.skus[1].available === true) {
			$('.modal-voltagem').addClass('hide');
			$('#vtex-modal-sku .sku-indisponivel').removeClass('sku-indisponivel');
		} else {
			$('.content_botoes_televendas .buy-button').attr('href', 'javascript:alert(' + '\'Por favor, selecione o modelo desejado.\'' + ');');
			$('.content_botoes_televendas .buy-button').show();
			$('.modal-voltagem').removeClass('hide');
			$('#BuyButton .buy-button').remove();

			$('.content_botoes_televendas .buy-button').click(function() {
				$('.vtex-modal').fadeIn('2000');
			});
		}

		if (!c.available) {
			$('.modal-voltagem').show();
		} else {
			$('#vtex-modal-sku .sku-indisponivel').removeClass('sku-indisponivel');
			$('.modal-voltagem').hide();
		}

		$('.btn-avise').click(function() {

			if ($('.modal-holder').is(':visible')) {
				$('.modal-holder').fadeOut('2000');
				$('.modal-avise').fadeIn('2000');
			}

			if ($('.modal-avise').length === 0) {
				$('#BuyButton .portal-notify-me-ref').addClass('modal-avise');
				$('#BuyButton .portal-notify-me-ref').appendTo('.vtex-modal');
				// $('#vtex-modal-sku .sku-notifyme-form').append('<a href="#relacionados" class="primary-button notifyme-button-ok scroll-to">Veja outros produtos relacionados</a>');
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

			$('#vtex-modal-sku .primary-button.notifyme-button-ok.scroll-to').click(function() {
				$('.portal-notify-me-ref.modal-avise').fadeOut('2000');
				$('#vtex-modal-sku').fadeOut('2000');
				$('.buy-button.buy-button-ref').click(function() {
					$('.modal-holder').fadeIn('2000');
				});
			});
		});
	});

});
