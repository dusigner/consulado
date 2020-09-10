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

		$('.account').find('.welcome #login').on('click', function () {
			pushDataLayer(
				'Novo-Header',
				`click_login`,
				`header`
			);
		});

		$('.account').find('.link-meus-pedidos').on('click', function () {
			pushDataLayer(
				'Novo-Header',
				`click_pedidos`,
				`header`
			);
		});

		$('.pre-header').find('.facilita-consul').on('click', function () {
			pushDataLayer(
				'Novo-Header',
				`top_bar`,
				`blog_facilita_consul`
			);
		});

		$('.menu, .menu-mobile').find('.icon-hamburger, a[title="Departamentos"]').on('click', function () {
			pushDataLayer(
				'Novo-Header',
				`click_menu - departamentos`,
				`novo - menu`
			);
		});

		//click menu header
		let acao = $('.menu').find('.menu-header-category a').attr('title');

		$('.menu').find('.menu-header-category a').on('click', function () {
			acao = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_menu - ${acao}`,
				`novo - menu`
			);
		});

		//menu mobil
		let acaoM = $('.menu-department').find('.item-department a').attr('title');

		$('.menu-department').find('.item-department a').on('click', function () {
			acaoM = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_menu - ${acaoM}`,
				`novo - menu - mobile`
			);
		});

	};
	this.newMenuDepartament = () => {
		//click inside menu department
		let cozinhar = $('.menu .item-cozinhar').find('.menu-subcategory a').attr('title');

		$('.menu .item-cozinhar').find('.menu-subcategory a').on('click', function () {
			cozinhar = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${cozinhar}`,
				`hover - cozinhar`
			);
		});

		let gelar = $('.menu .item-gelar').find('.menu-subcategory a').attr('title');

		$('.menu .item-gelar').find('.menu-subcategory a').on('click', function () {
			gelar = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${gelar}`,
				`hover - gelar`
			);
		});

		let climatizar = $('.menu .item-refrescar').find('.menu-subcategory a').attr('title');

		$('.menu .item-refrescar').find('.menu-subcategory a').on('click', function () {
			climatizar = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${climatizar}`,
				`hover - climatizar`
			);
		});

		let limpeza = $('.menu .item-lavar').find('.menu-subcategory a').attr('title');

		$('.menu .item-lavar').find('.menu-subcategory a').on('click', function () {
			limpeza = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${limpeza}`,
				`hover - lavar - limpar`
			);
		});

		let beber = $('.menu .item-beber').find('.menu-subcategory a').attr('title');

		$('.menu .item-beber').find('.menu-subcategory a').on('click', function () {
			beber = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${beber}`,
				`hover - beber`
			);
		});

		let servicos = $('.menu .item-servicos').find('.menu-subcategory a').attr('title');

		$('.menu .item-servicos').find('.menu-subcategory a').on('click', function () {
			servicos = $(this).attr('title');
			pushDataLayer(
				'Novo-Header',
				`click_hover - ${servicos}`,
				`hover - outros`
			);
		});
	};

	this.init();
});
