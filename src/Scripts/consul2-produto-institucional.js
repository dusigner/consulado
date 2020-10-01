/* global $: true, Nitro: true */
'use strict';

import 'modules/produto-institucional/benefits';
import 'modules/produto-institucional/produto-institucional';
import 'modules/produto-institucional/specifications';

Nitro.controller(
	'produto-institucional',
	[
		'beneficios',
		'produto-institucional',
		'specifications'
	],

	function () {}
)

let sbSlick = function () {
	var screenWidth = $(window).width();
	//Slick slider intro mobile
	if (screenWidth <= '660') {
		$('.container-cards').slick({
			autoplay: true,
			autoplaySpeed: 1000,
			arrows: false,
			dots: true
		});
	}
	this.sbSlick()
};
