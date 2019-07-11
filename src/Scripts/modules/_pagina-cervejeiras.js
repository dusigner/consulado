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


	cervejeiras.init();
})();

// export default promoDestaque;
