import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-new-header-menu', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.newHeaderMenu();
		this.newMenuDepartament();
	};

	this.newHeaderMenu = () => {

		// $('.menu .item').first().on('click', function () {
		// 	pushDataLayer(
		// 		'Novo-Header',
		// 		`click_menu-departamentos`,
		// 		`novo-menu`
		// 	);
		// });

		//click header
		let acao = $('.menu').find('.menu-header-category a').attr('title');

		$('.menu').find('.menu-header-category a').on('click', function () {
			acao = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_menu-${acao}`,
				`novo-menu`
			);
		});

	};
	this.newMenuDepartament = () => {
		//click inside menu department
		let action = $('.menu .item-cozinhar').find('.menu-subcategory a').attr('title');

		$('.menu .item-cozinhar').find('.menu-subcategory a').on('click', function () {
			action = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover-${action}`,
				`hover-cozinhar`
			);
		});
	};

	this.init();
});
