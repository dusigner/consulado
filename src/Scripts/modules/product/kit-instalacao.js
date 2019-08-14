/* global $: true, Nitro: true */
'use strict';

// Layout id: lid=203f5a71-a3b8-401a-9823-2b28111c8512

Nitro.module('kit-instalacao', function() {
	// Variables
	const self = this;
	const $kitInstalacao = $('.kit-instalacao');
	const $gasType = $('.kit-instalacao__input');

	this.init = () => {
		this.selectKitType();
	};

	// Selecione o tipo de gás
	this.selectKitType = () => {
		$gasType.on('change', (e) => {
			const self = e.target;
			const collectionId = self.value;
			const kitType = $(self).attr('id');

			if (!$kitInstalacao.hasClass(`kit-loaded-${collectionId}`)) {
				this.loadingAnimation();
				this.getProducts(collectionId, kitType);

				$kitInstalacao.addClass(`kit-loaded-${collectionId}`);
			}

			$kitInstalacao.attr('data-kittype', `${kitType}`);

			this.showProducts(kitType);
		});
	};

	// Animação de loading...
	this.loadingAnimation = () => {
		$kitInstalacao.toggleClass('kit-is-loading');
	};

	// Mostrar somente produtos ativos
	this.showProducts = (kitType) => {
		$(`.kit-instalacao__content`).hide();
		$(`.kit-instalacao__content[data-kittype="${kitType}"]`).show();
	};

	this.selectProducts = () => {
		const $product = $('input[type="checkbox"]');

		$product.on('change', function() {
			$(this).parents('.kit-product').toggleClass('is--active');
			console.log('Click');
		});

	};

	// Busca todos os produtos da coleção
	this.getProducts = (collectionId, kitType) => {
		fetch(`/api/catalog_system/pub/products/search?fq=productClusterIds:${collectionId}`)
			.then(resp => resp.json())
			.then(data => {
				console.log(data);
				this.printProducts(data, kitType);
			})
			.then(() => this.loadingAnimation())
			.then(() => {
				this.showProducts(kitType);
				this.selectProducts();
			})
			.catch(error => {
				this.printError();
				console.error('#Error', error);
			});
	};

	// Exibe os produtos na tela de produto
	this.printProducts = (data, kitType) => {
		const products = data;

		products.map(product => {
			$kitInstalacao.append(this.productKitTemplate(product, kitType));
		});
	};

	// Template a ser exibido na tela de produto
	this.productKitTemplate = (product, kitType) => {
		const { productId, productTitle, productReference } = product;
		const productImage = product.items[0].images[0].imageUrl;
		let { AvailableQuantity, ListPrice, Price } = product.items[0].sellers[0].commertialOffer;

		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const kitTemplate = `
			<div class="kit-instalacao__content" data-kittype="${kitType}">
				<label for="product-${productId}">
					<div class="kit-product product-${productId}">
						<div class="kit-product__item kit-product__item-image">
							<img src="${productImage}" alt="${productTitle}">
						</div>

						<div class="kit-product__item kit-product__item-title">
							<h2>${productTitle}</h2>
							<span>${productReference}</span>
						</div>

						${AvailableQuantity ? `
							<div class="kit-product__item kit-product__item-price">
								<div class="de">De R$ ${ListPrice}</div>
								<div class="por">Por R$ ${Price}</div>
							</div>

							<div class="kit-product__item kit-product__item-select">
								<input type="checkbox" name="product-${productId}" id="product-${productId}" />
								<div class="label"></div>
							</div>
							` : `
							<div class="kit-product__item kit-product__item-unavailable">
								Produto indisponível
							</div>
							<div class="kit-product__item kit-product__item-select"></div>
						`}

						<div class="kit-product__info">
							Conversão gratuita <i class="icon icon-question"></i>
						</div>
					</div>
				</label>
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

		$kitInstalacao.append(errorTemplate);
		this.handleError();
	};

	this.handleError = () => {
		const $kitError = $('.kit-instalacao__error');

		$kitError.find('button').click(() => {
			this.getProducts();
		});
	};

	self.init();
});
