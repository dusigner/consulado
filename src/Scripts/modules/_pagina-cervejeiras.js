const toastr = require('vendors/toastr');

(() => {
	'use strict';

	const cervejeiras = {};
	const cervejeiraSlider = $('.cervejeiras-slider');
	const cervejeiraConteudoSlider = $('.cervejeiras-conteudo-slider');
	const selecaoCores = $('.cervejeira-selecao-cores');
	const coloredBackground = $('.item--cervejeira');

	cervejeiras.init = () => {
		cervejeiras.slider();
		cervejeiras.conteudoSlider();
		cervejeiras.selectColor();
		cervejeiras.changeColorOnSelect();
		cervejeiras.copyCupom();
		cervejeiras.renderSmartBeerShowcase();
	};

	cervejeiras.conteudoSlider = () => {
		cervejeiraConteudoSlider.slick({
			arrows: false,
			asNavFor: selecaoCores,
			dots: false,
			fade: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
		});
	};

	cervejeiras.slider = () => {
		cervejeiraSlider.slick({
			arrows: false,
			asNavFor: selecaoCores,
			dots: true,
			fade: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
		});
	};

	cervejeiras.selectColor = () => {
		selecaoCores.slick({
			asNavFor: cervejeiraSlider,
			dots: true,
			infinite: true,
			initialSlide: 1,
			slidesToScroll: 1,
			slidesToShow: 1,
		});
	};

	cervejeiras.changeColorOnSelect = () => {
		const selecaoCoresItems = selecaoCores.find('li');

		selecaoCores.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
			const beforeColor = $(selecaoCoresItems[(currentSlide + 1)]).data('color');
			const nextColor = $(selecaoCoresItems[(nextSlide + 1)]).data('color');

			coloredBackground.removeClass(`cervejeira--${beforeColor}`);
			coloredBackground.addClass(`cervejeira--${nextColor}`);
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
