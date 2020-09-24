/* global $: true, Nitro: true */
'use strict';

import 'modules/product/video';
import 'modules/product/sku-fetch';
import 'modules/product/gallery-v2';
import 'modules/product/product-nav-v2';
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
import 'modules/product/product-tags';
import 'modules/product/outline-products';
import 'modules/chaordic';
import 'dataLayers/dataLayer-product';
import 'modules/wishlist/wishlist-check-users'

Nitro.controller(
	'produto-v2',
	[
		'chaordic',
		'color-selector',
		'sku-fetch',
		'galleryv2',
		'product-nav',
		'video',
		'details',
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
		'favourite-user-not-logged',
	],
	function (chaordic, colorSelector, skuFetch, galleryv2) {
		var self = this,
			$body = $('body');

		//INICIA CHAMADA DAS VITRINES CHAORDIC
		//chaordic.init('product', window.skuJson.productId);

		galleryv2.init();

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
			.on('skuSelected.vtex', function () {
				$reference.addClass('hide');
				$productSku.removeClass('hide');
			})
			.on('skuUnselected.vtex', function () {
				$productSku.addClass('hide');
				$reference.removeClass('hide');
			});

		$(document).ajaxComplete(function (e, xhr, settings) {
			if (/outrasformasparcelamento/.test(settings.url)) {
				self.valoresParcelas();
			}
		});

		// whats
		var $product_id = skuJson_0.productId;

		$.ajax({
			type: 'GET',
			async: true,
			url: `/api/catalog_system/pub/products/search?fq=productId:${$product_id}`,
			success: function (data) {
				if (data[0][`Grupo - Promotores`]) {
					var $name = data[0].productName;
					var $url = location.href;
					$(
						'.container-whats-container-info-link, .content_botoes_televendas-whats a'
					).attr(
						'href',
						`https://api.whatsapp.com/send?phone=5547988292017&&text=Olá, vim do site Consul e gostaria de falar sobre a (o) ${$name}. Link: ${$url}`
					);

					$(
						'.content_botoes_televendas-whats, .container-whats'
					).addClass('is--active');
					$('body').addClass('whatsapp');
				}
			}
		});

		// window.hideContainerWhats = function () {
		// 	document.querySelector('.container-whats').style.display = 'none';
		// };

		// Controle do container do promotor e liveChat para controle via Optimize

		document.querySelector('.container-whats').style.display = 'none';
		document.querySelector('.content_botoes_televendas').style.display = 'none';

		window.mobileCheck = function () {
			let check = false;
			(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
			return check;
		};

		window.showPromotor = function (mobile, desk) {
			const liveChatId = '3b5663e6-26c6-4fdc-a69c-61841c3edc9f'

			const device = window.mobileCheck() ? mobile : desk
			const containerWhatsClass = window.mobileCheck() ? '.content_botoes_televendas' : '.container-whats'


			// Controle do container do promotor e liveChat para controle via Optimize
			document.querySelector('.container-whats').style.display = 'none';
			document.querySelector('.content_botoes_televendas').style.display = 'none';

			window.mobileCheck = function () {
				let check = false;
				(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
				return check;
			};

			window.showPromotor = function (mobile, desk) {
				const liveChatId = '3b5663e6-26c6-4fdc-a69c-61841c3edc9f'

				const device = window.mobileCheck() ? mobile : desk
				const containerWhatsClass = window.mobileCheck() ? '.content_botoes_televendas' : '.container-whats'

				if (device === 'whats') document.querySelector(containerWhatsClass).style.display = 'block';
				if (device === 'liveChat') window.liveChat('init', liveChatId);
			}

			//Mensagem de Sucesso do Formulário Avise-me
			$('#BuyButton')
				.find('.notifyme-success')
				.html(
					'<h2><span class="icone-check"></span> Cadastrado com sucesso!</h2> <p>Você receberá um e-mail avisando, assim que o produto for disponibilizado.</p>'
				);

			//Mensagem após envio
			$('.portal-notify-me-ref')
				.find('.sku-notifyme-form p')
				.remove();
			$('.portal-notify-me-ref')
				.find('.notifymetitle')
				.after(
					'<p class="subtitle-page">Seja avisado quando estiver disponível<br>Ou entre em contato com nosso <a href="tel:+551108009700777 title="Televendas" class="show-personal-inline notifyme-televendas">Televendas 0800 970 0777</a></p>'
				);

			//Vitrine do Produto indisponível
			if ($(window).width() >= 1024) {
				const vitrineRelacionada = $('.portal-notify-me-ref').find('form');
				const initVitrine = vitrineRelacionada
					.parent()
					.append($('#relacionados-top'));
				// const initVitrine = $('#relacionados-top')

				initVitrine
					.find('.prateleira > ul')
					.not('.slick-initialized')
					.slick({
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
									slidesToShow: 2.2,
									slidesToScroll: 1,
									centerPadding: '0px'
								}
							},
							{
								breakpoint: 768,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 2,
									centerPadding: '0px'
								}
							}
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

			$document.on('change', $cepInput, ({ currentTarget }) => {
				const $element = $(currentTarget);
				$element.val()
					? $element.parent().addClass('has--cep')
					: $element.parent().removeClass('has--cep');
			});

			var $slider = $('section.slider .prateleira-slider .prateleira>ul').not(
				'.slick-initialized'
			);

			this.setupSlider = function ($currentSlider) {
				const quantity =
					$currentSlider.length > 0 &&
						$currentSlider[0].childElementCount < 3
						? $currentSlider[0].childElementCount
						: 3;
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
			$('a[data-modal]').on('click', ({ currentTarget }) => {
				const $element = $(currentTarget);
				$('#modal-' + $element.data('modal')).vtexModal();
			});
			// $('.close-modal').on('click', () => $('#vtex-modal-tipo-entrega.vtex-modal').trigger('click'));
			// open modal
			$('.product-assist-block.delivery a').on('click', function () {
				$('#modal-tipo-entrega, #modal-tipo-entrega__overlay').addClass(
					'is--modal-active'
				);
			});
			// close modal
			$('#modal-tipo-entrega .close-modal, #modal-tipo-entrega__overlay').on(
				'click',
				function () {
					$(
						'#modal-tipo-entrega, #modal-tipo-entrega__overlay'
					).removeClass('is--modal-active');
				}
			);

			//Opções de parcelamento
			self.valoresParcelas = function () {
				var $valoresParcelas = $('.valores-parcelas'),
					$showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
					$opcoesParcelamento = $valoresParcelas.find(
						'.other-payment-method-ul'
					),
					installmentQuantity = skuJson.skus[0].installments;

				if (installmentQuantity === 1) {
					$('.formas-pagamento-container').css('display', 'none');
				}

				$opcoesParcelamento.find('li').each(function () {
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
						precoTotal = parseFloat(
							numeroParcelas * valorParcela
						).toFixed(2);

					$(this).append(
						'<span class="valor-total">Total: R$ ' +
						precoTotal.toString().replace('.', ',') +
						'</span>'
					);
					$numeroParcelas.text(text);
					$valorParcela.text('de ' + $valorParcela.text());
				});

				// Exibe as opções de parcelamento
				$showParcelas.click(function () {
					$(this)
						.parents('.formas-pagamento-container')
						.toggleClass('is--active');
				});

				$('.select-voltage .select.skuList label').click(function () {
					$valoresParcelas.find('>p').slideUp();
					$opcoesParcelamento.slideUp();
				});
			};

			/* DROPDOWN Formulario avise-me quando indisponível */
			// $('.portal-notify-me-ref form').before('<div id="form-title" style="display: none;"><span id="form-title--notify">Avise-me quando o produto estiver disponível</span></div>');

			// $('#form-unavailable form').clone().appendTo('#form-unavailable #form-title');
			// $('#form-unavailable form').eq(1).remove();

			$('.portal-notify-me-ref form').before(
				'<div id="form-title" style="display: none;"><span id="form-title--notify">Avise-me quando o produto estiver disponível</span></div>'
			);

			$('#form-unavailable #form-title').on('click', function () {
				$(this)
					.parents('.portal-notify-me-ref')
					.find('form')
					.toggleClass('is--active'); //or addClass
				$(this)
					.parents('.portal-notify-me-ref')
					.find('#form-title')
					.toggleClass('is--active'); //or addClass
			});
			/* DROPDOWN Formulario avise-me quando indisponível */

			//Compre Junto
			$('.comprar-junto a').text('compre junto');

			//Google PLA
			if (
				$.getParameterByName('utmi_cp') === 'pla' ||
				$.cookie('google_pla')
			) {
				$.cookie('google_pla', true, {
					path: '/',
					expires: 1
				});

				$('body').addClass('google-pla');
			}

			//inicia automaticamente prateleiras sliders no desktop
			self.setupSlider($slider);
			if ($(window).width() > 768) {
				$('html, body').animate({ scrollTop: 190 }, 1500);
			}

			//mobile - abrir vitrines
			if ($(window).width() <= 768) {
				$('section.slider .pre-title').click(function (e) {
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
							.slideDown('slow', function () {
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
				init: function () {
					// console.log('init');
					Index.changeQntStoq();
					Index.getPecasRelacionadas();
				},

				getPecasRelacionadas: function () {
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
							return (
								$pecasModels.indexOf(item) === pos &&
								testNumber.test(item) === false
							);
						});
						$pecasModels.forEach(val => {
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
				changeQntStoq: function () {
					Index.getQntStoq();
					setInterval(function () {
						Index.getQntStoq();
					}, 900000);
				},

				getQntStoq: function () {
					Index.getAPI(
						'/api/catalog_system/pub/products/search?fq=productId:' +
						window.skuJson.productId
					).then(function (data) {
						if (data[0].items.length >= 2) {
							if (data[0].items[0].name === '110V') {
								qnt110v =
									data[0].items[0].sellers[0].commertialOffer
										.AvailableQuantity;
								qnt220v =
									data[0].items[1].sellers[0].commertialOffer
										.AvailableQuantity;

								Index.calcQntStoq(qnt110v, qnt220v);
							} else {
								qnt220v =
									data[0].items[0].sellers[0].commertialOffer
										.AvailableQuantity;
								qnt110v =
									data[0].items[1].sellers[0].commertialOffer
										.AvailableQuantity;

								Index.calcQntStoq(qnt110v, qnt220v);
							}
						} else {
							qnt110v =
								data[0].items[0].sellers[0].commertialOffer
									.AvailableQuantity;
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
					});
				},

				calcQntStoqOnly: function (qnt110v) {
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

				calcQntStoq: function (qnt110v, qnt220v) {
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

				getAPI: function (url) {
					return $.get(url);
				}
			};

			//favorites product
			var wishlist = {
				init: function () {
					wishlist.setProductId();
				},
				setProductId: function () {
					const wishlistButton = $('#wishlist-product').find(
						'.wishlist__button-pdp'
					);
					!!wishlistButton && !!$product_id
						? wishlistButton.attr('data-idproduto', $product_id)
						: wishlistButton.attr('data-idproduto', null);
				}
			};
			//favorites product

			//ativa teste A-B favorites product
			//$(".wishlist__container").css("display", "block")

			(function (window, document, $) {
				$(function () {
					Index.init();
					wishlist.init();
				});
			})(window, document, jQuery);

			$('.bread-crumb li:not(:first):not(:last)').on('click', function () {
				$('.bread-crumb').addClass('show-active');
			});

			$('.secure').removeClass('col-v2 l2 offset-l1');
			if ($(window).width() <= 1024) {
				if (
					$(
						'#BuyButton .notifyme.sku-notifyme #relacionados-top .prateleira > ul li.slick-slide'
					).length === 1
				) {
					$(
						'#BuyButton .notifyme.sku-notifyme #relacionados-top'
					).addClass('relacionados-top-one');
				}
			}
			$('input:radio').click(function () {
				$('#showVoltage').text($(this).val());
			});
		}
	}
);
