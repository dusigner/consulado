import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-menu-antigo', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.headerMenu();
		this.menuDepartament();
	};

	this.headerMenu = () => {

		$('.account').find('.welcome #login').on('click', function () {
			pushDataLayer(
				'Menu Atual',
				`click_login`,
				`header-atual`
			);
		});

		$('.account').find('.link-meus-pedidos').on('click', function () {
			pushDataLayer(
				'Menu Atual',
				`click_pedidos`,
				`header-atual`
			);
		});

		$('.menu, .menu-mobile').find('.icon-hamburger, a[title="Departamentos"]').on('click', function () {
			pushDataLayer(
				'Menu Atual',
				`click_menu-departamentos`,
				`menu-atual`
			);
		});

		//click menu header
		let acao = $('.menu').find('.menu-header-category a').attr('title');

		$('.menu').find('.menu-header-category a').on('click', function () {
			acao = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_menu-${acao}`,
				`menu-atual`
			);
		});

		//menu mobile
		let acaoM = $('.menu-department').find('.item-department a').attr('title');

		$('.menu-department').find('.item-department a').on('click', function () {
			acaoM = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_menu-${acaoM}`,
				`menu-atual-mobile`
			);
		});

	};
	this.menuDepartament = () => {
		//click inside menu department
		let cozinhar = $('.menu .item-cozinhar').find('.menu-subcategory a').attr('title');

		$('.menu .item-cozinhar').find('.menu-subcategory a').on('click', function () {
			cozinhar = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${cozinhar}`,
				`hover-cozinhar`
			);
		});

		let gelar = $('.menu .item-gelar').find('.menu-subcategory a').attr('title');

		$('.menu .item-gelar').find('.menu-subcategory a').on('click', function () {
			gelar = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${gelar}`,
				`hover-gelar`
			);
		});

		let climatizar = $('.menu .item-refrescar').find('.menu-subcategory a').attr('title');

		$('.menu .item-refrescar').find('.menu-subcategory a').on('click', function () {
			climatizar = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${climatizar}`,
				`hover-climatizar`
			);
		});

		let limpeza = $('.menu .item-lavar').find('.menu-subcategory a').attr('title');

		$('.menu .item-lavar').find('.menu-subcategory a').on('click', function () {
			limpeza = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${limpeza}`,
				`hover-lavar-limpar`
			);
		});

		let beber = $('.menu .item-beber').find('.menu-subcategory a').attr('title');

		$('.menu .item-beber').find('.menu-subcategory a').on('click', function () {
			beber = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${beber}`,
				`hover-beber`
			);
		});

		let servicos = $('.menu .item-servicos').find('.menu-subcategory a').attr('title');

		$('.menu .item-servicos').find('.menu-subcategory a').on('click', function () {
			servicos = $(this).attr('title');
			pushDataLayer(
				'Menu Atual',
				`click_hover-${servicos}`,
				`hover-outros`
			);
		});
	};

	this.init();
});
