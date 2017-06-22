'use strict';

require('modules/percentoff');

Nitro.module('prateleira', ['percentoff'], function() {
	var $shelf = $('.prateleira-slider');

	this.hiddenEmptyShelves = function() {

		$shelf.each(function() {
			if( !($(this).innerHTML > 0) ) {
				$(this).closest('section.slider').hide();
			}
		});
	}();
});
