'use strict';

//load Nitro Lib
require('vendors/nitro');

require('./modules/filters');
require('./modules/shelves');
require('./modules/quick-view');

Nitro.setup(['filters', 'shelves', 'quick-view'], function() {
	/*
		Display block handle the WPLAT-7696 behaviour.
		When URL has a 'autocombo' parameter with a placeholder combo name value,
		the select voltage modal relative of that combo must be show when page is loaded
	*/
	if(store.uri.hasQueryParam('autocombo')) {
		let autoComboToOpen = store.uri.getQueryParamValue('autocombo');

		if ($(`.combos-prateleira[data-name-combos="${autoComboToOpen}"] .combos-finalization__button`).length === 0) return false;

		$(`.combos-prateleira[data-name-combos="${autoComboToOpen}"] .combos-finalization__button`).trigger('click');

		$(window).on('2-step-combo-rendered', () => {
			$('.combos-quick-view .combos-finalization__button').trigger('click');
		});
	}
});
