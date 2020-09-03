import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-topbar-nav', function() {
	const self = this

	this.init = () => {
		checkInlineDatalayers();
		this.topBarNavOptions();
	};

	this.topBarNavOptions = () => {
		$('.anchors .item .scroll-to').on('click', function() {
			var $option = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				`PDP_barra_fixada`,
                `clique`,
                `${$option}`
			);
		});
	};

	this.init();
});
