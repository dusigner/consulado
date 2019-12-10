/* global $: true, Nitro: true */
'use strict';

import 'modules/product/video';
import 'modules/product/sku-fetch';
import 'modules/product/gallery';
import 'modules/product/product-nav';
import 'modules/product/details';
import 'modules/product/specifications-v2';
import 'modules/product/selos';
import 'modules/product/sku-select';
import 'modules/product/produtos-adicionais';
import 'modules/product/boleto';
import 'modules/product/notify-me';
import 'modules/product/share';
import 'modules/product/upsell';
import 'modules/product/recurrence';
import 'modules/product/deliveryTime';
import 'modules/product/color-selector';
import 'modules/chaordic';

Nitro.controller(
	'produto-v2',
	[
		'chaordic',
		'color-selector',
		'sku-fetch',
		'gallery',
		'product-nav',
		'video',
		'details',
		'specifications-v2',
		'selos',
		'sku-select',
		'produtos-adicionais',
		'boleto',
		'notify-me',
		'share',
		'upsell',
		'deliveryTime',
		'recurrence',
	],
	function(chaordic, colorSelector, skuFetch, gallery) {
		var self = this,
			$body = $('body');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		//chaordic.init('product', window.skuJson.productId);

		gallery.init();

		// Teste AB
		var urlTesteAb = window.location.search;
		var testeA = 'testeab=a';
		var testeB = 'testeab=b';

		if (urlTesteAb.indexOf(testeA) >= 0) {
			$body.addClass('ab-test__mobile--show-b');
		} else if (urlTesteAb.indexOf(testeB) >= 0) {
			$body.addClass('ab-test__mobile--show-b');
		}

		// Exibe Informação de "Compra segura" quando o
		// botão comprar estiver exibindo na página
		if ($('#BuyButton .buy-button').is(':visible')) {
			$('.secure').show();
		} else {
			$('body').addClass('produto-indisponivel');
			$('.calc-frete').hide();
		}

		var $reference = $('.reference'),
			$productSku = $('.productSku');

		//TROCA DE NOMES PRODUCT / SKUREF
		$(document)
			.on('skuSelected.vtex', function() {
				$reference.addClass('hide');
				$productSku.removeClass('hide');
			})
			.on('skuUnselected.vtex', function() {
				$productSku.addClass('hide');
				$reference.removeClass('hide');
			});

		$(document).ajaxComplete(function(e, xhr, settings) {
			if (/outrasformasparcelamento/.test(settings.url)) {
				self.valoresParcelas();
			}
		});


		// Esconder/Aparecer barra de preço e comprar em determinada posição da tela
		if ($(window).width() <= 1024) {
			$(window).scroll(function(e) {
				e.preventDefault();
				var _pos = $(window).scrollTop();

				if ($('body').hasClass('produto-indisponivel') || (_pos >= 300)) {
					$('.product-info-bar').addClass('formas-pagamento-is--active');
				} else {
					$('.product-info-bar').removeClass('formas-pagamento-is--active');
					$('.formas-pagamento-container').removeClass('is--active');
				}
			});
		}

		var $slider = $('section.slider .prateleira-slider .prateleira>ul').not('.slick-initialized');

		this.setupSlider = function($currentSlider) {
			const quantity = ($currentSlider.length > 0 && $currentSlider[0].childElementCount < 3) ? $currentSlider[0].childElementCount : 3;
			$currentSlider.not('.slick-initialized').slick({
				infinite: true,
				slidesToShow: quantity,
				slidesToScroll: quantity,
				responsive: [
					{
						breakpoint: 990,
						settings: {
							dots: true,
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 768,
						settings: {
							dots: true,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});

			//ajusta para mobile - prateleira slider
			$('section.slider .prateleira-slider .prateleira ul')
				.find('.detalhes>a')
				.addClass('col-xs-6 col-md-12');
		};

		//setup modal
		$('a[data-modal]').on('click', ({currentTarget}) => {
			const $element = $(currentTarget);
			$('#modal-' + $element.data('modal')).vtexModal();
		});

		//Opções de parcelamento
		self.valoresParcelas = function() {
			var $valoresParcelas = $('.valores-parcelas'),
				$showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
				$opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul');

			$opcoesParcelamento.find('li').each(function() {
				var $numeroParcelas = $(this).find('span:first-child'),
					numeroParcelas = $numeroParcelas.text().split('X')[0],
					$valorParcela = $(this).find('strong'),
					valorParcela = parseFloat(
						$valorParcela
							.text()
							.replace('.', '')
							.replace(',', '.')
							.split('R$')[1]
					),
					text = $numeroParcelas.text().replace('de', ''),
					precoTotal = parseFloat(numeroParcelas * valorParcela).toFixed(2);

				$(this).append(
					'<span class="valor-total">Total: R$ ' + precoTotal.toString().replace('.', ',') + '</span>'
				);
				$numeroParcelas.text(text);
				$valorParcela.text('de ' + $valorParcela.text());
			});

			// Exibe as opções de parcelamento
			$showParcelas.click(function() {
				$(this).parents('.formas-pagamento-container').toggleClass('is--active');
			});


			$('.select-voltage .select.skuList label').click(function() {
				$valoresParcelas.find('>p').slideUp();
				$opcoesParcelamento.slideUp();
			});
		};

		//Compre Junto
		$('.comprar-junto a').text('compre junto');

		//Google PLA
		if ($.getParameterByName('utmi_cp') === 'pla' || $.cookie('google_pla')) {
			$.cookie('google_pla', true, {
				path: '/',
				expires: 1
			});

			$('body').addClass('google-pla');
		}

		//inicia automaticamente prateleiras sliders no desktop
		self.setupSlider($slider);
		if ($(window).width() > 768) {
			$('html, body').animate( { scrollTop: 190 }, 1500 );
		}

		//mobile - abrir vitrines
		if ($(window).width() <= 768) {
			$('section.slider .pre-title').click(function(e) {
				e.preventDefault();

				if ($(this).hasClass('open')) {
					$(this).removeClass('open');
					$(this)
						.siblings()
						.find('.prateleira>ul')
						.slideUp();
				} else {
					$('section.slider .open')
						.siblings()
						.find('.prateleira>ul')
						.slideUp();
					$('section.slider .open').removeClass('open');
					$(this).addClass('open');
					$(this)
						.siblings()
						.find('.prateleira>ul')
						.slideDown('slow', function() {
							self.setupSlider($(this));
						});
				}
			});

			$('section.slider')
				.eq(0)
				.find('.pre-title')
				.trigger('click');
		}

		self.valoresParcelas();

		// var ID_GA, urlAPI, end, rand, dataRandom, coe;
		var qnt110v, qnt220v;
		// var pathname = window.location.pathname;
		// var users = 0;

		var Index = {
			init: function() {
				// console.log('init');
				Index.changeQntStoq();
				Index.getPecasRelacionadas();
			},
			getPecasRelacionadas: function() {
				var $btnPecas = $('.btn-pecas-produto'),
					$pecasModels =
						$('.value-field.Pecas-compativeis').length > 0
							? $('.value-field.Pecas-compativeis').html()
							: false,
					url = '//loja.consul.com.br/busca?',
					testNumber = new RegExp(/^\d/);
				// console.log('sim');
				if ($pecasModels) {
					$pecasModels = $pecasModels.replace(/\s+/g, '').split(';');
					$pecasModels = $pecasModels.filter((item, pos) => {
						return $pecasModels.indexOf(item) === pos && testNumber.test(item) === false;
					});
					$pecasModels.forEach((val) => {
						url += 'fq=alternateIds_RefId:' + val + '&';
					});
					$btnPecas
						.attr('href', url)
						.parents('.product-assist-block')
						.addClass('has--parts');
				}
				// else{
				// 	console.log('não');
				// }
			},
			changeQntStoq: function() {
				Index.getQntStoq();
				setInterval(function() {
					Index.getQntStoq();
				}, 900000);
			},

			getQntStoq: function() {
				Index.getAPI('/api/catalog_system/pub/products/search?fq=productId:' + window.skuJson.productId).then(
					function(data) {
						if (data[0].items.length >= 2) {
							if (data[0].items[0].name === '110V') {
								qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
								qnt220v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

								Index.calcQntStoq(qnt110v, qnt220v);
							} else {
								qnt220v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
								qnt110v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

								Index.calcQntStoq(qnt110v, qnt220v);
							}
						} else {
							qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
							var nome = data[0].items[0].name;

							Index.calcQntStoqOnly(qnt110v);

							if (nome === 'BIVOLT' && qnt110v === 0) {
								$('.usuarios-ativos').hide();
							} else if (nome === '110V' && qnt110v === 0) {
								$('.usuarios-ativos').hide();
							} else if (nome === '220V' && qnt110v === 0) {
								$('.usuarios-ativos').hide();
							}
						}
					}
				);
			},

			calcQntStoqOnly: function(qnt110v) {
				if (qnt110v > 3) {
					$('#qnt_stoke').hide();
				} else if (qnt110v === 0) {
					$('.usuarios-ativos').hide();
				} else if (qnt110v <= 3) {
					$('#qnt_stoke').show();
				} else {
					$('#qnt_stoke').show();
				}
			},

			calcQntStoq: function(qnt110v, qnt220v) {
				if (qnt110v > 3 && qnt220v > 3) {
					$('#qnt_stoke').hide();
				} else if (qnt110v === 0 && qnt220v === 0) {
					$('.usuarios-ativos').hide();
				} else if (qnt110v === 0 && qnt220v > 3) {
					$('#qnt_stoke').hide();
				} else if (qnt110v > 3 && qnt220v === 0) {
					$('#qnt_stoke').hide();
				} else if (qnt110v === 0 && qnt220v <= 3) {
					$('#qnt_stoke').show();
				} else if (qnt110v <= 3 && qnt220v === 0) {
					$('#qnt_stoke').show();
				} else if (qnt110v <= 3 && qnt220v <= 3) {
					$('#qnt_stoke').show();
				}
			},

			getAPI: function(url) {
				return $.get(url);
			}
		};

		(function(window, document, $) {
			$(function() {
				Index.init();
			});
		})(window, document, jQuery);

		$('.bread-crumb li:not(:first):not(:last)').on('click', function() {
			$('.bread-crumb').addClass('show-active');
		});

		$('.secure').removeClass('col-v2 l2 offset-l1');
	}
);
