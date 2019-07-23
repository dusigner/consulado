const Cores = {
	// Seleção de cores - Conteúdo

	cervejeiraConteudoSlider: $('.cervejeiras-conteudo-slider'),
	cervejeiraSlider: $('.cervejeiras-slider'),
	selecaoCores: $('.cervejeira-selecao-cores'),
	allSlides: $('.cervejeiras-slider, .cervejeiras-conteudo-slider, .cervejeira-selecao-cores'),
	coloredBackground: $('.item--cervejeira'),

	init: () => {
		Cores.slider();
		Cores.conteudoSlider();
		Cores.selectColor();
		Cores.changeColorOnSelect();
	},

	conteudoSlider: () => {
		Cores.cervejeiraConteudoSlider.slick({
			arrows: false,
			asNavFor: Cores.allSlides,
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
	},

	// Seleção de cores - Cervejeira
	slider: () => {
		Cores.cervejeiraSlider.slick({
			arrows: false,
			asNavFor: Cores.allSlides,
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
	},

	// Seleção de cores - Seleção de cor
	selectColor: () => {
		Cores.selecaoCores.slick({
			asNavFor: Cores.allSlides,
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
	},

	// Altera a cor do fundo de acordo com a cervejeira selecionada
	changeColorOnSelect: () => {
		const selecaoCoresItems = Cores.selecaoCores.find('li');

		Cores.selecaoCores.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
			const beforeColor = $(selecaoCoresItems[currentSlide + 1]).data('color');
			const nextColor = $(selecaoCoresItems[nextSlide + 1]).data('color');

			Cores.coloredBackground.removeClass(`cervejeira--${beforeColor}`);
			Cores.coloredBackground.addClass(`cervejeira--${nextColor}`);
		});
	}
};

export default Cores;
