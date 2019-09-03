/* global $: true, Nitro: true */
'use strict';

// Layout id: lid=203f5a71-a3b8-401a-9823-2b28111c8512

Nitro.module('kit-instalacao', function() {
	// Variables
	const self = this;
	const $produtosAdicionaisContainer = $('.produtos-adicionais');
	const $produtosAdicionaisTable = $('table.group.Produtos-adicionais');

	const $productKit = $('.kit-product');
	const $buyButton = $('.buy-button.buy-button-ref');
	const defaultProductLink = $buyButton.attr('href');
	let kitTypeName = '';

	this.init = () => {
		const informacoesLocais = this.pegarInformacoesNaPagina();
		const $boxProdutosAdicionais = this.templateProdutosAdicionais(informacoesLocais);

		$produtosAdicionaisContainer.html($boxProdutosAdicionais);

		this.selectKitType();
		this.selectProducts();
	};

	// Pegar as informações no DOM
	this.pegarInformacoesNaPagina = () => {
		const tituloGrupo = $produtosAdicionaisTable.find('.value-field.titulo-do-grupo').text();
		const tituloTexto = $produtosAdicionaisTable.find('.value-field.titulo-do-texto').text();
		const texto       = $produtosAdicionaisTable.find('.value-field.texto').text();

		const tipo01Text      = $produtosAdicionaisTable.find('.value-field.secao-01-tipo').text();
		const tipo01Produtos  = $produtosAdicionaisTable.find('.value-field.secao-01-produtos').text();
		const tipo01Mensagens = $produtosAdicionaisTable.find('.value-field.secao-01-mensagens').text();

		const tipo02Text      = $produtosAdicionaisTable.find('.value-field.secao-02-tipo').text();
		const tipo02Produtos  = $produtosAdicionaisTable.find('.value-field.secao-02-produtos').text();
		const tipo02Mensagens = $produtosAdicionaisTable.find('.value-field.secao-02-mensagens').text();

		return {
			tituloGrupo     : tituloGrupo,
			tituloTexto     : tituloTexto,
			texto           : texto,
			tipo01          : $.replaceSpecialChars(tipo01Text),
			tipo01Text      : tipo01Text,
			tipo01Produtos  : tipo01Produtos,
			tipo01Mensagens : tipo01Mensagens,
			tipo02          : $.replaceSpecialChars(tipo02Text),
			tipo02Text      : tipo02Text,
			tipo02Produtos  : tipo02Produtos,
			tipo02Mensagens : tipo02Mensagens
		};
	};

	// Template da seleção de produtos
	this.templateProdutosAdicionais = (infoProduto) => {
		const {
			tituloGrupo,
			tituloTexto,
			texto,
			tipo01,
			tipo01Text,
			tipo01Produtos,
			tipo01Mensagens,
			tipo02,
			tipo02Text,
			tipo02Produtos,
			tipo02Mensagens
		} = infoProduto;

		const template = `
			<strong class="produtos-adicionais__title specification">
				${tituloGrupo}
			</strong>

			<div class="skuList">
				<span>
					${tipo01.length ? `
						<input id="${tipo01}" value="${tipo01Produtos}" type="radio" name="kit-type" class="produtos-adicionais__input">
						<label for="${tipo01}" class="produtos-adicionais__label">
							${tipo01Text}
						</label>
						` : ''
					}

					${tipo02.length ? `
						<input id="${tipo02}" value="${tipo02Produtos}" type="radio" name="kit-type" class="produtos-adicionais__input">
						<label for="${tipo02}" class="produtos-adicionais__label">
							${tipo02Text}
						</label>
						` : ''
					}
				</span>
			</div>

			<div class="produtos-adicionais-container">
				<strong class="produtos-adicionais__title">
					${tituloTexto}
				</strong>
				<p class="produtos-adicionais__description">
					${texto}
				</p>
			</div>

			${tipo01Mensagens.length ? `
				<div class="produtos-adicionais__info" data-kittype="${tipo01}"]>
					<strong>
						<i class="icon icon-question"></i>
						Conversão gratuita
					</strong>
					<p>${tipo01Mensagens}</p>
				</div>
				` : ''
			}

			${tipo02Mensagens.length ? `
				<div class="produtos-adicionais__info" data-kittype="${tipo02}"]>
					<strong>
						<i class="icon icon-question"></i>
						Conversão gratuita
					</strong>
					<p>${tipo02Mensagens}</p>
				</div>
				` : ''
			}

			<section class="loading-container"><i class="icon-spinner"></i></section>
		`;

		return template;
	};

	// Limpa e organiza os ids dos produtos para a API
	this.limpaIdProdutos = (ids) => {
		let codigoRefProduto = '';
		codigoRefProduto = ids.replace(/\s+/gmi, '');
		codigoRefProduto = codigoRefProduto.split(',');

		if (codigoRefProduto.length > 1) {
			codigoRefProduto = codigoRefProduto.reduce((acc, curr) => {
				return `fq=alternateIds_RefId:${acc}` + `&fq=alternateIds_RefId:${curr}`;
			});
		} else {
			codigoRefProduto = `fq=alternateIds_RefId:${codigoRefProduto}`;
		}

		return codigoRefProduto;
	};

	// Selecione o tipo do kit
	this.selectKitType = () => {
		const $selectProdType = $produtosAdicionaisContainer.find('.produtos-adicionais__input');

		$selectProdType.on('change', (e) => {
			const selfProd = e.target;
			const codigoRefProduto = this.limpaIdProdutos(selfProd.value);
			const prodType = $(selfProd).attr('id');
			kitTypeName = $(`label[for="${prodType}"]`).text();

			if (!$produtosAdicionaisContainer.hasClass(`kit-loaded-${codigoRefProduto}`)) {
				this.loadingAnimation();
				this.getProducts(codigoRefProduto, prodType);

				$produtosAdicionaisContainer.addClass(`kit-loaded-${codigoRefProduto}`);
			}

			$produtosAdicionaisContainer.attr('data-kittype', `${prodType}`);
			$productKit.removeClass('is--active');

			this.showProducts(prodType);
			this.updateButtonLink(defaultProductLink);
			// this.tagSelectType(kitTypeName);
		});
	};

	// Taguemento
	this.tagSelectType = (kitTypeName) => {
		dataLayer.push({
			event: 'generic',
			category: `[SQUAD] Kit de Instalação para ${kitTypeName}`,
			action: `Escolher tipo de gás ${kitTypeName}`,
			label: 'Step Selação do tipo de gás'
		});
	};

	this.tagSelectProduct = (kitName, kitSkuId, kitTypeName) => {
		const productName = window.skuJson.name;
		const productId = skuJson.productId;

		dataLayer.push({
			event: 'generic',
			category: `[SQUAD] Produto: ${productName} - ${productId} + Produto Kit: ${kitName} - ${kitSkuId}`,
			action: `Clique na escolha do produto + Produto Kit: ${kitName} - ${kitSkuId} + ${kitTypeName} + Produto: ${productName} - ${productId}`,
			label: 'Step Clique na escolha do produto'
		});
	};

	// Animação de loading...
	this.loadingAnimation = () => {
		$produtosAdicionaisContainer.toggleClass('kit-is-loading');
	};

	// Mostrar somente produtos ativos
	this.showProducts = (kitType) => {
		$(`.kit-instalacao__content`).hide();
		$(`.produtos-adicionais__info`).hide();
		$(`.kit-instalacao__content[data-kittype="${kitType}"]`).show();
		$(`.produtos-adicionais__info[data-kittype="${kitType}"]`).show();
	};

	// Selecionar produtos
	this.selectProducts = () => {
		$produtosAdicionaisContainer.on('click', '.kit-product.available', function() {
			const $selectSelf = $(this);
			const productSku = $selectSelf.data('sku');
			const actualProductLink = $buyButton.attr('href');

			const kitName = $selectSelf.find('h2').text();
			const kitSkuId = $selectSelf.find('span').text();

			// Caso o clintete descelecione a o kit, voltamos o link para o padrão
			if ($selectSelf.hasClass('is--active')) {
				const productLink = actualProductLink.replace(`${productSku}`, '');
				self.updateButtonLink(productLink);
			}
			else {
				const defaultLinkAndSku = `${actualProductLink}${productSku}`;
				self.updateButtonLink(defaultLinkAndSku);
			}

			$selectSelf.toggleClass('is--active');

			self.tagSelectProduct(kitName, kitSkuId, kitTypeName);
		});
	};

	// Atualizar link do botão
	this.updateButtonLink = (link) => {
		$buyButton.attr('href', link);
	};

	// Busca todos os produtos da coleção
	this.getProducts = (collectionId, kitType) => {
		fetch(`/api/catalog_system/pub/products/search?${collectionId}`)
			.then(resp => resp.json())
			.then(data => this.printProducts(data, kitType))
			.then(() => this.loadingAnimation())
			.then(() => this.showProducts(kitType))
			.catch(error => {
				this.printError();
				console.error('#Error', error);
			});
	};

	// Exibe os produtos na tela de produto
	this.printProducts = (data, kitType) => {
		const $container =  $produtosAdicionaisContainer.find('.produtos-adicionais-container');
		const products = data;

		products.map(product => {
			$container.after(this.productKitTemplate(product, kitType));
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

		if (!$produtosAdicionaisContainer.hasClass('kit-error')) {
			$produtosAdicionaisContainer.append(errorTemplate);
		}

		$produtosAdicionaisContainer.addClass('kit-error');
		this.handleError();
	};

	this.handleError = () => {
		const $kitError = $('.kit-instalacao__error');

		$kitError.find('button').click(() => {
			this.getProducts();
		});
	};


	if ($produtosAdicionaisTable.length > 0) {
		self.init();
	}
});
