/* global $: true, Nitro: true */
'use strict';

// Template ID: lid=f05c0b86-6c77-452d-967f-89be537888e0

Nitro.module('instagram-stories', function() {

	// Variables
	const self = this;
	const $stories = $('.stories');
	const $storiesItem = $stories.find('.stories-circle-list__item');
	const $storiesCard = $stories.find('.stories-card');

	const colecaoAntecipadasQA = 204;




	const $additionalProdBox = $('.produtos-adicionais');

	// Iniciar a aplicação
	this.init = () => {
		// Impedir que os stories levem para os links
		$storiesItem.click(function(e) {
			e.preventDefault();

			$storiesCard.addClass('is--open');
			self.getProducts(colecaoAntecipadasQA);
		});

	};


	// Busca todos os produtos da coleção
	this.getProducts = (clusterId) => {
		fetch(`/api/catalog_system/pub/products/search?fq=productClusterIds:${clusterId}`)
			.then(resp => resp.json())
			.then(data => this.printProducts(data))
			.then(() => {
				$('.stories-card-list').slick({
					// autoplay: true,
					// autoplaySpeed: 9000,
					appendDots: $('.stories-card__header'),
					infinite: false,
					arrows: true,
					dots: true,
					dotsClass: 'stories-card__marker',
				});
			})
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
		const $cardContainer = $('<ul class="stories-card-list"></ul>');

		products.map(product => {
			$cardContainer.append(this.instagramStoriesItem(product));
		});

		$storiesCard.append($cardContainer);

	};

	this.changeImageSize = imageTag => {
		const newImageSize = 350;
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
