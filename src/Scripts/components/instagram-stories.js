/* global $: true, Nitro: true */
'use strict';

// Template ID: lid=f05c0b86-6c77-452d-967f-89be537888e0

Nitro.module('instagram-stories', function() {

	// Variables
	const self = this;
	const $instaContainer = $('.shelf-category-home-container');
	const $additionalProdBox = $('.produtos-adicionais');

	// Iniciar a aplicação
	this.init = () => {

		$instaContainer.after('<div class="instagram-stories-container"></div>');
	};


	// Busca todos os produtos da coleção
	this.getProducts = (prodRefCode) => {
		fetch(`/api/catalog_system/pub/products/search?${prodRefCode}`)
			.then(resp => resp.json())
			.then(data => this.printProducts(data))
			.then(() => this.loadingAnimation())
			.catch(error => {
				console.error('#Error', error);
			});
	};

	// Animação de loading
	this.loadingAnimation = () => {
		$additionalProdBox.toggleClass('prod-is-loading');
	};

	// Exibe os produtos
	this.printProducts = (data) => {
		const products = data;

		products.map(product => {
			$instaContainer.before(this.instagramStoriesItem(product));
		});
	};

	// Template a ser exibido na tela de produto
	this.instagramStoriesItem = (product) => {
		const { productTitle, productReference } = product;
		const productSku = product.items[0].itemId;
		const productImage = product.items[0].images[0].imageUrl;
		let { AvailableQuantity, ListPrice, Price } = product.items[0].sellers[0].commertialOffer;

		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const prodTemplate = `
			<div class="produtos-adicionais__content">
				<div class="produto-adicional ${AvailableQuantity ? 'available' : ''}" data-sku="&sku=${productSku}&qty=1&seller=1&redirect=true&sc=3">
					<div class="produto-adicional__item produto-adicional__item-image">
						<img src="${productImage}" alt="${productTitle}" />
					</div>

					<div class="produto-adicional__item produto-adicional__item-title">
						<h2>${productTitle}</h2>
						<span>${productReference}</span>
					</div>

					${AvailableQuantity ? `
						<div class="produto-adicional__item produto-adicional__item-price">
							${ListPrice > Price ? `
								<div class="de">De R$ ${ListPrice}</div>
							`: ''}
							<div class="por">Por R$ ${Price}</div>
						</div>

						<div class="produto-adicional__item produto-adicional__item-select">
							<input type="checkbox" name="product-${productSku}" id="product-${productSku}" />
							<label for="product-${productSku}" class="label"></label>
						</div>
						` : `
						<div class="produto-adicional__item produto-adicional__item-unavailable">
							Produto indisponível
						</div>
						<div class="produto-adicional__item produto-adicional__item-select"></div>
					`}
				</div>
			</div>
		`;

		return prodTemplate;
	};

	// Inicia a aplicação somente se encontrar itens cadastrados
	// if ($additionalProdTable.length > 0) { }
	self.init();
});
