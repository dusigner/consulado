/* global $: true, Nitro: true */
'use strict';

// Layout id: lid=203f5a71-a3b8-401a-9823-2b28111c8512

Nitro.module('kit-instalacao', function() {
	// Variables
	const self = this;
	const $kitInstalacao = $('.kit-instalacao');
	const $gasType = $('.kit-instalacao__input');
	const $buyButton = $('.buy-button.buy-button-ref');
	const defaultProductLink = $buyButton.attr('href');

	console.log('$$$$$', $buyButton);
	console.log('buyButtonLink', defaultProductLink);

	this.init = () => {
		this.selectKitType();
		this.selectProducts();
	};

	// Selecione o tipo do kit
	this.selectKitType = () => {
		$gasType.on('change', (e) => {
			const selfKit = e.target;
			const collectionId = selfKit.value;
			const kitType = $(selfKit).attr('id');
			const productKit = $('.kit-product');

			if (!$kitInstalacao.hasClass(`kit-loaded-${collectionId}`)) {
				this.loadingAnimation();
				this.getProducts(collectionId, kitType);

				$kitInstalacao.addClass(`kit-loaded-${collectionId}`);
			}

			$kitInstalacao.attr('data-kittype', `${kitType}`);
			productKit.removeClass('is--active');

			this.showProducts(kitType);
			this.updateButtonLink(defaultProductLink);
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

	// Selecionar produtos
	this.selectProducts = () => {
		$kitInstalacao.on('click', '.kit-product.available', function() {
			const $selectSelf = $(this);
			const productSku = $selectSelf.data('sku');

			// Caso o clintete descelecione a o kit, voltamos o link para o padrão
			if ($selectSelf.hasClass('is--active')) {
				const defaultLink = defaultProductLink.replace(`${productSku}`, '');
				self.updateButtonLink(defaultLink);
			}
			else {
				const defaultLinkAndSku = `${defaultProductLink}${productSku}`;
				self.updateButtonLink(defaultLinkAndSku);
			}

			$selectSelf.toggleClass('is--active');
		});
	};

	// Atualizar link do botão
	this.updateButtonLink = (link) => {
		$buyButton.attr('href', link);
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
		const { productTitle, productReference } = product;
		const productSku = product.items[0].itemId;
		const productImage = product.items[0].images[0].imageUrl;
		let { AvailableQuantity, ListPrice, Price } = product.items[0].sellers[0].commertialOffer;

		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const kitTemplate = `
			<div class="kit-instalacao__content" data-kittype="${kitType}">
				<div class="kit-product ${AvailableQuantity ? 'available' : ''}" data-sku="&sku=${productSku}&qty=1&seller=1&redirect=true&sc=3">
					<div class="kit-product__item kit-product__item-image">
						<img src="${productImage}" alt="${productTitle}" />
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
							<input type="checkbox" name="product-${productSku}" id="product-${productSku}" />
							<label for="product-${productSku}" class="label"></label>
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
