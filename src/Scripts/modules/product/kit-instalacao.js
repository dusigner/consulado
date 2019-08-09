/* global $: true, Nitro: true */
'use strict';

Nitro.module('kit-instalacao', function() {
	// Variables
	const self = this;
	const $kitInstalacao = $('.kit-instalacao');
	const $gasType = $('.kit-instalacao__input');
	const $kitInstalacaoContainer = $('.kit-instalacao-container');

	// Selecione o tipo de gás
	this.selectGasType = () => {
		$gasType.on('change', (e) => {
			const cssClass = this.textToCssClass(e.target.value);

			if (!$kitInstalacao.hasClass('kit-loaded')) {
				this.loadingAnimation();
				this.getProducts();

				$kitInstalacao.addClass(`kit-loaded`);
			}

			$kitInstalacao.attr('data-gastype', `${cssClass}`);
		});
	};

	// Nomalizar o texto e retornalo com um padrao de css
	this.textToCssClass = (text) => {
		let gasClass = '';
		gasClass = text;
		gasClass = gasClass.toLowerCase();
		gasClass = gasClass.replace(/\s/, '-');
		gasClass = gasClass.replace(/[ãàáâ]/, 'a');

		return gasClass;
	};

	// Animação de loading...
	this.loadingAnimation = () => {
		$kitInstalacao.toggleClass('kit-is-loading');
	};

	// Busca todos os produtos da coleção
	this.getProducts = () => {
		fetch('/api/catalog_system/pub/products/search?fq=productClusterIds:1765')
			.then(resp => resp.json())
			.then(data => this.printProducts(data))
			.then(() => this.loadingAnimation())
			.catch(error => {
				this.printError();
				console.error('###Error', error);
			});
	};

	// Exibe os produtos na tela de produto
	this.printProducts = (data) => {
		const products = data;

		products.map(product => {
			$kitInstalacaoContainer.after(this.productKitTemplate(product));
		});
	};

	// Template a ser exibido na tela de produto
	this.productKitTemplate = (product) => {
		const { productId, productTitle, productReference } = product;
		const productImage = product.items[0].images[0].imageUrl;
		let { ListPrice, Price } = product.items[0].sellers[0].commertialOffer;

		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const kitTemplate = `
			<div class="kit-product product-${productId}">
				<div class="kit-product__item kit-product__item-image">
					<img src="${productImage}" alt="${productTitle}">
				</div>

				<div class="kit-product__item kit-product__item-title">
					<h2>${productTitle}</h2>
					<span>${productReference}</span>
				</div>

				<div class="kit-product__item kit-product__item-price">
					<div class="de">De R$ ${ListPrice}</div>
					<div class="por">Por R$ ${Price}</div>
				</div>

				<div class="kit-product__item kit-product__item-select">
					<input type="checkbox" name="product-${productId}" id="product-${productId}" />
					<label for="product-${productId}"></label>
				</div>

				<div class="kit-product__info">
					Conversão gratuita <i class="icon icon-question"></i>
				</div>
			</div>
		`;

		return kitTemplate;
	};

	// Template de erro
	this.printError = () => {
		const errorTemplate = `
			<div class="kit-instalacao__error">
				<p>Ops! Tivemos algum problema para carregar os produtos.</p>
				<button class="secondary-button">Tentar novamente</button>
			</div>
		`;

		$kitInstalacaoContainer.after(errorTemplate);
		this.handleError();
	};

	this.handleError = () => {
		const $kitError = $('.kit-instalacao__error');

		$kitError.find('button').click(() => {
			this.getProducts();
		});
	};

	self.selectGasType();
});
