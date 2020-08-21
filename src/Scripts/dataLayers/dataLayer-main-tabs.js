import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-main-tabs', function() {
	const self = this

	this.init = () => {
		checkInlineDatalayers();
		this.mainTabsOptions();
	};

	this.mainTabsOptions = () => {
		$('.main-tabs a').on('click', function() {
			let option = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_compre_junto',
				'menu_detalhes_especificacoes',
				`${option}`
			);
		});
	};

	this.init();
});
