'use strict';

Nitro.module('prateleira-personalizada', function() {

	var self = this;

	this.setup = function() {
		console.log('Sttarting... prateleira personalizada');

		this.listaFuncionalidades();
		this.sliderProdutos();
	};


	// Listagem de funcionalidades
	this.listaFuncionalidades = () => {
		const $listaFuncionalidades = $('.lista-funcionalidades');

		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < 993) {
				$listaFuncionalidades.not('.slick-initialized').slick({
					arrows: false,
					dots: true
				});
			}
			else {
				if ($listaFuncionalidades.hasClass('slick-initialized')) {
					$listaFuncionalidades.slick('unslick');
				}
			}
		});
	};

	// Slider prateleiras
	this.sliderProdutos = () => {
		const $prateleira = $('.prateleira-personalizada__prateleiras ul');

		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < 993) {
				$prateleira.not('.slick-initialized').slick({
					arrows: false,
					dots: true
				});
			}
			else {
				if ($prateleira.hasClass('slick-initialized')) {
					$prateleira.slick('unslick');
				}
			}
		});
	};


	self.setup();
});
