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
		this.newAlavanca();
	};

	this.tabAlavancasInteresse = () => {
		$('.vitrine-ofertas-interesses').find('.discount-item').click(function() {
			const label = $(this).text().trim();

			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Alavanca de Promoções`,
				`${label}`
			);
		});
	};

	this.vitrineAlavancaInteresses = () => {
		$('.vitrine-ofertas-interesses').find('.box-produto a').click(function() {
			const label1 = $(this).parents('.box-produto').find('.nome li').text().trim(),
				label2 = $(this).parents('.box-produto').attr('data-category');

			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Seleção de SKU`,
				`${label1}`
			);

			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Seleção de SKU`,
				`${label2}`
			);
		});
	};

	this.vitrineAlavancasLink = () => {
		$('.vitrine-ofertas-interesses').find('.link-shelf a').on('click', function() {
			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Seleção de SKU`,
				`Veja todos os produtos`
			);
		});
	};

	this.storyClick = () => {
		$('.stories-circle-list__link').on('click', function() {
			const label = $(this).attr('title');
			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Stories Mobile`,
				`${label}`
			);
		});
	};

	this.banners = () => {
		$('.banner-combos a').on('click', function() {
			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
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
				'[SQUAD] Semana do Consumidor',
				`${label2}`,
				`${label1}`
			);
		});
	};

	this.vitrineOfertasLink = () => {
		$('.vitrine-ofertas-alavancas').find('.link-shelf a').on('click', function() {
			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
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
				'[SQUAD] Semana do Consumidor',
				`${action}`,
				`Confira`
			);
		});
	};

	this.searchAllProducts = () => {
		$('.onpage-search__link').on('click', function() {
			pushDataLayer(
				'[SQUAD] Semana do Consumidor',
				`Diga o que procura e encontramos para você!`,
				`Ver todos os produtos da loja`
			);
		});
	};

	this.search = () => {
		$('.onpage-search button').on('click', ({currentTarget}) => {
			const $element = $(currentTarget),
				$searchValue = $element.parent().find('.text-search').val();

			if ($searchValue.length > 3) {
				pushDataLayer(
					'[SQUAD] Semana do Consumidor',
					`Termo de busca`,
					$searchValue
				);
			}
		});
	};

	this.newAlavanca = () => {
		$('.box-oferta__cards a').on('click', ({currentTarget}) => {
			const $element = $(currentTarget),
				$elementText = $element.text();


				pushDataLayer(
					'[SQUAD] Semana do Consumidor',
					`Alavanca de Promoções`,
					$elementText
				);
		});
	};

	this.init();
});
