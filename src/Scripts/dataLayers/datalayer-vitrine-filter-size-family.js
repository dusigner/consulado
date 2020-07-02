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
		$('#vitrines-family .prateleira .box-produto').on('click', function () {
			const acao = $(this).find('.prod-info').attr('title');
			const label = $('.cont-linha').find('button.active').text();
			pushDataLayer(
				'Vitrines_Tamanho-familia',
				`click_${acao}`,
				`card_${label}`
			);
		});
	}
	this.init();
});
