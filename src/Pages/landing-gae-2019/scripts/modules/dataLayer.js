class DataLayer {

	setup()  {

		if( !dataLayer ) return;

		$('.banner.-comprar a').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Banner Principal',
				action: 'Clique no Banner ',
				label: 'contratar via banner '
			});
		});

		$('.garantia__item.-o-que-e a').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'O que É',
				action: 'Clique no Botão principal ',
				label: 'Informações sobre o que é '
			});
		});

		$('.garantia__modulo.-o-que-e .-comprar').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Contratar',
				action: 'Contratar Botão Principal ',
				label: 'Clique via módulo O que é '
			});
		});

		$('.garantia__item.-como-contratar a').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Como Contratar',
				action: 'Clique no Botão principal ',
				label: 'Informações Como Contratar '
			});
		});

		$('.garantia__modulo.-como-contratar .-comprar').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Contratar',
				action: 'Contratar Botão Principal ',
				label: 'Clique via módulo Como Contratar '
			});
		});

		$('.garantia__item.-como-acionar a').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Como Acionar',
				action: 'Clique no Botão principal ',
				label: 'Informações Como Acionar '
			});
		});

		$('.garantia__modulo.-como-acionar .acionar__button').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Fale com a Assistência Consul',
				action: 'Clique no Botão ',
				label: 'Falar com a Assistência '
			});
		});

		$('.garantia__item.-perguntas-frequentes a').click(() => {
			dataLayer.push({
				event: 'generic',
				category: 'Perguntas Frequentes',
				action: 'Clique no Botão ',
				label: 'Módulo Dúvidas: Ver Perguntas Frequentes '
			});
		});

		$('.garantia__modulo.-perguntas-frequentes .perguntas-frequentes__lista li').each(function(index) {
			$(this).click(() => {
				dataLayer.push({
					event: 'generic',
					category: 'Perguntas Frequentes',
					action: 'Expandir Dúvidas Frequentes ',
					label: `Módulo Dúvidas - Pergunta ${index + 1}`,
				});
			});
		});

		$('.contatos__fale form').submit( function() {
			const periodo = $(this).find('input[name="HorarioparaContato"]:checked').val();
			dataLayer.push({
				event: 'generic',
				category: 'Fale Conosco',
				action: 'Enviar Formulário ',
				label: `Botão Enviar: Horário de contato = ${periodo}`
			});
		});

		$('section.perguntas-frequentes .perguntas-frequentes__lista li').each(function (index) {
			$(this).click(() => {
				dataLayer.push({
					event: 'generic',
					category: 'Perguntas Frequentes',
					action: 'Enviar Formulário ',
					label: `Módulo Perguntas Frequentes - Pergunta ${index + 1}`
				});
			});
		});

		$('.experiencia form').submit(function () {
			const avaliacao = $(this).find('input[name="Rating"]:checked').val(),
				politica = $(this).find('input[name="PublicRating"]:checked').val();
			dataLayer.push({
				event: 'generic',
				category: 'Queremos Saber Sua Opinião',
				action: 'Enviar Formulário ',
				label: `Formulário Enviado, Avaliação: ${avaliacao}, Politica de Privacidade: ${politica}`
			});
		});
	}
}

export default DataLayer;
