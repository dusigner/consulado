/* global $: true, Nitro: true */
'use strict';

Nitro.module('product-tags', function() {

	this.init = () => {
		this.tagTrustVox();
		// this.tagPecas();
		// this.tagContratacao();
		// this.tagTiposEntrega();
		// this.tagVendasCorp();
		this.tagDetalhamentoProd();
		this.tagParcelamento();
		this.tagGallery();
		this.tagMedidas();
		this.tagDownloads();
		this.tagBuy();
	}

	const $document = $(document);

	this.tagTrustVox = () => {
		const $trustButton = $('.trustvox-fluid-jump').find('.rating-click-here');

		$trustButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Clicou no texto',
				label: 'Produto: Geladeira Consul Frost Free Duplex 397 litros Evox com freezer embaixo'
			});
		});
	}

	this.tagPecas = () => {
		const $pecasButton = $('.product-assist-block.parts');

		$pecasButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Assistência e Relacionados',
				action: 'Peças para este produto',
				label: 'Veja Mais'
			});
		});
	}

	this.tagContratacao = () => {
		const $contratacaoButton = $('.product-assist-block.infos .second-block').find('a');

		$contratacaoButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Assistência e Relacionados',
				action: 'Informações de contratação',
				label: 'Veja Mais'
			});
		});
	}

	this.tagTiposEntrega = () => {
		const $entregasButton = $('.product-assist-block.delivery .second-block').find('a[data-modal="tipo-entrega"]');

		$entregasButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Assistência e Relacionados',
				action: 'Tipos de entrega',
				label: 'Veja Mais'
			});
		});
	}

	this.tagVendasCorp = () => {
		const $corpButton = $('.product-assist-block.corp .second-block').find('a');

		$corpButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Assistência e Relacionados',
				action: 'Vendas corporativas',
				label: 'Veja Mais'
			});
		});
	}

	this.tagDetalhamentoProd = () => {
		const $avaliationButton = $('.row.anchors ul li').find('a[href="#trustvox-reviews"]');

		$avaliationButton.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Detalhamento do Produtos',
				label: 'Avaliações'
			});
		});
	};

	this.tagParcelamento = () => {
		const $parcelButton = $('.formas-pagamento-container .other-payment-method').find('span.titulo-parcelamento');

		$parcelButton.on('click', ({currentTarget}) => {
			const $element = $(currentTarget);

			if (!$element.parents('.formas-pagamento-container').hasClass('is--active')) {
				dataLayer.push({
					event: 'generic',
					category: 'PDP_vitrine_superior',
					action: 'clique',
					label: 'formas_de_pagamento'
				});
			} else {
				dataLayer.push({
					event: 'generic',
					category: 'PDP_vitrine_superior',
					action: 'Formas de parcelamento',
					label: 'Fechar'
				});
			}
		});
	};

	this.tagGallery = () => {
		const $galleryButtons = '.prod-galeria ul.galleryThumbs li a';

		$document.on('click', $galleryButtons, ({currentTarget}) => {
			const $element = $(currentTarget),
				$position = String(parseInt($element.parent().attr('data-slick-index')) + 1),
				$productId = $('.reference .productReference').text();

			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Interação Galeria',
				label: $element.attr('href').indexOf('youtube') !== -1 ? `Video|${$productId}` : `${$position}|${$productId}`
			});
		});
	};

	this.tagMedidas = () => {
		const $boxButtonWith = '.specs__measure-selector.specs__list .specs__measure-selector-withBox',
			$boxButtonWithout = '.specs__measure-selector.specs__list .specs__measure-selector-withoutBox';

		$document.on('click', $boxButtonWith, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Medidas',
				label: 'Com Caixa'
			});
		});

		$document.on('click', $boxButtonWithout, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Medidas',
				label: 'Sem Caixa'
			});
		});
	};

	this.tagDownloads = () => {
		const $productManual = '.specs__links-content.specs__list ul li:first-child a',
			$productGuide = '.specs__links-content.specs__list ul li:nth-child(2) a',
			$productEnergy110v = '.specs__links-content.specs__list ul li:nth-child(3) a',
			$productEnergy220v = '.specs__links-content.specs__list ul li:nth-child(4) a';

		$document.on('click', $productManual, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Downloads',
				label: 'Manual do Produto'
			});
		});

		$document.on('click', $productGuide, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Downloads',
				label: 'Guia Rapido'
			});
		});

		$document.on('click', $productEnergy110v, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Downloads',
				label: 'Classificacao Energetica 110v'
			});
		});

		$document.on('click', $productEnergy220v, () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Downloads',
				label: 'Classificacao Energetica 220v'
			});
		});
	}

	this.tagBuy = () => {
		const $buyButtonInfos = $('.prod-info').find('a.buy-button'),
			$buyButtonFixedHeader = $('.cont-prod-details-nav').find('a.buy-button');

		$buyButtonInfos.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Botao Comprar Pagina',
				label: 'Comprar'
			});
		});

		$buyButtonFixedHeader.on('click', () => {
			dataLayer.push({
				event: 'generic',
				category: '[SQUAD] Produto',
				action: 'Botao Comprar Header Fixo',
				label: 'Comprar'
			});
		});
	}

	this.init();
});
