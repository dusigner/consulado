import { checkInlineDatalayers, pushDataLayer } from 'modules/_datalayer-inline';

Nitro.module('dataLayer-counterBF-2020', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.clickEuQuero();
		this.userTime();

	};

	this.clickEuQuero = () => {
		$('.counter__section').find('.sku_buy').on('click', function () {
			const label = $(this).parent().find('.box-produto').attr('data-idproduto');

			pushDataLayer(
				'black_friday_2020',
				'home_ofertas_relâmpago',
				`${label}`
			);
		});
		$('.counter__section').find('.sku_buy').on('click', function () {
			const label = $('.counter__offer-prod').parent().find('.slick-dots .slick-active').text();

			pushDataLayer(
				'black_friday_2020',
				`home_ofertas_relâmpago`,
				`click_eu_quero_produto_${label}`
			);
		});
	};

	var counterms;

	this.userTime = () => {

		var countms = 0;
		var val = 0;

		counterms = setInterval(function () {
			countms = countms + 1 / 100;
			if (countms >= 1) {
				if (val === 0) {
					val += 1;
					pushDataLayer(
						'black_friday_2020',
						'home_ofertas_relampago ',
						`viability_ofertas_relampago_1_segundo`
					);
				}
			}
			if (countms >= 4) {
				if (val === 1) {
					val += 1;
					pushDataLayer(
						'black_friday_2020',
						'home_ofertas_relampago ',
						`viability_ofertas_relampago_4_segundos`
					);
				}
			}
			if (countms >= 10) {
				if (val === 2) {
					val += 1;
					pushDataLayer(
						'black_friday_2020',
						'home_ofertas_relampago',
						`viability_ofertas_relampago_10_segundos`
					);
					clearInterval(counterms);
				}
			}
		}, 10);
}
	this.init();
});
