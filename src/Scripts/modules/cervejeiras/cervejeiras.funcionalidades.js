const pageInitialSize = $(window).width();
const responsiveSize = 960;

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

const Funcionalidades = {
	// Listagem de funcionalidades
	listaFuncionalidades: () => {
		const $cervejeirasListaFuncionalidades = $('.cervejeiras-lista-funcionalidades');

		responsiveSlickhelper($cervejeirasListaFuncionalidades, { arrows: false, dots: true });
	}
};

export default Funcionalidades;
