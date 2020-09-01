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

	// this.buttonHandler = function(e, id, message) {
	// 	if (message === 'Por favor, selecione o modelo desejado.') {
	// 		$('#modal-sku').vtexModal({
	// 			complete: self.modalComplete
	// 		});
	// 	}
	// };

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
	});

	// $('.buy-button').on('buyButtonFailedAttempt.vtex', this.buttonHandler);

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
				$('.modal-voltagem').show();

				$('.content_botoes_televendas .buy-button').attr(
					'href',
					'javascript:alert(' + "'Por favor, selecione o modelo desejado.'" + ');'
				);
				// $('#BuyButton .buy-button').show();

				$('.content_botoes_televendas .buy-button, #BuyButton .buy-button').click(function(e) {
					e.preventDefault();

					$('.vtex-modal').fadeIn('2000');
				});
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

	this.hideSkuSelector = () => {
		let $skuList = $('.produto-v2').find('.prod-sku-selector');

		if ($skuList.find('label').length < 1 ) {
			$('.prod-sku-selector').css('display', 'none');
		}
	};


	// MODAL DE SELETOR DE VOLTAGEM NO BOTÃO DE COMPRE
	this.voltageSelectorModal = () => {

		$('body').append(`
			<div class="voltageModalWindow">
			</div>
		`);

		let selectVoltageModal = $('#modal-sku').clone();
		let voltageModal = $('.voltageModalWindow');

		$(voltageModal).append(selectVoltageModal);

		$('.voltageModalWindow #modal-sku').append(`
			<div class="closeModal">
				<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000 svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M14.7257 0.27539C14.813 0.362464 14.8823 0.465904 14.9295 0.579786C14.9768 0.693669 15.0011 0.815755 15.0011 0.939052C15.0011 1.06235 14.9768 1.18444 14.9295 1.29832C14.8823 1.4122 14.813 1.51564 14.7257 1.60272L1.60247 14.726C1.42645 14.902 1.18773 15.0009 0.938805 15.0009C0.689883 15.0009 0.451156 14.902 0.275142 14.726C0.0991277 14.55 0.000244142 14.3112 0.000244141 14.0623C0.000244139 13.8134 0.0991277 13.5747 0.275142 13.3987L13.3984 0.27539C13.4855 0.188095 13.5889 0.118836 13.7028 0.0715801C13.8167 0.0243242 13.9388 0 14.0621 0C14.1854 0 14.3075 0.0243242 14.4213 0.0715801C14.5352 0.118836 14.6387 0.188095 14.7257 0.27539Z" fill="#736C6B"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M0.27539 0.27539C0.188095 0.362464 0.118836 0.465904 0.0715801 0.579786C0.0243242 0.693669 0 0.815755 0 0.939052C0 1.06235 0.0243242 1.18444 0.0715801 1.29832C0.118836 1.4122 0.188095 1.51564 0.27539 1.60272L13.3987 14.726C13.5747 14.902 13.8134 15.0009 14.0623 15.0009C14.3112 15.0009 14.55 14.902 14.726 14.726C14.902 14.55 15.0009 14.3112 15.0009 14.0623C15.0009 13.8134 14.902 13.5747 14.726 13.3987L1.60272 0.27539C1.51564 0.188095 1.4122 0.118836 1.29832 0.0715801C1.18444 0.0243242 1.06235 0 0.939052 0C0.815755 0 0.693669 0.0243242 0.579786 0.0715801C0.465904 0.118836 0.362464 0.188095 0.27539 0.27539Z" fill="#736C6B"/>
				</svg>
			</div>
		`);

		$('#BuyButton .buy-button').click(function(e){
			e.preventDefault();

			voltageModal.addClass('voltageSelectorIsOpen');
		});

		$('.closeModal').click(function(){
			$(voltageModal).removeClass('voltageSelectorIsOpen');
		})

		$(voltageModal).click(function(e) {
			if (e.target == this) {
				$(voltageModal).removeClass('voltageSelectorIsOpen');
			};
		});

		$('#modal-sku .buy-button').click(function(e){
			if(!$('input[data-dimension=Voltagem]').is(":checked")) {
				alert('Selecione uma voltagem!');

			}
		});

		$('input[data-dimension=Voltagem]').click(function(){
			var selectedVoltage = $(this).val();

			$('.title-check-voltage').find('#showVoltage').text('');
			$('.title-check-voltage').find('#showVoltage').append(selectedVoltage);
		});
	};

	// MODAL DE SELETOR DE VOLTAGEM NO BOTÃO DE COMPRE


	this.voltageSelectorModal();
	this.unavailableSKU();
	this.hideSkuSelector();
});
