'use strict';

import 'modules/product/gallery';
const toastr = require('vendors/toastr');

Nitro.module('cervejeiras', ['gallery'],  function(gallery) {
	const cervejeiras = {};
	const cervejeiraConteudoSlider = $('.cervejeiras-conteudo-slider');
	const cervejeiraSlider = $('.cervejeiras-slider');
	const selecaoCores = $('.cervejeira-selecao-cores');
	const allSlides = $(
		'.cervejeiras-slider, .cervejeiras-conteudo-slider, .cervejeira-selecao-cores'
	);
	const coloredBackground = $('.item--cervejeira');
	const cervejeirasListaFuncionalidades = $('.cervejeiras-lista-funcionalidades');

	// Init
	cervejeiras.init = () => {
		cervejeiras.listaFuncionalidades();
		cervejeiras.slider();
		cervejeiras.conteudoSlider();
		cervejeiras.selectColor();
		cervejeiras.changeColorOnSelect();
		cervejeiras.copyCupom();
		cervejeiras.renderSmartBeerShowcase();
	};

	// Seleção de cores - Conteúdo
	cervejeiras.conteudoSlider = () => {
		cervejeiraConteudoSlider.slick({
			arrows: false,
			asNavFor: allSlides,
			dots: false,
			fade: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 960,
					settings: {
						infinite: false,
						initialSlide: 1,
						slidesToScroll: 1,
						slidesToShow: 1,
					}
				}
			]
		});
	};

	// Seleção de cores - Cervejeira
	cervejeiras.slider = () => {
		cervejeiraSlider.slick({
			arrows: false,
			asNavFor: allSlides,
			dots: true,
			fade: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 960,
					settings: {
						infinite: false,
						initialSlide: 1,
						slidesToScroll: 1,
						slidesToShow: 1,
					}
				}
			]
		});
	};

	// Seleção de cores - Seleção de cor
	cervejeiras.selectColor = () => {
		selecaoCores.slick({
			asNavFor: allSlides,
			dots: true,
			infinite: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 960,
					settings: {
						infinite: true,
						slidesToScroll: 1,
						slidesToShow: 1,
					}
				}
			]
		});
	};

	// Altera a cor do fundo de acordo com a cervejeira selecionada
	cervejeiras.changeColorOnSelect = () => {
		const selecaoCoresItems = selecaoCores.find('li');

		selecaoCores.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
			const beforeColor = $(selecaoCoresItems[(currentSlide + 1)]).data('color');
			const nextColor = $(selecaoCoresItems[(nextSlide + 1)]).data('color');

			coloredBackground.removeClass(`cervejeira--${beforeColor}`);
			coloredBackground.addClass(`cervejeira--${nextColor}`);
		});
	};


	cervejeiras.listaFuncionalidades = () => {
		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				cervejeirasListaFuncionalidades.not('.slick-initialized').slick({
					arrows: false,
					dots: true,
				});
			}
			else {
				if (cervejeirasListaFuncionalidades.hasClass('slick-initialized')) {
					cervejeirasListaFuncionalidades.slick('unslick');
				}
			}
		});
	};

	/**
	 * Show a toastr alert with the coupon code
	 * @param {string} code Coupon code
	 */
	cervejeiras.couponToastr = code => {
		jQuery($ => {
			const windowWidth = $(window).width();
			const position =
				windowWidth <= 320 ? 'toast-bottom-center' : 'toast-top-center';

			toastr.options = {
				closeButton: true,
				debug: false,
				newestOnTop: true,
				progressBar: false,
				positionClass: position,
				preventDuplicates: true,
				onclick: null,
				showDuration: '300',
				hideDuration: '1000',
				timeOut: '5000',
				extendedTimeOut: '1000',
				showEasing: 'swing',
				hideEasing: 'linear',
				showMethod: 'fadeIn',
				hideMethod: 'fadeOut'
			};
			toastr.info(`Código ${code} copiado`);
		});
	};

	cervejeiras.copyCupom = () => {
		const cupom = $('.cupom').text();
		$('.category-page-top-banner, .copiar').click(e => {
			e.preventDefault();

			const temp = $('<input>');

			$('body').append(temp);

			temp.val(cupom).select();

			document.execCommand('copy');

			cervejeiras.couponToastr(cupom);

			temp.remove();
		});
	};

	cervejeiras.renderSmartBeerShowcase = () => {
		let productImage = [],
			productDescription = '<h3 class="product-description-text">Uma cervejeira conectada que avisa quando a bebida está acabando e ajuda a pedir mais? <span>Agora existe.</span></h3>',
			productSkuSelector = $('.smartbeer-showcase').find('.product-skuSelector'),
			productBox = $('.smartbeer-showcase'),
			skus = productBox.find('.product-insertsku'),
			galleryImg = $('.product-image');


		const setUrlButton = (productLink) => {
			let skuData = $(productLink).find('.product-sku_radio:checked').data('sku-value'),
				skuButton = productLink.find('.product-buy');
			skuButton.unbind().removeClass('-not-selected').attr('href', `/checkout/cart/add?sku=${skuData}&qty=1&seller=1&redirect=true&sc=${window.jssalesChannel ? window.jssalesChannel : 3}`);
		};

		galleryImg.append(`
			<div class="prod-galeria text-center">
				<div class="apresentacao">
					<div id="setaThumbs"></div>
						<div id="show">
							<div id="include">
								<div id="image" productindex="0">

								</div>
							</div>
						<ul class="thumbs">

						</ul>
					</div>
				</div>
			</div>
		`);


		productImage.push('/arquivos/smartbeer-frontal.png');
		productImage.push('/arquivos/smartbeer-lado.png');
		productImage.push('/arquivos/smartbeer-aberta.png');
		productImage.push('/arquivos/smartbeer-aberta-2.png');


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

		if(productSkuSelector.children().length === 0) {
			let item = skus.find('.from-shelf'),
				skuName = skus.find('input[type=checkbox]').attr('name'),
				sku = skus.parents('.product-info').find('.product-skuSelector'),
				productLink = sku.parents('.product-info');

			if(sku.children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					let title = (item.eq(i).find('input[type=text]').attr('title') === '127V') ? '110V' : item.eq(i).find('input[type=text]').attr('title'),
						skuId = item.eq(i).find('input[type=checkbox]').attr('rel'),
						objectClass = title.replace(/\s/g, '') + '_' + skuId,
						isAvailable = (item.eq(i).hasClass('unavailable')) ? 'unavailable' : 'available';

					skus.parents('.smartbeer-showcase').find('.product-skuSelector').attr('name', skuName).append(`
						<div class="product-sku__selector" data-title="${title}">
							<input class="product-sku_radio ${isAvailable}" type="radio" id="${objectClass}" name=${skuName} data-sku-value="${skuId}">
							<label class="product-sku_title ${isAvailable}" for="${objectClass}" name=${skuName}>${title}</label>
						</div>
					`);
				}

				sku.find('.unavailable').attr('disabled', true);

				if(sku.find('.available').length === 2) {
					sku.find('.available').attr('checked', 'checked');
					setUrlButton(productLink);
				}


				productLink.find('.product-sku_radio').on('change', function () {
					setUrlButton(productLink);
				});

				// $('.-not-selected').on('click', function() {
				// 	if ($(this).parents('.detalhes').find('.sku_error').length === 0) {
				// 		let message = `
				// 						<div class="sku_error">
				// 							<span class="select-sku"> Por favor, <strong>selecione uma voltagem <strong></span>
				// 						</div>
				// 					`;

				// 		productLink.find('.prod-info').prepend($(message));
				// 		productLink.find('.nome, .promo-destaque').addClass('hide');
				// 	}
				// });
			}
		}


		$('.vitrine-smartbeer').find('.product-description').append(productDescription).find('.product-description-text').addClass('-desktop');

		$('.vitrine-smartbeer').find('.smartbeer-showcase').prepend(productDescription).children('.product-description-text').addClass('-mobile');
	};

	cervejeiras.init();
});
