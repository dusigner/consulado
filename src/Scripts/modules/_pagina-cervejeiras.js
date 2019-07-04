(() => {
	'use strict';

	const cervejeiras = {};

	cervejeiras.init = () => {
		cervejeiras.slider();
		cervejeiras.selectColor();
	};

	cervejeiras.slider = () => {
		const slider = $('.cervejeiras-slider');
		slider.slick({
			arrows: false,
			dots: false,
			fade: true,
			infinite: true,
			slidesToScroll: 1,
			slidesToShow: 1
		});
	};

	cervejeiras.selectColor = () => {
		const selecaoCores = $('.cervejeira-selecao-cores');
		selecaoCores.slick({
			arrows: false,
			dots: true,
			// fade: true,
			infinite: true,
			slidesToScroll: 1,
			slidesToShow: 3
		});
	};


	cervejeiras.init();
})();

// export default promoDestaque;