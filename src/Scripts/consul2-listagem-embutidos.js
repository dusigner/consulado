'use strict';

import 'modules/product/gallery';

import Smartbeer from 'modules/cervejeiras/cervejeiras.smartbeer';
import Ofertas from 'modules/cervejeiras/cervejeiras.ofertas';

Nitro.controller('listagem-embutidos', ['gallery'], function(gallery) {
	const listEmbutidos = {};

	// Init
	listEmbutidos.init = () => {
		Smartbeer.renderSmartBeerShowcase(gallery);
		Ofertas.showcaseRegularCervejeiras();

		$('body').addClass('buyButton');
	};

	// Iniciar somente na página de Cervejeiras
	const bodyHaslistEmbutidos = $('body.listagem-embutidos');
	if (bodyHaslistEmbutidos.length > 0) {
		listEmbutidos.init();
	}
});
