import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-categoria', function() {

	this.init = () => {
		checkInlineDatalayers();

		this.breadCrumb();
		this.shelfSelectSku();
		this.bannerDataLayer();
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

	this.init();
});
