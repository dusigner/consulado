/* global $: true, Nitro: true */
'use strict';

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

			$(this)
				.prev()
				.trigger('click');
		});
	};

	this.buttonHandler = function(e, id, message) {
		if (message === 'Por favor, selecione o modelo desejado.') {
			$('#modal-sku').vtexModal({
				complete: self.modalComplete
			});
		}
	};

	// Seleciona a voltagem automaticamente
	$('.item-dimension-Voltagem .group_0').each(function() {
		var skuList = $(this);
		var skuLabel = skuList.find('label');

		if (skuLabel.hasClass('item_unavaliable') && skuLabel.length > 1) {
			skuLabel.not('.item_unavaliable').click();
		}

		if (skuLabel.length === 1) {
			skuLabel.click();
		}

		if (skuLabel.length <= 1 ) {
			$('.prod-sku-selector').css('display', 'none');
		}
	});

	$('.buy-button').on('buyButtonFailedAttempt.vtex', this.buttonHandler);

	$('.notifyme-client-email').after(
		'<input class="sku-notifyme-client-phone notifyme-client-phone" placeholder="Digite seu telefone..." type="tel" name="notifymeClientPhone" id="notifymeClientPhone" style="display: inline-block;">'
	);
	$('#notifymeClientPhone').inputmask('(99) 9999[9]-9999');

	$(window).on('skuSelected.vtex', function(a, b, c) {
		var templateVoltagem = {
			template:
				'<div id="modal-voltagem" class="modal-voltagem">' +
				'<div class="txt-indisponivel">O produto está disponível apenas em <strong>uma voltagem</strong> nos nossos estoques</div>' +
				'<a href="#" class="btn-avise">Avise-me disponibilidade</a>' +
				'</div>'
		};

		$('#vtex-modal-sku .sku-indisponivel .btn-avise').css('top', '0px');

		$('#modal-sku').addClass('sku-indisponivel');

		if ($(window).width() <= 768) {
			if ($('.modal-voltagem').length === 0) {
				$('#modal-sku .options').append(templateVoltagem.template);
			}

			if (!c.available) {
				$('.modal-voltagem').show();
				$('.content_botoes_televendas .buy-button').attr(
					'href',
					'javascript:alert(' + "'Por favor, selecione o modelo desejado.'" + ');'
				);
				$('.content_botoes_televendas .buy-button').show();
				$('.modal-voltagem').removeClass('hide');
				$('#BuyButton .buy-button').hide();

				$('.content_botoes_televendas .buy-button, #BuyButton .buy-button').click(function(e) {
					e.preventDefault();

					$('.vtex-modal').fadeIn('2000');
				});
			} else {
				$('#vtex-modal-sku .sku-indisponivel').removeClass('sku-indisponivel');
				$('.modal-voltagem').hide();
				$('#BuyButton .buy-button').show();
			}
		}

		$('.btn-avise').click(function() {
			if ($('.modal-holder').is(':visible')) {
				$('.modal-holder').fadeOut('2000');
				$('.modal-avise').fadeIn('2000');
			}

			if ($('.modal-avise').length === 0) {
				$('#BuyButton .portal-notify-me-ref').addClass('modal-avise');
				$('#BuyButton .portal-notify-me-ref').appendTo('.vtex-modal');
				$('#vtex-modal-sku .sku-notifyme-form').append(
					'<a href="#relacionados" class="primary-button notifyme-button-ok scroll-to">Veja outros produtos relacionados</a>'
				);
			}

			if ($('.back-window').length === 0) {
				$('.notifyme-form').prepend('<span class="back-window"></span>');
			}

			$('.sku-notifyme-form.notifyme-form p').html(
				'Insira seus dados abaixo para ser avisado quando o produto estiver <strong>disponível em outra voltagem.</strong>'
			);

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

	this.unavailableSKU = () => {
		$('label.dimension-Voltagem').on('click', () => {
			setTimeout(function() {
				if ($('.notifyme.sku-notifyme').is(':visible')) {
					$('.secure').hide();
					$('.calc-frete').hide();
				} else {
					$('.secure').show();
					$('.calc-frete').show();
				}
			}, 1000);
		})
	};

	this.unavailableSKU();
});
