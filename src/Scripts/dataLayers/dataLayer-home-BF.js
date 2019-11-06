import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-home-bf', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.tabAlavancasInteresse();
		this.vitrineAlavancaInteresses();
		this.vitrineAlavancasLink();
		this.storyClick();
		this.banners();
		this.ofertasEspeciais();
		this.vitrineOfertasLink();
		this.bannersQuality();
		this.searchAllProducts();
		this.search();
	};

	this.tabAlavancasInteresse = () => {
		$('.vitrine-ofertas-interesses').find('.discount-item').click(function() {
			const label = $(this).text().trim();

			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - O que te interessa mais?',
				`Seleção de Alavanca`,
				`${label}`
			);
		});
	};

	this.vitrineAlavancaInteresses = () => {
		$('.vitrine-ofertas-interesses').find('.box-produto a').click(function() {
			const label1 = $(this).parents('.box-produto').find('.nome li').text().trim(),
				label2 = $(this).parents('.box-produto').attr('data-category');

			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - O que te interessa mais?',
				`Seleção de SKU`,
				`${label1}`
			);

			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - O que te interessa mais?',
				`Seleção de SKU`,
				`${label2}`
			);
		});
	};

	this.vitrineAlavancasLink = () => {
		$('.vitrine-ofertas-interesses').find('.link-shelf a').on('click', function() {
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - O que te interessa mais?',
				`Seleção de SKU`,
				`Veja todos os produtos`
			);
		});
	};

	this.storyClick = () => {
		$('.stories-circle-list__link').on('click', function() {
			const label = $(this).attr('title');
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - Aproveite as Ofertas',
				`CTA Stories`,
				`${label}`
			);
		});
	};

	this.banners = () => {
		$('.banner-combos a').on('click', function() {
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - BannerBem pensado',
				`Banner Combo`,
				`Veja Mais`
			);
		});
	}

	this.ofertasEspeciais = () => {
		$('.vitrine-ofertas-alavancas').find('.box-produto a').click(function() {
			const label1 = $(this).parents('.box-produto').find('.nome li').text().trim(),
				label2 = $(this).parents('.box-produto').attr('data-category');

			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - Ofertas especiais para você?',
				`${label2}`,
				`${label1}`
			);
		});
	};

	this.vitrineOfertasLink = () => {
		$('.vitrine-ofertas-alavancas').find('.link-shelf a').on('click', function() {
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - Ofertas especiais para você',
				`Seleção de SKU`,
				`Veja todos os produtos`
			);
		});
	};

	this.bannersQuality = () => {
		$('.banner-areas a').on('click', function() {
			const title = $(this).find('img'),
				action = (title.attr('alt').toLowerCase().indexOf('ecohouse') > -1) ? 'Purificador e Refil' : (title.attr('alt').toLowerCase().indexOf('peças') > -1) ? 'Peças e Acessórios' : 'Garantia Estendida';
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Home - Ofertas especiais para você',
				`${action}`,
				`Confira`
			);
		});
	};

	this.searchAllProducts = () => {
		$('.onpage-search__link').on('click', function() {
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Busca - Está procurando algo especial?',
				`Diga o que procura e encontramos para você!`,
				`Ver todos os produtos da loja`
			);
		});
	};

	this.search = () => {
		$('.onpage-search button').on('click', function() {
			pushDataLayer(
				'[SQUAD] BlackFriday2019 - Busca - Está procurando algo especial?',
				`O que você procura hoje?`,
				`Buscar`
			);
		});
	};

	this.init();
});
