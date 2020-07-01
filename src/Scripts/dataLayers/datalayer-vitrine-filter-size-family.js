import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('datalayer-vitrine-filter-size-family', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.vitrineFilterFamily();
	};

	this.vitrineFilterFamily = () => {

		let acao = $('#vitrines-family .pequena .prateleira').find('ul li > .box-produto .detalhes .prod-info').attr('title');

		$('#vitrines-family .pequena .prateleira').find('ul li > .box-produto').on('click', function () {
			acao = $(this).attr('title');

			pushDataLayer(
				'Vitrines_Tamanho-familia',
				`click_${acao}`,
				`card_${label}`
			);
		});

		// $('.cont-linha').on('click', function () {
		// 	const label = $(this).find('button');

		// 	pushDataLayer(
		// 		'Vitrines_Tamanho-familia',
		// 		`click`,
		// 		`card_${label}`
		// 	);
		// });
	}
	this.init();
});
