'use strict';

import 'modules/product/gallery';
import 'dataLayers/dataLayer-cervejeira';
import 'dataLayers/dataLayer-categoria';

import CupomCervejeira from 'modules/cervejeiras/cervejeiras.cupomBanner';
import Video from 'modules/cervejeiras/cervejeiras.video';
import Funcionalidades from 'modules/cervejeiras/cervejeiras.funcionalidades';
import Cores from 'modules/cervejeiras/cervejeiras.cores';
import Smartbeer from 'modules/cervejeiras/cervejeiras.smartbeer';
import Ofertas from 'modules/cervejeiras/cervejeiras.ofertas';

Nitro.controller('cervejeira', ['gallery', 'dataLayer-cervejeira', 'dataLayer-categoria'], function(gallery, dataLayerCervejeira) {
	const cervejeiras = {};

	// Init
	cervejeiras.init = () => {
		CupomCervejeira.copyCupom();
		Video.init();
		Funcionalidades.listaFuncionalidades();
		Cores.init();
		Smartbeer.renderSmartBeerShowcase(gallery);
		Ofertas.showcaseRegularCervejeiras();

		$('body').addClass('buyButton');
	};

	// Iniciar somente na página de Cervejeiras
	const bodyHasCervejeira = $('body.smartbeer2');
	if (bodyHasCervejeira.length > 0) {
		cervejeiras.init();
		dataLayerCervejeira.init();
	}
});
