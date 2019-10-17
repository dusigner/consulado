/* global $: true, Nitro: true */
'use strict';

// Template ID: lid=f05c0b86-6c77-452d-967f-89be537888e0

Nitro.module('instagram-stories', function() {

	// Variables
	const self = this;
	const $stories = $('.stories');
	const $closeStories = $('.stories-card__close');
	const $storiesItem = $stories.find('.stories-circle-list__item');
	const $storiesCard = $stories.find('.stories-card');
	const $loadingItem = $stories.find('.loading-container');

	// const colecaoAntecipadasQA = 204;
	const colecaoAntecipadasQA = 193;

	// Iniciar a aplicação
	this.init = () => {
		// Impedir que os stories levem para os links
		$storiesItem.click(function(e) {
			e.preventDefault();

			self.openStories();
			self.getProducts(colecaoAntecipadasQA);
		});

		$closeStories.click(() => self.openStories());
	};

	this.openStories = () => {
		$storiesCard.toggleClass('is--open');
	};

	this.startSlick = ($el) => {
		$($el).slick({
			appendDots: $('.stories-card__header'),
			infinite: false,
			arrows: true,
			dots: true,
			dotsClass: 'stories-card__marker',
		});
	};

	// Busca todos os produtos da coleção
	this.getProducts = (clusterId) => {
		fetch(`/api/catalog_system/pub/products/search?fq=productClusterIds:${clusterId}`)
			.then(resp => resp.json())
			.then(data => this.printProducts(data))
			.then(() => this.startSlick($('.stories-card-list')))
			.then(() => this.loadingAnimation())
			.catch(error => {
				console.error('#Error', error);
			});
	};

	// Animação de loading
	this.loadingAnimation = () => $loadingItem.toggleClass('is--loading');

	// Exibe os produtos
	this.printProducts = (data) => {
		const products = data;
		const $cardContainer = $('<ul class="stories-card-list"></ul>');

		products.map(product => {
			$cardContainer.append(this.instagramStoriesItem(product));
		});

		$storiesCard.append($cardContainer);

	};

	this.changeImageSize = imageTag => {
		const newImageSize = 300;
		let newImage = imageTag;
		newImage = newImage.replace('~', '');
		newImage = newImage.replace(/#\w+#/gmi, newImageSize);

		return newImage;
	}

	// Template a ser exibido na tela de produto
	this.instagramStoriesItem = (product) => {
		const { productTitle, productReference } = product;
		const { imageTag } = product.items[0].images[0];
		const newImage = this.changeImageSize(imageTag);
		let { AvailableQuantity, ListPrice, Price } = product.items[0].sellers[0].commertialOffer;


		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const prodTemplate = `
			<li class="stories-card-list__item ${AvailableQuantity ? 'available' : ''}">
				<div class="stories-card-list__image">
					${newImage}
				</div>

				<h2 class="stories-card-list__title">${productTitle} <strong>${productReference}</strong></h2>

				${AvailableQuantity ? `
					<div class="stories-card-list__prices">
						${ListPrice > Price ? `
							<p class="list-price">R$ ${ListPrice}</p>
						`: ''}
						<p class="best-price">R$ ${Price}</p>
					</div>

					<a href="#" class="button stories-card-list__cta" title="Detalhes do produto">
						Detalhes do produto
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
