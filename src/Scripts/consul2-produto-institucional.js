/* global $: true, Nitro: true */
'use strict';

import 'modules/produto-institucional/produto-institucional';
import 'modules/produto-institucional/benefits';

Nitro.controller(
	'produto-institucional',
	[
		'produto-institucional',
		'beneficios',
	],

	function () {
		// Chave seletora para a exibição das especificações do produto com caixa ou sem caixa.
		const elementSelector = $('.specs__measure-selector'),
			elementBox = $('.specs__measure-box h4');

		elementSelector.find('a:first').addClass('active');
		$(`.specs__measure-box h4[data-selector=${elementSelector.find('a:first').attr('data-selector')}]`).addClass('active');

		elementSelector.find('a').on('click', function () {
			elementSelector.find('a').removeClass('active');
			elementBox.removeClass('active');

			$(this).addClass('active');
			$(`.specs__measure-box h4[data-selector=${$(this).attr('data-selector')}]`).addClass('active');
		});

		// Chave seletora para a exibição dos setores de especificações nos dispositivos móveis.
		$('.specs__measure, .specs__items, .specs__specs, .specs__additionalInfo, .specs__links').find('h4').on('click', function() {
			let $this = $(this);
			$this.toggleClass('specActive');
			$this.parents('.specs__section').toggleClass('inactive');
		});

		$('.btn-ver-mais-especs').click(function (){
			$('.especs-toggle').toggleClass('active-toggle');
		});
	}
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
