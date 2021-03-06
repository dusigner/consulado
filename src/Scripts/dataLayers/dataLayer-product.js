import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-product', function () {
	const self = this

	this.init = () => {
		checkInlineDatalayers();

		this.seeRates();

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

		// whats
		this.clickWhats();
		this.clickAttendance();

		// assistance_and_related-product
		this.viewMore();
		this.scrollUser();
	};

	var $categoryUnavailable = '[SQUAD] Reposicao de pecas';
	var $categoryOutline = '[SQUAD] Produto Fora-Linha';

	this.notifyMe = () => {
		$('#BuyButton .portal-notify-me-ref #notifymeButtonOK').on('click', function () {
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
		$('#BuyButton .portal-notify-me-ref #notifymeButtonOK').on('click', function () {
			setTimeout(function () {
				if ($('#BuyButton .portal-notify-me-ref .success').is(':visible')) {
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
		$(document).on('click', '#relacionados-top .prateleira-slider li .box-produto', function () {
			const $label = $(this).find('h3.nome').text().trim();

			pushDataLayer(
				`${$categoryUnavailable}`,
				`click produto similar`,
				`${$label}`
			);
		});
	};

	this.visibleVitrineSimilarProducts = () => {
		setInterval(function () {
			if ($('.portal-notify-me-ref').is(':visible')) {
				if (!$('body').hasClass('dataLayerVitrineSimilar')) {
					$('body').addClass('dataLayerVitrineSimilar');
					if ($('.portal-notify-me-ref').is(':visible')) {
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
		setInterval(function () {
			if ($('body').hasClass('produto-indisponivel')) {
				if (!$('body').hasClass('dataLayerProductUnavailable')) {
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
		setInterval(function () {
			if ($('#outlineProducts-name').length === 1) {
				if (!$('body').hasClass('dataLayerVitrineProductOutline')) {
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
		setInterval(function () {
			if ($('body').hasClass('product-outline')) {
				if (!$('body').hasClass('dataLayerProductOutline')) {
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
		$(document).on('click', '#outlineProducts-link', function () {
			const $label = $(this).find('#outlineProducts-name').text().trim();

			pushDataLayer(
				`${$categoryOutline}`,
				`click produto similar`,
				`${$label}`
			);
		});
	};

	this.clickWhats = () => {
		$('.container-whats-container-info-link, .content_botoes_televendas-whats a').on('click', function () {

			pushDataLayer(
				'Promotores',
				'click_promotores',
				'PDP'
			);
		});
	};

	this.clickAttendance = () => {
		$('.prod-more-info a').on('click', function () {
			if ($($(this)).attr('title') === 'Informações de contratação') {
				if ($('body').hasClass('whatsapp')) {

					pushDataLayer(
						'Promotores',
						'click_atendimento',
						'PDP'
					);
				}
			}
		});
	};

	this.viewMore = () => {
		$('.product-assist-block a').on('click', function () {
			var $label = $(this).parents('.product-assist-block').find('.second-block h3').text().trim();
			var $labelSpace = $label.replace(/ +/g, '_');
			pushDataLayer(
				'[SQUAD] PDP_assistencia_e_relacionados',
				'clique_saiba_mais',
				`${$labelSpace}`
			);
		});
	};

	this.seeRates = () => {
		$('.trustvox-fluid-jump .rating-click-here').on('click', function() {
			pushDataLayer(
				'PDP_vitrine_superior',
				'clique',
				'ver_avaliacoes'
			);
		});
	};


	var counterms;

	this.userTime = () => {
		var countms = 0;
		var val = 0;

		counterms = setInterval(function () {
			countms = countms + 1 / 100;
			if (countms >= 1) {
				if (val === 0) {
					val += 1;
					pushDataLayer(
						'[SQUAD] PDP_assistencia_e_relacionados',
						'viability',
						`1_segundo`
					);
				}
			}
			if (countms >= 4) {
				if (val === 1) {
					val += 1;
					pushDataLayer(
						'[SQUAD] PDP_assistencia_e_relacionados',
						'viability',
						`4_segundos`
					);
				}
			}
			if (countms >= 10) {
				if (val === 2) {
					val += 1;
					pushDataLayer(
						'[SQUAD] PDP_assistencia_e_relacionados',
						'viability',
						`10_segundos`
					);
					clearInterval(counterms);
				}
			}
		}, 10);
	}
	this.scrollUser = () => {
		var isActive = true;

		$(window).scroll(function (event) {
			var $scroll = $(window).scrollTop();
			var $scrollAssistence = $('#assistencia').offset().top;
			var $limitScrollDesk = $('#assistencia .product-assist-block').offset().top;
			var $limitScrollMob = $('.trustvox-container.container').offset().top;

			if ($(window).width() > 768) {
				if ($scroll > $scrollAssistence - 600 && $scroll < $limitScrollDesk - 50) {
					if (!$('body').hasClass('is--scroll')) {
						isActive = false;
						$('body').addClass('is--scroll');
						self.userTime();
					}
				} else {
					$('body').removeClass('is--scroll');
					isActive = true;
					clearInterval(counterms);
				}
			} else {
				if ($scroll > $scrollAssistence - 200 && $scroll < $limitScrollMob - 200 && isActive) {
					if (!$('body').hasClass('is--scroll')) {
						isActive = false;
						$('body').addClass('is--scroll');
						self.userTime();
					}
				} else {
					$('body').removeClass('is--scroll');
					isActive = true;
					clearInterval(counterms);
				}
			}
		});
	}

	this.init();
});
