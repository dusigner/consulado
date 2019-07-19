'use strict';

import 'modules/product/gallery';
import Clipboard from 'clipboard';
import 'dataLayers/dataLayer-cervejeira';

const toastr = require('vendors/toastr');

Nitro.module('cervejeiras', ['gallery', 'dataLayer-cervejeira'], function(
	gallery
) {
	const cervejeiras = {};
	const cervejeiraConteudoSlider = $('.cervejeiras-conteudo-slider');
	const cervejeiraSlider = $('.cervejeiras-slider');
	const selecaoCores = $('.cervejeira-selecao-cores');
	const allSlides = $(
		'.cervejeiras-slider, .cervejeiras-conteudo-slider, .cervejeira-selecao-cores'
	);
	const coloredBackground = $('.item--cervejeira');
	const cervejeirasListaFuncionalidades = $(
		'.cervejeiras-lista-funcionalidades'
	);

	// Init
	cervejeiras.init = () => {
		cervejeiras.listaFuncionalidades();
		cervejeiras.slider();
		cervejeiras.conteudoSlider();
		cervejeiras.selectColor();
		cervejeiras.changeColorOnSelect();
		cervejeiras.videoControl();
		cervejeiras.videoPlay();
		cervejeiras.copyCupom();
		cervejeiras.renderSmartBeerShowcase();
		cervejeiras.showcaseRegularCervejeiras();

		$('body').addClass('buyButton');
	};

	// Seleção de cores - Conteúdo
	cervejeiras.conteudoSlider = () => {
		cervejeiraConteudoSlider.slick({
			arrows: false,
			asNavFor: allSlides,
			dots: false,
			fade: true,
			infinite: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 960,
					settings: {
						infinite: true,
						initialSlide: 1,
						slidesToScroll: 1,
						slidesToShow: 1
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
			infinite: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
			responsive: [
				{
					breakpoint: 960,
					settings: {
						infinite: true,
						initialSlide: 1,
						slidesToScroll: 1,
						slidesToShow: 1
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
						slidesToShow: 1
					}
				}
			]
		});
	};

	// Altera a cor do fundo de acordo com a cervejeira selecionada
	cervejeiras.changeColorOnSelect = () => {
		const selecaoCoresItems = selecaoCores.find('li');

		selecaoCores.on(
			'beforeChange',
			(event, slick, currentSlide, nextSlide) => {
				const beforeColor = $(selecaoCoresItems[currentSlide + 1]).data(
					'color'
				);
				const nextColor = $(selecaoCoresItems[nextSlide + 1]).data(
					'color'
				);

				coloredBackground.removeClass(`cervejeira--${beforeColor}`);
				coloredBackground.addClass(`cervejeira--${nextColor}`);
			}
		);
	};

	// Listagem de funcionalidades
	cervejeiras.listaFuncionalidades = () => {
		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				cervejeirasListaFuncionalidades
					.not('.slick-initialized')
					.slick({
						arrows: false,
						dots: true
					});
			} else {
				if (
					cervejeirasListaFuncionalidades.hasClass(
						'slick-initialized'
					)
				) {
					cervejeirasListaFuncionalidades.slick('unslick');
				}
			}
		});
	};

	// Vídeos
	cervejeiras.videoControl = () => {
		const videosThumbs = $('.cervejeiras-videos-thumbs__item');

		videosThumbs.click(function() {
			const self = $(this);

			if (self.hasClass('is--active')) {
				return;
			}

			videosThumbs.removeClass('is--active');
			self.addClass('is--active');
		});
	};

	cervejeiras.videoPlay = () => {
		const playVideo = $(
			'.cervejeiras-videos-thumbs__item, .cervejeiras-videos__video'
		);

		playVideo.click(function() {
			const videoToPlay = $(
				'.cervejeiras-videos-thumbs__item.is--active'
			).data('vid');
			const videoContainer = $('.cervejeiras-videos__video');

			videoContainer.addClass('video-is-playing');
			cervejeiras.updateVideoUrl(videoToPlay);
		});
	};

	cervejeiras.updateVideoUrl = videoId => {
		const videoURL = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		const videoContainer = $('.cervejeiras-videos__video');
		const videoFrame = videoContainer.find('iframe');

		videoContainer.addClass('is--loading');
		videoFrame.attr('src', videoURL);

		setTimeout(() => {
			videoContainer.removeClass('is--loading');
		}, 700);
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

			const clipboard = new Clipboard(
				'.category-page-top-banner, .copiar',
				{
					text: function() {
						return cupom;
					}
				}
			);

			clipboard.on('success', function(e) {
				cervejeiras.couponToastr(cupom);
				e.clearSelection();
			});
		});
	};

	cervejeiras.renderSmartBeerShowcase = () => {
		let productImage = [],
			productSkuSelector = $('.smartbeer-showcase').find(
				'.product-skuSelector'
			),
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
				);

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
				sku = skus
					.parents('.product-info')
					.find('.product-skuSelector'),
				productLink = sku.parents('.product-info');

			if (sku.children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					let title =
							item
								.eq(i)
								.find('input[type=text]')
								.attr('title') === '127V'
								? '110V'
								: item
									.eq(i)
									.find('input[type=text]')
									.attr('title'),
						skuId = item
							.eq(i)
							.find('input[type=checkbox]')
							.attr('rel'),
						objectClass = title.replace(/\s/g, '') + '_' + skuId,
						isAvailable = item.eq(i).hasClass('unavailable')
							? 'unavailable'
							: 'available';

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

				$('.vitrine-smartbeer .product-buy').addClass(
					'-not-selected-smartbeer'
				);

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
	};

	cervejeiras.showcaseRegularCervejeiras = () => {
		let showcase = $('.vitrine-promocoes').find('.adicional');

		$(window).resize(function() {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				$('.vitrine-promocoes .prateleira>ul')
					.not('.slick-initialized')
					.slick({
						infinite: false,
						arrows: true,
						dots: true,
						slidesToShow: 1,
						slidesToScroll: 1
					});
			} else {
				if (
					$('.vitrine-promocoes .prateleira>ul').hasClass(
						'slick-initialized'
					)
				) {
					$('.vitrine-promocoes .prateleira>ul').slick('unslick');
				}
			}
		});

		showcase.each(function(index, element) {
			let parcel = $(element).find('strong');
			if (parcel.length > 0) {
				let text =
					parcel
						.eq(0)
						.text()
						.toLowerCase()
						.replace('r$ ', 'R$') +
					' ' +
					parcel
						.eq(1)
						.text()
						.toLowerCase()
						.replace('r$ ', 'R$');

				$(element).append(`
									<p class="preco-parcelado"> ${text} </p>
								`);
			}
		});
	};

	cervejeiras.init();
});
