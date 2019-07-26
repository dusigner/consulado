'use strict';

Nitro.module('prateleira-personalizada', function() {
	// Variables
	const self = this;
	const pageInitialSize = $(window).width();
	const responsiveSize = 769;

	// Start
	this.setup = function() {
		this.listaFuncionalidades();
		this.sliderProdutos();
	};

	// Listagem de funcionalidades
	this.listaFuncionalidades = () => {
		const $listaFuncionalidades = $('.lista-funcionalidades');

		responsiveSlickhelper($listaFuncionalidades, { arrows: true, dots: true });
	};

	// Slider prateleiras
	this.sliderProdutos = () => {
		const $prateleira = $('.prateleira-personalizada__prateleiras ul');

		responsiveSlickhelper($prateleira, { arrows: true, dots: false });
	};

	// Slick Helper
	const responsiveSlickhelper = ($element, objSlickConfig) => {
		if (pageInitialSize < responsiveSize) {
			$element.not('.slick-initialized').slick(objSlickConfig);
		}

		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < responsiveSize) {
				$element.not('.slick-initialized').slick(objSlickConfig);
			} else {
				$element.hasClass('slick-initialized') && $element.slick('unslick');
			}
		});
	};

	self.setup();
});
