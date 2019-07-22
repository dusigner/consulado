/**
 *
 * @fileOverview counter
 *
 */
'use strict';

Nitro.module('datalayer_track', function() {
	this.init = () => {
		const $bannersoffers = $('.banners-offers__item'),
			$prateleirasTab = $('.prateleira-tabs__tab');

		// Desconto a vista tag
		$bannersoffers.eq(0).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão de Desconto',
				action: 'Clique no Botão desconto à Vista ',
				label: 'Botão 1 Desconto à vista '
			});
		});

		// Frete Grátis tag
		$bannersoffers.eq(1).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Frete Grátis',
				action: 'Clique no Botão Frete Grátis ',
				label: 'Botão 2 Frete Grátis no Produto '
			});
		});

		// ATé 40% tag
		$bannersoffers.eq(2).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Até 40% Off',
				action: 'Clique no Botão Até 40% Off ',
				label: 'Botão 3 Até 40% Off '
			});
		});

		// Geladeiras TAB
		$prateleirasTab.eq(0).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Dia do Consumidor Categoria: Geladeira',
				action: 'Clique no Botão Dia do Consumidor: Geladeira ',
				label: 'Botão 1 Dia do Consumidor: Geladeira '
			});
		});

		// Fogões TAB
		$prateleirasTab.eq(1).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Dia do Consumidor Categoria: Fogão',
				action: 'Clique no Botão Dia do Consumidor: Fogão ',
				label: 'Botão 2 Dia do Consumidor: Fogão '
			});
		});

		// Lavadora TAB
		$prateleirasTab.eq(2).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Dia do Consumidor Categoria: Lavadora',
				action: 'Clique no Botão Dia do Consumidor: Lavadora ',
				label: 'Botão 3 Dia do Consumidor: Lavadora '
			});
		});

		// Cervejeira TAB
		$prateleirasTab.eq(3).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Dia do Consumidor Categoria: Cervejeira',
				action: 'Clique no Botão Dia do Consumidor: Cervejeira ',
				label: 'Botão 4 Dia do Consumidor: Cervejeira '
			});
		});

		// Freezer TAB
		$prateleirasTab.eq(4).on('click', function() {
			dataLayer.push({
				event: 'generic',
				category: 'Botão Dia do Consumidor Categoria: Freezer',
				action: 'Clique no Botão Dia do Consumidor: Freezer ',
				label: 'Botão 5 Dia do Consumidor: Freezer '
			});
		});

		$('body')
			// TAG BOTÃO 'EU QUERO!' CONTADOR
			.on('click', '.counter__offer-cta', function() {
				dataLayer.push({
					event: 'generic',
					category: 'Botão Contador ',
					action: 'Clique no Botão Dia do Consumidor: Eu Quero ',
					label: 'Botão Dia do Consumidor: Eu Quero '
				});
			})
			// TAG PRODUTO CONTADOR
			.on('click', '.counter__offer-prod', function() {
				const $prod = $(this),
					prodName = $prod.find('.shelf__title').text(),
					prodID = $prod.find('.shelf__item').data('idproduto');

				dataLayer.push({
					event: 'generic',
					category: 'Botão Contador',
					action: `Botão Comprar ${prodName} + ${prodID}`,
					label: `${prodName} + ${prodID}`
				});
			})
			// TAG PRODUTOS TABS
			.on('click', '.box-produto', function() {
				const $prod = $(this),
					prodID = $prod.data('idproduto'),
					prodName = $prod
						.find('.prod-info .nome')
						.clone()
						.children()
						.remove()
						.end()
						.text()
						.replace(/(\r\n|\n|\r)/gm, '')
						.trim(), // remove line breakd and spaces
					prodCategory = $('.prateleira-tabs__tab.is--active')
						.text()
						.trim();

				dataLayer.push({
					event: 'generic',
					category: `Botão Categoria ${prodCategory}`,
					action: 'Comprar Produto ',
					label: `${prodName} + ${prodID}`
				});
			});
	};

	this.init();
});
