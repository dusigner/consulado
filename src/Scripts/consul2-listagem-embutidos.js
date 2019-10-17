'use strict';

import 'modules/product/gallery';
import 'modules/listagem/percentoff';

import DestaqueEmbutidos from 'modules/embutidos/destaque.embutidos';
import CompreJunto from 'modules/embutidos/eventos.embutidos';

Nitro.controller('listagem-embutidos', ['gallery'], function(gallery) {
	const listEmbutidos = {};

	// Init
	listEmbutidos.init = () => {
		DestaqueEmbutidos.renderDestaqueEmbutidos(gallery);
		CompreJunto.compreJunto();
	};

	// Iniciar somente na página de Cervejeiras
	const bodyHaslistEmbutidos = $('body.listagem-embutidos');
	if (bodyHaslistEmbutidos.length > 0) {
		listEmbutidos.init();
	}
});
