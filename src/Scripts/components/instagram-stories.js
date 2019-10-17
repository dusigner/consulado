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
		this.getProducts();
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
		const $instagramConainer = $('<div class="instagram-stories-container"></div>');

		products.map(product => {
			$instagramConainer.append(this.instagramStoriesItem(product));
		});

		$instaContainer.after($instagramConainer);

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
			<li class="stories-card-list__item ${AvailableQuantity ? 'available' : ''}">
				<div class="stories-card-list__actions">
					<div class="stories-card-list__counter"></div>
					<button class="stories-action stories-prev">Voltar</button>
					<button class="stories-action stories-next">Avançar</button>
				</div>

				<div class="stories-card-list__image">
					<img src="${productImage}" alt="${productTitle}" />
				</div>

				<h2 class="stories-card-list__title">${productTitle} <span>${productReference}</span></h2>

				${AvailableQuantity ? `
					<div class="stories-card-list__prices">
						${ListPrice > Price ? `
							<p class="list-price">De R$ ${ListPrice}</p>
						`: ''}
						<p class="best-price">Por R$ ${Price}</p>
					</div>

					<a href="#" class="button stories-card-list__cta" title="Comprar">
						Ver produto
					</a>
					` : `
					<div class="stories-card-list__item-unavailable">
						Produto indisponível
					</div>
				`}
			</li>
		`;

		return prodTemplate;
	};

	// Inicia a aplicação somente se encontrar itens cadastrados
	// if ($additionalProdTable.length > 0) { }
	self.init();
});
