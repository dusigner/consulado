import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-new-header-menu', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.newHeaderMenu();
	};

	this.newHeaderMenu = () => {

		$('.menu .item').first().on('click', function () {
			pushDataLayer(
				'Novo-Header',
				`click_menu-departamentos`,
				`novo-menu`
			);
		});

	};

	this.init();
});
