(() => {
	'use strict';

	const cervejeiras = {};
	const slider = $('.cervejeiras-slider');
	const selecaoCores = $('.cervejeira-selecao-cores');

	cervejeiras.init = () => {
		cervejeiras.slider();
		cervejeiras.selectColor();
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


	cervejeiras.init();
})();

// export default promoDestaque;