import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('datalayer-tira-duvidas', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.tiraDuvidas();
	};

	this.tiraDuvidas = () => {
		$('#btn-modal').on('click', function () {
			pushDataLayer(
				'PDP_vitrine_superior',
				`clique`,
				`tira_duvidas_consul`
			);
		});

		$('li.toggle').on('click', function () {
			const categoriaFaq = $(this).find('>.active .txt');
			const label = categoriaFaq.text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_tira_duvidas',
				`clique_categoria_faq`,
				`${label}`
			);
			console.log(categoriaFaq.text());
		});
		$('.pergunta').on('click', function () {
			const aberturaFaq = $(this).find('h2.is--active');
			const label = aberturaFaq.text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			pushDataLayer(
				'PDP_tira_duvidas',
				`abertura_faq`,
				`${label}`
			);
			console.log(aberturaFaq.text());
		});
	}
	this.init();
});
