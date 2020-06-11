import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-product', function() {

	this.init = () => {
		checkInlineDatalayers();

		// product unavailable
		this.notifyMe();
		this.notifyMeSuccess();
		this.similarProduct();
		this.nameProductUnavailable();
		this.visibleVitrineSimilarProducts();

		// outline product
		this.nameProductOutline();
		this.visibleVitrineOutlineProducts();
		this.similarOutlineProduct();
	};

	var $categoryUnavailable = '[SQUAD] Reposicao de pecas';
	var $categoryOutline = '[SQUAD] Produto Fora-Linha';

	this.notifyMe = () => {
		$('#BuyButton .portal-notify-me-ref #notifymeButtonOK').on('click', function() {
			const $label = $(this).val();

			pushDataLayer(
				`${$categoryUnavailable}`,
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
						`${$categoryUnavailable}`,
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
				`${$categoryUnavailable}`,
				`click produto similar`,
				`${$label}`
			);
		});
	};

	this.visibleVitrineSimilarProducts = () => {
		setInterval(function() {
			if ( $('.portal-notify-me-ref').is(':visible') ) {
				if ( !$('body').hasClass('dataLayerVitrineSimilar') ) {
					$('body').addClass('dataLayerVitrineSimilar');
					if ( $('.portal-notify-me-ref').is(':visible') ) {
						const $label = $('.position-sticky-prod .productName').text();

						pushDataLayer(
							`${$categoryUnavailable}`,
							`exibicao produto indisponivel`,
							`${$label}`
						);
					}
				}
			}
		}, 50)
	};

	this.nameProductUnavailable = () => {
		setInterval(function() {
			if ( $('body').hasClass('produto-indisponivel') ) {
				if ( !$('body').hasClass('dataLayerProductUnavailable') ) {
					$('body').addClass('dataLayerProductUnavailable');

					const $label = $('#relacionados-top .prateleira > h2').text();

					pushDataLayer(
						`${$categoryUnavailable}`,
						`exibicao produto similar`,
						`${$label}`
					);
				}
			}
		}, 50)
	};

	this.visibleVitrineOutlineProducts = () => {
		setInterval(function() {
			if ( $('#outlineProducts-name').length === 1 ) {
				if ( !$('body').hasClass('dataLayerVitrineProductOutline') ) {
					$('body').addClass('dataLayerVitrineProductOutline');

					pushDataLayer(
						`${$categoryOutline}`,
						`exibicao produto fora-linha`,
						`Vitrine Produto fora de linha`
					);
				}
			}
		}, 50)
	};

	this.nameProductOutline = () => {
		setInterval(function() {
			if ( $('body').hasClass('product-outline') ) {
				if ( !$('body').hasClass('dataLayerProductOutline') ) {
					$('body').addClass('dataLayerProductOutline');

					const $label = $('.productName').text();

					pushDataLayer(
						`${$categoryOutline}`,
						`exibição vitrine`,
						`${$label}`
					);
				}
			}
		}, 50)
	};

	this.similarOutlineProduct = () => {
		$(document).on('click', '#outlineProducts-link', function() {
			const $label = $(this).find('#outlineProducts-name').text().trim();

			pushDataLayer(
				`${$categoryOutline}`,
				`click produto similar`,
				`${$label}`
			);
		});
	};

	this.init();
});
