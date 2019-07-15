const toastr = require('vendors/toastr');

(() => {
	'use strict';

	const cervejeiras = {};
	const slider = $('.cervejeiras-slider');
	const selecaoCores = $('.cervejeira-selecao-cores');

	cervejeiras.init = () => {
		cervejeiras.slider();
		cervejeiras.selectColor();
		cervejeiras.copyCupom();
		cervejeiras.renderSmartBeerShowcase();
	};

	cervejeiras.slider = () => {
		slider.slick({
			arrows: false,
			asNavFor: selecaoCores,
			dots: true,
			fade: true,
			slidesToScroll: 1,
			slidesToShow: 1
		});
	};

	cervejeiras.selectColor = () => {
		selecaoCores.slick({
			asNavFor: slider,
			dots: true,
			infinite: false,
			slidesToScroll: 1,
			slidesToShow: 1,
			initialSlide: 1
		});
	};

	/**
	 * Show a toastr alert with the coupon code
	 * @param {string} code Coupon code
	 */
	cervejeiras.couponToastr = code => {
		jQuery($ => {
			const windowWidth = $(window).width();
			const position = windowWidth <= 320 ? 'toast-bottom-center' : 'toast-top-center';

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
				hideMethod: 'fadeOut',
			};
			toastr.info(`Código ${code} copiado`);
		});
	};

	cervejeiras.copyCupom = () => {
		const cupom = $('.cupom').text();
		$('.category-page-top-banner, .copiar').click((e) => {
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
			productDescription = `<h3 class="product-description-text">Uma cervejeira conectada que avisa quando a bebida está acabando e ajuda a pedir mais? <span>Agora existe.</span></h3>`;
		$.ajax({
			url: '/api/catalog_system/pub/products/search/smartbeer carbono',
			accept: 'application/json',
			contentType: 'application/json'
		}).done(function(data) {
			data[0].items[0].images.forEach(function(index){
				productImage.push(index.imageUrl);
			});
		});

		$('.vitrine-smartbeer').find('.product-description').append(productDescription);
	};

	cervejeiras.init();
})();

// export default promoDestaque;
