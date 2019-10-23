'use strict';

import 'modules/product/gallery';
import 'modules/listagem/percentoff';
import 'dataLayers/dataLayer-vitrine-embutidos';
import 'modules/listagem/comparebar';
import 'modules/listagem/filters';

import DestaqueEmbutidos from 'modules/embutidos/destaque.embutidos';
import CompreJunto from 'modules/embutidos/eventos.embutidos';

Nitro.controller('listagem-embutidos', ['gallery','dataLayer-vitrine-embutidos'], function(gallery,dataLayerVitrineEmbutidos) {
	const listEmbutidos = {};

	// Init
	listEmbutidos.init = () => {
		DestaqueEmbutidos.renderDestaqueEmbutidos(gallery);
		DestaqueEmbutidos.addLinkTesteAB();
		CompreJunto.compreJunto();
	};

	// Iniciar somente na página de Cervejeiras
	const bodyHaslistEmbutidos = $('body.listagem-embutidos');
	if (bodyHaslistEmbutidos.length > 0) {
		listEmbutidos.init();
		dataLayerVitrineEmbutidos.init();
	}
});
