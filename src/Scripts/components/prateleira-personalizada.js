'use strict';

Nitro.module('prateleira-personalizada', function() {
	// Variables
	const self = this;
	const pageInitialSize = $(window).width();
	const responsiveSize = 769;

	// Start
	this.setup = function() {
		this.listaFuncionalidades();
		this.sliderProdutos();
		this.tagueamentoVitrinePersonalizada();
		this.tagueamentoVitrineComum();
	};

	// Listagem de funcionalidades
	this.listaFuncionalidades = () => {
		const $listaFuncionalidades = $('.lista-funcionalidades');

		responsiveSlickhelper($listaFuncionalidades, { arrows: true, dots: true });
	};

	// Slider prateleiras
	this.sliderProdutos = () => {
		const $prateleira = $('.prateleira-personalizada__prateleiras ul');

		responsiveSlickhelper($prateleira, { arrows: true, dots: false });
	};

	this.tagueamentoVitrinePersonalizada = () => {
		const $pratPersonalizada = $('.prateleira-personalizada__prateleiras');
		const $produtoLink       = $pratPersonalizada.find('.image, .prod-info');
		const $produtoVoltagem   = $pratPersonalizada.find('.sku__selector');
		const $produtoComprar    = $pratPersonalizada.find('.sku_buy');

		const getProductInfo = ($el, action, label) => {
			$el.click(function() {
				const $produtoBox = $(this).parents('.box-produto');
				const produtoNome = $produtoBox.find('.nome').text().replace(/[\s]+|Nome modelo prateleira/gim, ' ');
				const produtoId   = $produtoBox.data('idproduto');

				dataLayer.push({
					event: 'generic',
					category: `[SQUAD] Teste Vitrine Personalizada - Versão Controle - ${produtoNome} + ${produtoId}`,
					action: `${action}`,
					label: `${label}`
				});
			});
		};

		getProductInfo($produtoLink, 'Ir para o Produto', 'Link ir para o produto');
		getProductInfo($produtoVoltagem, 'Escolher Voltagem', 'Opção de Escolher Voltagem');
		getProductInfo($produtoComprar, 'Comprar Já', 'Botão Comprar Já');
	};

	this.tagueamentoVitrineComum = () => {
		const $vitrine = $('.prateleira-comum');
		const $produto = $vitrine.find('.box-produto');

		$produto.click(function() {
			const produtoNome = $(this).find('.nome').text().replace(/[\s]+|Nome modelo prateleira/gim, ' ');
			const produtoId   = $(this).data('idproduto');

			dataLayer.push({
				event: 'generic',
					category: `[SQUAD] Teste Vitrine Personalizada - Variante 1 - ${produtoNome} + ${produtoId}`,
					action: 'Ir para o Produto ',
					label: 'Link ir para o produto '
			});
		});
	};

	// Slick Helper
	const responsiveSlickhelper = ($element, objSlickConfig) => {
		if (pageInitialSize < responsiveSize) {
			$element.not('.slick-initialized').slick(objSlickConfig);
		}

		$(window).resize(() => {
			const widthPage = $(window).width();

			if (widthPage < responsiveSize) {
				$element.not('.slick-initialized').slick(objSlickConfig);
			} else {
				$element.hasClass('slick-initialized') && $element.slick('unslick');
			}
		});
	};

	self.setup();
});
