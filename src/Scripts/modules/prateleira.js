'use strict';

require('modules/listagem/percentoff');

Nitro.module('prateleira', ['percentoff'], function() {
	$('.helperComplement').remove();

	var $shelf = $('.prateleira-slider');

	this.hiddenEmptyShelves = (function() {
		$shelf.each(function() {
			if ($(this).is(':empty')) {
				$(this)
					.closest('section.slider')
					.hide();
			}
		});
	})();
});
