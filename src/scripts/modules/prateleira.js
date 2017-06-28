'use strict';

require('modules/percentoff');

Nitro.module('prateleira', ['percentoff'], function() {
	var $shelf = $('.prateleira-slider');

	this.hiddenEmptyShelves = function() {

		$shelf.each(function() {
			if( $(this).is(':empty') ) {
				$(this).closest('section.slider').hide();
			}
		});
	}();
});