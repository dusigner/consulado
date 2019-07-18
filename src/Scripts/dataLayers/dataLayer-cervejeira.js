import { pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-cervejeira', function() {
	this.trocarCor = () => {
		$('.cervejeira-selecao-cores').on('afterChange', function() {
			const color = $(this)
				.find('.cervejeira-selecao-cores__item.slick-active')
				.data('color');

			pushDataLayer(
				`[Squad} Cervejeira Consul ${color}`,
				'Trocar cor cervejeira',
				`Trocar cor da cervejeira ${color}`
			);
		});
	};

	this.trocarCor();
});
