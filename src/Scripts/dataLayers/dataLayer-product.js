import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-product', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.notifyMe();
		this.notifyMeSuccess();
		this.similarProduct();
		this.nameProductUnavailable();
		this.visibleVitrineSimilarProducts();
	};

	var $category = '[SQUAD] Reposicao de pecas';

	this.notifyMe = () => {
		$('#BuyButton .portal-notify-me-ref #notifymeButtonOK').on('click', function() {
			const $label = $(this).val();

			pushDataLayer(
				`${$category}`,
				`click envio formulario avisa-me`,
				`${$label}`
			);

			return false;
		});
	};

	this.notifyMeSuccess = () => {
		$('#BuyButton .portal-notify-me-ref #notifymeButtonOK').on('click', function() {
			setTimeout(function() {
				if ( $('#BuyButton .portal-notify-me-ref .success').is(':visible') ) {
					const $label = $('#BuyButton .portal-notify-me-ref .sku-notifyme-success.notifyme-success').text().trim();

					pushDataLayer(
						`${$category}`,
						`exibicao cadastro sucesso`,
						`${$label}`
					);

					return false;
				}
			}, 1000)
		});
	};

	this.similarProduct = () => {
		$(document).on('click', '#relacionados-top .prateleira-slider li .box-produto', function() {
			const $label = $(this).find('h3.nome').text().trim();

			pushDataLayer(
				`${$category}`,
				`click produto similar`,
				`${$label}`
			);
		});
	};

	this.visibleVitrineSimilarProducts = () => {
		if ( $('.portal-notify-me-ref').is(':visible') ) {
			if ( !$('body').hasClass('dataLayerVitrineSimilar') ) {
				$('body').addClass('dataLayerVitrineSimilar');
				if ( $('.portal-notify-me-ref').is(':visible') ) {
					const $label = $('.position-sticky-prod .productName').text();

					pushDataLayer(
						`${$category}`,
						`exibicao produto indisponivel`,
						`${$label}`
					);
				}
			}
		}
	};

	this.nameProductUnavailable = () => {
		setInterval(function() {
			if ( $('body').hasClass('produto-indisponivel') ) {
				if ( !$('body').hasClass('dataLayerProductUnavailable') ) {
					$('body').addClass('dataLayerProductUnavailable');

					const $label = $('#relacionados-top .prateleira > h2').text();

					pushDataLayer(
						'[SQUAD] Reposicao de pecas',
						`exibicao produto similar`,
						`${$label}`
					);
				}
			}
		}, 50)
	};

	this.init();
});
