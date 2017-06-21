'use strict';

require('modules/percentoff');

Nitro.module('prateleira', ['percentoff'], function() {
	var $shelf = $('.prateleira-slider');

	$('.helperComplement').remove();
	
	this.hiddenEmptyShelves = function() {

		$shelf.each(function() {
			if( !($(this).innerHTML > 0) ) {
				$(this).closest('section.slider').hide();
			}
		});
	}();
});
