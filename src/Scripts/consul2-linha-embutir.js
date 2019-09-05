'use strict';

import Video from 'modules/cervejeiras/cervejeiras.video';
import Event from 'modules/embutidos/eventos.embutidos';
import 'dataLayers/dataLayer-embutidos';

Nitro.controller('embutidos', ['dataLayer-embutidos'],function(dataLayerEmbutidos) {
	const embutidos = {};

	// Init
	embutidos.init = () => {
		Video.init();
		Event.init();
	};

	// Iniciar somente na página de Cervejeiras
	const bodyHasEmbutidos = $('body.embutidos');
	if (bodyHasEmbutidos.length > 0) {
		embutidos.init();
		dataLayerEmbutidos.init();
	}
});
