'use strict';

const toastr = require('vendors/toastr');

Nitro.module('cervejeira', function() {
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
			productDescription =
				'<h3 class="product-description-text">Uma cervejeira conectada que avisa quando a bebida está acabando e ajuda a pedir mais? <span>Agora existe.</span></h3>';
		$.ajax({
			url: '/api/catalog_system/pub/products/search/smartbeer carbono',
			accept: 'application/json',
			contentType: 'application/json'
		}).done(function(data) {
			data[0].items[0].images.forEach(function(index) {
				productImage.push(index.imageUrl);
			});
		});

		$('.vitrine-smartbeer')
			.find('.product-description')
			.append(productDescription);
	};

	cervejeiras.init();
});

// export default promoDestaque;
