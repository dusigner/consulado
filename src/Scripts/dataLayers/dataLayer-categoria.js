import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-categoria', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.breadCrumb();
		this.shelfSelectSku();
		this.bannerDataLayer();
		this.taggingSelo();
	},

	this.breadCrumb = () => {
		$('.breadcrumb a').click(function() {
			const category = $(this).text();

			pushDataLayer(
				'[SQUAD] Breadcrumb Eletrodomésticos',
				`Ir para a Categoria ${category === 'Consul' || category === 'ConsulQA' ? 'Home' : category}`,
				`Ir para a Categoria ${category === 'Consul' || category === 'ConsulQA' ? 'Home' : category}`
			);
		});
	};

	this.shelfSelectSku = () => {
		$(window).on('shelf.skuChanged', (e, data) => {
			pushDataLayer(
				`${data.productName} ${data.skuName}`,
				'Escolher Voltagem Cervejeira',
				`Escolher Voltagem ${data.productName} ${data.skuName}`
			);
		});
	};

	this.bannerDataLayer = () => {
		const category = dataLayer[0].categoryName;
		$('.category-page-top-banner a').on('click', function() {
			pushDataLayer(
				`[SQUAD] Banner Categoria - ${category}`,
				'Clique no banner',
				'Banner Promocional'
			);
		});
	},

	this.taggingSelo = () => {
		var $categoryVitrine = 'Vitrines_Tamanho-familia';

		$('body').on('click', '.container .list-container .main .vitrine .prateleira ul li .box-produto', function() {
			var $label = '';
			var $nameProduct = '';

			$label = $(this).parents('li').find('.promo-destaque__icon').attr('style')
			$nameProduct = $(this).parents('li').find('.nome').text()

			if ( $label === `background-image: url('/arquivos/cns__promo__famílias-pequenas.png?v=dln')` ) {
				pushDataLayer(
					`[SQUAD] ${$categoryVitrine}`,
					`${$nameProduct}`,
					`Familias pequenas`
				);
			} else if ( $label === `background-image: url('/arquivos/cns__promo__famílias-médias.png?v=dln')` ) {
				pushDataLayer(
					`[SQUAD] ${$categoryVitrine}`,
					`${$nameProduct}`,
					`Familias médias`
				);
			} else if ( $label === `background-image: url('/arquivos/cns__promo__famílias-grandes.png?v=dln')` ) {
				pushDataLayer(
					`[SQUAD] ${$categoryVitrine}`,
					`${$nameProduct}`,
					`Familias grandes`
				);
			}
		});
	}

	this.init();
});
