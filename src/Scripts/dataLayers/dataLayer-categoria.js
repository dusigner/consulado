import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-categoria', function() {
	this.breadCrumb = () => {
		$('.breadcrumb a').click(function(e) {
			e.preventDefault();
			const category = $(this).text();

			pushDataLayer(
				'[SQUAD] Breadcrumb Eletrodomésticos',
				`Ir para a Categoria ${
					category === 'Consul' || category === 'ConsulQA'
						? 'Home'
						: category
				}`,
				`Ir para a Categoria ${
					category === 'Consul' || category === 'ConsulQA'
						? 'Home'
						: category
				}`
			);
		});
	};

	checkInlineDatalayers();

	this.breadCrumb();
});
