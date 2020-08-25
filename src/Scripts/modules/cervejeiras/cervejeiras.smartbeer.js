require('vendors/jquery.maskedinput');
import { pushDataLayer } from 'modules/_datalayer-inline';

const Smartbeer = {
	renderSmartBeerShowcase: gallery => {
		let productImage = [],
			productSkuSelector = $('.smartbeer-showcase').find('.product-skuSelector'),
			productBox = $('.smartbeer-showcase'),
			skus = productBox.find('.product-insertsku'),
			galleryImg = $('.product-image');

		const setUrlButton = productLink => {
			const skuData = $(productLink)
					.find('.product-sku_radio:checked')
					.data('sku-value'),
				skuButton = productLink.find('.product-buy'),
				skuName = $(productLink)
					.find('.product-sku_radio:checked')
					.parent()
					.data('title');

			skuButton
				.unbind()
				.removeClass('-not-selected-smartbeer')
				.attr(
					'href',
					`/checkout/cart/add?sku=${skuData}&qty=1&seller=1&redirect=true&sc=${
						window.jssalesChannel ? window.jssalesChannel : 3
					}`
				)
				.click(() => {
					pushDataLayer(
						`[Squad] Comprar Cervejeira Consul smartbeer_ Carbono ${skuName}`,
						'Clique no botão comprar',
						`Comprar Cervejeira Cervejeira Consul smartbeer_ Carbono ${skuName}`
					);
				});

			$(window).trigger('cervejeira.skuChanged', {
				skuData: skuData,
				skuName: skuName
			});
		};

		productImage.push('/arquivos/smartbeer-frontal.png?v=2');
		productImage.push('/arquivos/smartbeer-lado.png?v=2');
		productImage.push('/arquivos/smartbeer-aberta.png?v=2');
		productImage.push('/arquivos/smartbeer-aberta-2.png?v=2');

		let galleryThumbs = galleryImg.find('.thumbs');

		productImage.forEach(function(index) {
			galleryThumbs.append(`
				<li>
					<a rel="${index}" title="Zoom" href="javascript:void(0);" id="botaoZoom" class="ON" zoom="${index}">
						<img src=${index}>
					</a>
				</li>
			`);
		});

		gallery.init();

		if (productSkuSelector.children().length === 0) {
			let item = skus.find('.from-shelf'),
				skuName = skus.find('input[type=checkbox]').attr('name'),
				sku = skus.parents('.product-info').find('.product-skuSelector'),
				productLink = sku.parents('.product-info');

			if (sku.children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					// prettier-ignore
					let title = item.eq(i).find('input[type=text]').attr('title') === '127V'
							? '110V'
							: item.eq(i).find('input[type=text]').attr('title'),
						skuId = item
							.eq(i)
							.find('input[type=checkbox]')
							.attr('rel'),
						objectClass = title.replace(/\s/g, '') + '_' + skuId,
						isAvailable = item.eq(i).hasClass('unavailable') ? 'unavailable' : 'available';

					skus
						.parents('.smartbeer-showcase')
						.find('.product-skuSelector')
						.attr('name', skuName).append(`
						<div class="product-sku__selector" data-title="${title}">
							<input class="product-sku_radio ${isAvailable}" type="radio" id="${objectClass}" name=${skuName} data-sku-value="${skuId}">
							<label class="product-sku_title ${isAvailable}" for="${objectClass}" name=${skuName}>${title}</label>
						</div>
					`);
				}

				$('.vitrine-smartbeer .product-buy').addClass('-not-selected-smartbeer');

				sku.find('.unavailable').attr('disabled', true);

				if (sku.find('.available').length === 2) {
					sku.find('.available').attr('checked', 'checked');
					setUrlButton(productLink);
				}

				productLink.find('.product-sku_radio').on('change', function() {
					setUrlButton(productLink);
					$('.product-sku_error').addClass('hide');

					$('.product-sku_error').slideUp('slow', function() {});
				});

				$('.-not-selected-smartbeer').on('click', function() {
					$('.product-sku_error').slideDown('slow', function() {
						$('.product-sku_error').removeClass('hide');
					});
				});
			}
		}

		const startForm = () => {
			const validateEmail = (email) => {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(email);
			}

			const maskTel = () => {
				jQuery(function($){
					$('#cerv-tel').mask('(99) 9999-9999?9');
				});
			}

			maskTel();

			$(document).on('click', '#cerv-submit', () => {
				if ($('#cerv-name').val() == '' || $('#cerv-email').val() == '' || $('#cerv-tel').val() == '') {
					$('.form-status').text('Preencha todos os campos').show();
				}
				else if (!validateEmail($('#cerv-email').val())) {
					$('.form-status').text('E-mail inválido!').show();
				}
				else {
					setFields();
				}
			});
		};

		const setFields = () => {
			const clientData = {
				nome:               $('#cerv-name').val(),
				telefone:           $('#cerv-email').val(),
				email:              $('#cerv-tel').val(),
			}

			sendData(clientData);
		};

		const sendData = (clientData) => {
			$.ajax({
				'headers': {
					'Accept': 'application/vnd.vtex.ds.v10+json',
					'Content-Type': 'application/json'
				},
				'url': `/api/dataentities/NT/documents`,
				'async': true,
				'crossDomain': true,
				'type': 'PATCH',
				'data': JSON.stringify(clientData)
			}).success(() => {
				$('.form-status').text('Dados enviados com sucesso!').show();
			}).fail(() => {
				$('.form-status').text('Ocorreu um erro, tente novamente mais tarde').show();
			}).done(() =>{
				setTimeout(() => {
					$('.form-status').fadeOut(500);
				}, 5000);
			});
		}

		// Checks if product is unavailable

		if ($('.vitrine-smartbeer .product-price-to').text() === 'R$ 0,00') {
			$('.product-price, .product-skuSelector, .product-buy-button').addClass('hide');

			$('.product-info').append(`
				<div class="notifyme-title-div" style="">
					<h3 class="notifymetitle notifyme-title">Produto temporariamente indisponível</h3>
				</div>
				<form action="/no-cache/AviseMe.aspx" style="">
					<fieldset class="sku-notifyme-form notifyme-form">
						<p>Seja avisado quando estiver disponível
							<br>Ou entre em contato com nosso
							<a href="tel:+551108009700777" title="Televendas" class="show-personal-inline notifyme-televendas">Televendas 0800 970 0777</a>
						</p>
						<input id="cerv-name" class="sku-notifyme-client-name notifyme-client-name" placeholder="Digite seu nome..." size="20" type="text" name="notifymeClientName" id="notifymeClientName" style="display: inline-block;">
						<input id="cerv-email" class="sku-notifyme-client-email notifyme-client-email" placeholder="Digite seu e-mail..." size="20" type="text" name="notifymeClientEmail" id="notifymeClientEmail" style="display: inline-block;">
						<input id="cerv-tel" class="sku-notifyme-client-phone notifyme-client-phone" placeholder="Digite seu telefone..." type="tel" name="notifymeClientPhone" id="notifymeClientPhone" style="display: inline-block;">
						<input id="cerv-submit" class="btn-ok sku-notifyme-button-ok notifyme-button-ok" value="Avise-me" type="button" name="notifymeButtonOK" id="notifymeButtonOK" style="display: inline-block;">
						<p class="form-status" style="display:none;"></p>
						<input type="hidden" class="sku-notifyme-skuid notifyme-skuid" name="notifymeIdSku" value="2004086" style="display: none;">
					</fieldset>
				</form>
				<p class="notifyme-loading-message" style="display: none">
					<span class="sku-notifyme-loading notifyme-loading">Carregando...</span>
				</p>
				<fieldset class="success" style="display:none;">
					<label>
						<em><span class="sku-notifyme-success notifyme-success">Cadastrado com sucesso, assim que o produto for disponibilizado você receberá um email avisando.</span></em>
					</label>
				</fieldset>
				<fieldset class="error" style="display: none">
					<label><span class="sku-notifyme-error   notifyme-error"></span></label>
				</fieldset>
			</div>
			`)

			startForm();
		}
	}
};

export default Smartbeer;
