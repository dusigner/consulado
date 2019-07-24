const Funcionalidades = {
	// Listagem de funcionalidades
	listaFuncionalidades: () => {
		const cervejeirasListaFuncionalidades = $('.cervejeiras-lista-funcionalidades');

		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < 960) {
				cervejeirasListaFuncionalidades.not('.slick-initialized').slick({
					arrows: false,
					dots: true
				});
			} else {
				if (cervejeirasListaFuncionalidades.hasClass('slick-initialized')) {
					cervejeirasListaFuncionalidades.slick('unslick');
				}
			}
		});
	}
};

export default Funcionalidades;
