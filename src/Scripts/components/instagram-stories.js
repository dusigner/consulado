/* global $: true, Nitro: true */
'use strict';

// Template ID: lid=f62a7fcd-5794-4bcd-b26c-15862613d9fd

Nitro.module('instagram-stories', function() {

	// Variables
	const self = this;
	const $stories = $('.stories');
	const $closeStories = $('.stories-card__close');
	const $storiesItem = $stories.find('.stories-circle-list__item');
	const $storiesCard = $stories.find('.stories-card');
	const $loadingItem = $stories.find('.loading-container');
	const $cardTitle = $stories.find('.stories-card__title');
	let activeStorieId;

	// Iniciar a aplicação
	this.init = () => {
		$storiesItem.click(function(e) {
			e.preventDefault();

			const $thisElement = $(this);
			const cardTitle = $thisElement.data('storie-card-title');
			const collectionId = Number($thisElement.data('storie-card-collection-id'));
			const searchedCollection = $(`.stories-card-list[data-collection-id="${collectionId}"]`);
			activeStorieId = collectionId;

			self.openStories();
			self.updateCardTitle(cardTitle);

			// Se a coleção já foi pesquisada, evita que uma outra chamada à API seja feita.
			if (searchedCollection.length > 0) {
				return;
			}

			self.loadingAnimation();
			self.getProducts(collectionId)
				.then(data => self.printProducts(data, collectionId))
				.then(() => self.startSlick($(`.stories-card-list[data-collection-id="${collectionId}"]`)))
				.then(() => self.loadingAnimation());
		});

		$closeStories.click(function() {
			self.closeStories();
		});
	};

	// Abre o card dos Stories
	this.openStories = () => {
		$stories.find(`.stories-card__marker-${activeStorieId}`).show();
		$stories.find(`.stories-card-list[data-collection-id="${activeStorieId}"]`).show();
		$storiesCard.addClass('is--open');
	};

	// Fecha o card dos Stories
	this.closeStories = () => {
		$stories.find(`.stories-card__marker-${activeStorieId}`).hide();
		$stories.find(`.stories-card-list[data-collection-id="${activeStorieId}"]`).hide();
		$stories.find('.stories-card__error').remove();
		$storiesCard.removeClass('is--open');
	};

	// Animação de loading
	this.loadingAnimation = () => $loadingItem.toggleClass('is--loading');

	// Altera o tamanho da imagem padrão para o melhor tamanho para o mobile
	this.changeImageSize = image => {
		const newImageSize = 300;
		let imageWithNewSize = image;
		imageWithNewSize = imageWithNewSize.replace('~', '');
		imageWithNewSize = imageWithNewSize.replace(/#\w+#/gmi, newImageSize);

		return imageWithNewSize;
	};

	// Deixa o título no padrão desenhado po UI
	this.preparTitle = title => {
		let newTitle = title;
		newTitle = newTitle.replace('__', '<br />');
		newTitle = newTitle.replace(/#(.+)#/gmi, '<span>$1</span>');

		return newTitle;
	};

	// Atualiza o DOM com o título do Card
	this.updateCardTitle = title => $cardTitle.html(self.preparTitle(title));

	// Inicia o slic no template de Stories
	this.startSlick = ($el) => {
		$($el).slick({
			appendDots: $('.stories-card__header'),
			infinite: false,
			arrows: true,
			dots: true,
			dotsClass: `stories-card__marker-${activeStorieId}`,
		});
	};

	// Busca todos os produtos da coleção
	this.getProducts = (clusterId) => {
		const products = fetch(`/api/catalog_system/pub/products/search?fq=productClusterIds:${clusterId}`)
			.then(response => response.json())
			.catch(error => {
				console.error('#Error', error);
				self.loadingAnimation();
				self.errorMessage();
			});

		return products;
	};

	// Exibe os produtos
	this.printProducts = (productData, collectionId) => {
		const $cardContainer = $(`<ul class="stories-card-list" data-collection-id="${collectionId}"></ul>`);
		const products = productData;

		if (products.length === 0) {
			self.errorMessage();
			return;
		}

		products.map(product => {
			const currentProduct = product.productReference;
			let previewsSku = '';

			product.items.map((productSku, productIndex) => {
				const productIsAvailable = productSku.sellers[0].commertialOffer.AvailableQuantity;

				if (productIsAvailable && currentProduct !== previewsSku) {
					previewsSku = productSku.complementName;

					$cardContainer.append(self.instagramStoriesItem(product, productIndex));
				}
			});
		});

		$storiesCard.append($cardContainer);
	};

	// Pega as informações que o template de storiecard vai precisar
	this.instagramPrepareData = (product, productIndex) => {
		const { productTitle, productReference, link } = product;
		const { AvailableQuantity, ListPrice, Price } = product.items[productIndex].sellers[0].commertialOffer;
		const newImage = self.changeImageSize(product.items[productIndex].images[0].imageTag);

		// Formatar e verificar dados antes de exibir na tela
		const hasDiscount  = ListPrice > Price ? true : false;
		const newListPrice = _.formatCurrency(ListPrice);
		const newPrice     = _.formatCurrency(Price);

		return {
			productTitle,
			productReference,
			link,
			AvailableQuantity,
			newImage,
			hasDiscount,
			newListPrice,
			newPrice
		};
	};

	// Template do stories
	this.instagramStoriesItem = (product, productIndex) => {
		const {
			productTitle,
			productReference,
			link,
			AvailableQuantity,
			newImage,
			hasDiscount,
			newListPrice,
			newPrice,
		} = self.instagramPrepareData(product, productIndex);

		// Product Kit
		const storieCardTemplate = `
			<li class="stories-card-list__item ${AvailableQuantity ? 'available' : ''}">
				<div class="stories-card-list__image">
					${newImage}
				</div>

				<h2 class="stories-card-list__title">
					${productTitle} <strong>${productReference}</strong>
				</h2>

				${AvailableQuantity ? `
					<div class="stories-card-list__prices">
						${hasDiscount ? `<p class="list-price">R$ ${newListPrice}</p>` : ''}
						<p class="best-price">R$ ${newPrice}</p>
					</div>

					<a href="${link}" class="button stories-card-list__cta" title="Detalhes do produto">
						Detalhes do produto
					</a>
				` : `
					<div class="stories-card-list__item-unavailable">
						Produto indisponível
					</div>
				`}
			</li>
		`;

		return storieCardTemplate;
	};

	// Exibe mensagem de erro
	this.errorMessage = () => {
		const errorTemplate = `
			<div class="stories-card__error">
				<p>Infelizmente não conseguimos carregar os produtos dessa promoção.</p>
				<p><span> =( </span></p>
			</div>
		`;

		$storiesCard.append(errorTemplate);
	};

	// Inicia a aplicação somente se encontrar itens cadastrados
	if ($storiesItem.length > 0) {
		self.init();
	}
});
