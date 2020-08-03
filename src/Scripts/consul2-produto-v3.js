/* global $: true, Nitro: true */
'use strict';

import 'modules/product/video';
import 'modules/product/sku-fetch';
import 'modules/product/gallery-v2';
import 'modules/product/product-nav-v2';
import 'modules/product/details-v3'; //trocar por v3
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
import 'modules/product/product-tags';
import 'modules/product/outline-products';
import 'modules/chaordic';
import 'dataLayers/dataLayer-product';

Nitro.controller(
	'produto-v3',
	[
		'chaordic',
		'color-selector',
		'sku-fetch',
		'galleryv2',
		'product-nav',
		'video',
		'details-v3',
		'specifications-v2',
		'selos',
		'sku-select',
		'produtos-adicionais',
		'boleto',
		'share',
		'upsell',
		'deliveryTime',
		'recurrence',
		'notify-me',
		'product-tags',
		'dataLayer-product',
		'outline-products',
	],
	function(chaordic, colorSelector, skuFetch, galleryv2) {
		var self = this,
			$body = $('body');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		//chaordic.init('product', window.skuJson.productId);

		galleryv2.init();

		//teste A-B detalhes
		// $('body').addClass('testeAB-detalhes');
		$('.detalhes .box-options .is--active').append('<h2 class="title-detalhes">Conheça o produto</h2><p class="no-doubt">Tudo pensado para não haver dúvidas</p>');

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
		// if ( skuJson.available === true ) {
		// 	$('.secure').show();
		// 	$('body').addClass('produto-disponivel');
		// } else {
		// 	if ( !$('body').hasClass('product-outline') ) {
		// 		$('body').addClass('produto-indisponivel');
		// 		$('.calc-frete').hide();
		// 		$('.secure').hide();
		// 		$('.cta-containers').hide();
		// 		$('.prod-more-info').hide();
		// 	}
		// }

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

		// whats
		var $product_id = skuJson_0.productId;

		$.ajax({
			type: 'GET',
			async: true,
			url:
            `/api/catalog_system/pub/products/search?fq=productId:${$product_id}`,
			success: function (data) {
				if ( (data[0][`Grupo - Promotores`])) {
					var $name = data[0].productName;
					var $url = location.href;
					$('.container-whats-container-info-link, .content_botoes_televendas-whats a').attr('href', `https://api.whatsapp.com/send?phone=5547988292017&&text=Olá, vim do site Consul e gostaria de falar sobre a (o) ${$name}. Link: ${$url}`);

					$('.content_botoes_televendas-whats, .container-whats').addClass('is--active');
					$('body').addClass('whatsapp');
				}
			}
		})

		window.hideContainerWhats = function() {
			document.querySelector('.container-whats').style.display = 'none';
		}

		//Mensagem de Sucesso do Formulário Avise-me
		$('#BuyButton').find('.notifyme-success').html('<h2><span class="icone-check"></span> Cadastrado com sucesso!</h2> <p>Você receberá um e-mail avisando, assim que o produto for disponibilizado.</p>');

		//Mensagem após envio
		$('.portal-notify-me-ref').find('.sku-notifyme-form p').remove();
		$('.portal-notify-me-ref').find('.notifymetitle').after('<p class="subtitle-page">Seja avisado quando estiver disponível<br>Ou entre em contato com nosso <a href="tel:+551108007227872" title="Televendas" class="show-personal-inline notifyme-televendas">Televendas 0800 722 7872</a></p>');

		//Vitrine do Produto indisponível
		if ($(window).width() >= 1024) {
			const vitrineRelacionada = $('.portal-notify-me-ref').find('form');
			const initVitrine = vitrineRelacionada.parent().append($('#relacionados-top'));
			// const initVitrine = $('#relacionados-top')

			initVitrine.find('.prateleira > ul').not('.slick-initialized').slick({
				slidesToShow: 2.2,
				slidesToScroll: 1,
				centerPadding: '0px',
				fade: false,
				infinite: false,
				cssEase: 'ease',
				easing: 'linear',
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3.2,
							slidesToScroll: 1,
							centerPadding: '0px',
						}
					},
				]
			});
		}

		// Esconder/Aparecer barra de preço e comprar em determinada posição da tela
		// if ($(window).width() <= 1024) {

		// 	if (!$('body').hasClass('produto-indisponivel')) {
		// 		$('.product-info-bar').css('display', 'block');
		// 		$(window).scroll(function(e) {
		// 			e.preventDefault();
		// 			var _pos = $(window).scrollTop();

		// 			if ($('body').hasClass('produto-indisponivel') || (_pos >= ($('#BuyButton').offset().top + 32))) {
		// 				$('.product-info-bar').addClass('formas-pagamento-is--active');

		// 			} else {
		// 				$('.product-info-bar').removeClass('formas-pagamento-is--active');
		// 				$('.formas-pagamento-container').removeClass('is--active');
		// 			}
		// 		})
		// 	}
		// }

		const $document = $(document),
			$cepInput = '#calculoFrete .prefixo input';

		$document.on('change', $cepInput, ({currentTarget}) => {
			const $element = $(currentTarget);
			$element.val() ? $element.parent().addClass('has--cep') : $element.parent().removeClass('has--cep');
		});

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
		$('.close-modal').on('click', () => $('#vtex-modal-tipo-entrega.vtex-modal').trigger('click'));

		//Opções de parcelamento
		self.valoresParcelas = function() {
			var $valoresParcelas = $('.valores-parcelas'),
				$showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
				$opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul'),
				installmentQuantity = skuJson.skus[0].installments;

			if (installmentQuantity === 1) {
				$('.formas-pagamento-container').css('display', 'none');
			}

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

		/* DROPDOWN Formulario avise-me quando indisponível */
		// $('.portal-notify-me-ref form').before('<div id="form-title" style="display: none;"><span id="form-title--notify">Avise-me quando o produto estiver disponível</span></div>');

		// $('#form-unavailable form').clone().appendTo('#form-unavailable #form-title');
		// $('#form-unavailable form').eq(1).remove();

		$('.portal-notify-me-ref form').before('<div id="form-title" style="display: none;"><span id="form-title--notify">Avise-me quando o produto estiver disponível</span></div>')

		$('#form-unavailable #form-title').on('click', function() {
			$(this).parents('.portal-notify-me-ref').find('form').toggleClass('is--active') //or addClass
			$(this).parents('.portal-notify-me-ref').find('#form-title').toggleClass('is--active') //or addClass
		})
		/* DROPDOWN Formulario avise-me quando indisponível */

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
						.attr('title', 'Peças para este produto')
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
		if ($(window).width() <= 1024) {
			if ( $('#BuyButton .notifyme.sku-notifyme #relacionados-top .prateleira > ul li.slick-slide').length === 1 ) {
				$('#BuyButton .notifyme.sku-notifyme #relacionados-top').addClass('relacionados-top-one')
			}
		}

		// tag pro teste ab
		$('body').addClass('testeAB-detalhes');

		// testeAB
		if ( $('body').hasClass('testeAB-detalhes')) {
			$('.testeA').hide();
			$('.testeB').show();

			var $detalhes = $('.testeA #detalhes').clone();
			var $especificacoes = $('.testeA #especificacoes');

			$('.testeB #detalhes').html($detalhes);
			$('.testeB #especificacoes').html($especificacoes);
		} else {
			$('.testeA').show();
			$('.testeB').hide();
		}

		$('.main-tabs a').on('click', function(){
			var $class = $(this);
			var $attr = $class.attr('href');
			if ( !$class.hasClass('is--active')){
				$('.main-tabs a').removeClass('is--active');
				$class.addClass('is--active');

				$('.testeB').attr('data-bind', '' + $attr);
			}
		});
	}
);
