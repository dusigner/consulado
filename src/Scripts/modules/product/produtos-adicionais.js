/* global $: true, Nitro: true */
'use strict';

// Template ID: lid=f05c0b86-6c77-452d-967f-89be537888e0

Nitro.module('produtos-adicionais', function() {
	// Variables
	const self = this;
	const $additionalProdBox = $('.produtos-adicionais');
	const $additionalProdTable = $('table.group.Produtos-adicionais');
	const $selectVoltage = $('.select-voltage');
	const $buyButton = $('.buy-button.buy-button-ref');
	let   defaultProdLink = $buyButton.attr('href');
	let   prodTypeName = '';

	// Iniciar a aplicação
	this.init = () => {
		const localData = this.getDOMInformation();
		const $prodBox = this.additionalProdTemplate(localData);

		$additionalProdBox.html($prodBox);

		this.selectProductType();
		this.selectSku();
		this.selectProducts();
	};

	// Pegar informações dos campos de cadastro da Vtex
	this.getFieldValue = selector => {
		return $additionalProdTable.find(`.value-field${selector}`).text();
	};

	// Pegar as informações no DOM
	this.getDOMInformation = () => {
		return {
			tituloGrupo       : this.getFieldValue('.titulo-do-grupo'),
			tituloTexto       : this.getFieldValue('.titulo-do-texto'),
			texto             : this.getFieldValue('.texto'),
			tipo01Text        : this.getFieldValue('.secao-01-tipo'),
			tipo01Produtos    : this.getFieldValue('.secao-01-produtos'),
			tipo01MensagensTit: this.getFieldValue('.secao-01-mensagens').split('|')[0],
			tipo01Mensagens   : this.getFieldValue('.secao-01-mensagens').split('|')[1],
			tipo02Text        : this.getFieldValue('.secao-02-tipo'),
			tipo02Produtos    : this.getFieldValue('.secao-02-produtos'),
			tipo02MensagensTit: this.getFieldValue('.secao-02-mensagens').split('|')[0],
			tipo02Mensagens   : this.getFieldValue('.secao-02-mensagens').split('|')[1],
			tipo01            : $.replaceSpecialChars(this.getFieldValue('.secao-01-tipo')),
			tipo02            : $.replaceSpecialChars(this.getFieldValue('.secao-02-tipo')),
		};
	};

	// Procura os produtos selecionados anteriormente e atualizam o link do botão comprar
	this.getActiveProducts = () => {
		const activeProducts = $additionalProdBox.find('.produto-adicional.available.is--active');
		let productsLink = '';

		activeProducts.each(function() {
			productsLink += $(this).data('sku');
		});

		self.updateButtonLink(defaultProdLink + productsLink);
	};

	// Busca todos os produtos da coleção
	this.getProducts = (prodRefCode, prodType) => {
		fetch(`/api/catalog_system/pub/products/search?${prodRefCode}`)
			.then(resp => resp.json())
			.then(data => this.printProducts(data, prodType))
			.then(() => this.loadingAnimation())
			.then(() => this.showProducts(prodType))
			.catch(error => {
				this.printError();
				console.error('#Error', error);
			});
	};

	// Template da seleção de produtos
	this.additionalProdTemplate = infoProduto => {
		const {
			tituloGrupo,
			tituloTexto,
			texto,
			tipo01,
			tipo01Text,
			tipo01Produtos,
			tipo01Mensagens,
			tipo01MensagensTit,
			tipo02,
			tipo02Text,
			tipo02Produtos,
			tipo02MensagensTit,
			tipo02Mensagens
		} = infoProduto;

		const template = `
			<strong class="produtos-adicionais__title specification">
				${tituloGrupo}
			</strong>

			<div class="skuList">
				<span>
					${tipo01 && tipo01.length > 0 ? `
						<input id="${tipo01}" value="${tipo01Produtos}" type="radio" name="prod-type" class="produtos-adicionais__input">
						<label for="${tipo01}" class="produtos-adicionais__label">
							${tipo01Text}
						</label>
					` : ''}

					${tipo02 && tipo02.length > 0 ? `
						<input id="${tipo02}" value="${tipo02Produtos}" type="radio" name="prod-type" class="produtos-adicionais__input">
						<label for="${tipo02}" class="produtos-adicionais__label">
							${tipo02Text}
						</label>
					` : ''}
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

			<section class="loading-container">
				<i class="icon-spinner"></i>
			</section>

			${tipo01Mensagens && tipo01Mensagens.length > 0 ? `
				<div class="produtos-adicionais__info" data-prodtype="${tipo01}"]>
					<strong>
						<i class="icon icon-question"></i>
						${tipo01MensagensTit}
					</strong>
					<p>${tipo01Mensagens}</p>
				</div>
			` : ''}

			${tipo02Mensagens && tipo02Mensagens.length > 1 ? `
				<div class="produtos-adicionais__info" data-prodtype="${tipo02}"]>
					<strong>
						<i class="icon icon-question"></i>
						${tipo02MensagensTit}
					</strong>
					<p>${tipo02Mensagens}</p>
				</div>
			` : ''}
		`;

		return template;
	};

	// Limpa e organiza os códigos de referência dos produtos para fazer a chamada da API
	this.clearProductId = (ids) => {
		let prodRefCode = '';
		prodRefCode = ids.replace(/\s+/gmi, '');
		prodRefCode = prodRefCode.split(',');

		if (prodRefCode.length > 1) {
			prodRefCode = prodRefCode.reduce((acc, curr) => {
				return `fq=alternateIds_RefId:${acc}` + `&fq=alternateIds_RefId:${curr}`;
			});
		} else {
			prodRefCode = `fq=alternateIds_RefId:${prodRefCode}`;
		}

		return prodRefCode;
	};

	// Selecione o tipo dos produtos
	this.selectProductType = () => {
		const $selectProdType = $additionalProdBox.find('.produtos-adicionais__input');

		$selectProdType.on('change', event => {
			const selfProd = event.target;
			const prodType = $(selfProd).attr('id');
			const prodRefCode = this.clearProductId(selfProd.value);
			const prodSelected = selfProd.value.replace(', ', '-');

			prodTypeName = $(`label[for="${prodType}"]`).text();

			if (!$additionalProdBox.hasClass(`prod-loaded-${prodSelected}`)) {
				this.loadingAnimation();
				this.getProducts(prodRefCode, prodType);

				$additionalProdBox.addClass(`prod-loaded-${prodSelected}`);
			}
			$additionalProdBox.attr('data-prodtype', `${prodType}`);

			this.resetProductBoxTemplate();
			this.showProducts(prodType);
			this.tagSelectType(prodTypeName);
		});
	};

	// Limpar os produtos selecionados anteriormente e volta o link do produto para o padrão.
	this.resetProductBoxTemplate = () => {
		const $productItem = $additionalProdBox.find('.produto-adicional');
		const $productCheckbox = $additionalProdBox.find('input[type=checkbox]');

		$productItem.removeClass('is--active');
		$productCheckbox.attr('checked', false);

		self.updateButtonLink(defaultProdLink);
	};

	// Animação de loading
	this.loadingAnimation = () => {
		$additionalProdBox.toggleClass('prod-is-loading');
	};

	// Exibe somente os produtos e informações da seção escolhida
	this.showProducts = (prodType) => {
		$(`.produtos-adicionais__content`).hide();
		$(`.produtos-adicionais__info`).hide();
		$(`.produtos-adicionais__content[data-prodtype="${prodType}"]`).show();
		$(`.produtos-adicionais__info[data-prodtype="${prodType}"]`).show();
	};

	// Ao trocar a voltagem, atualizar o link padrão do produto
	this.selectSku = () => {
		$selectVoltage.find('input').on('change', function() {
			setTimeout(() => { defaultProdLink = $buyButton.attr('href'); }, 1);
			setTimeout(() => { self.getActiveProducts(); }, 2);
		});
	};

	// Ao selecionar os produtos, atualiza o status ativo e chama a função de tagueamento
	this.selectProducts = () => {
		$additionalProdBox.on('click', '.produto-adicional.available', function() {
			const $selectSelf = $(this);
			const prodSku = $selectSelf.data('sku');
			const currentProdLink = $buyButton.attr('href');
			const prodName = $selectSelf.find('h2').text();
			const prodSkuId = $selectSelf.find('span').text();

			// Altera o link do botão comprar de acordo com os produtos adicionais selecionados
			if ($selectSelf.hasClass('is--active')) {
				const productLink = currentProdLink.replace(`${prodSku}`, '');
				self.updateButtonLink(productLink);
			}
			else {
				const defaultLinkAndSku = `${currentProdLink}${prodSku}`;
				self.updateButtonLink(defaultLinkAndSku);
			}

			$selectSelf.toggleClass('is--active');

			self.tagSelectProduct(prodName, prodSkuId, prodTypeName);
		});
	};

	// Atualizar link do botão
	this.updateButtonLink = (link) => {
		$buyButton.attr('href', link);
	};

	// Exibe os produtos
	this.printProducts = (data, prodType) => {
		const $container =  $additionalProdBox.find('.produtos-adicionais-container');
		const products = data;

		products.map(product => {
			$container.after(this.productBoxTemplate(product, prodType));
		});
	};

	// Template a ser exibido na tela de produto
	this.productBoxTemplate = (product, prodType) => {
		const { productTitle, productReference } = product;
		const productSku = product.items[0].itemId;
		const productImage = product.items[0].images[0].imageUrl;
		let { AvailableQuantity, ListPrice, Price } = product.items[0].sellers[0].commertialOffer;

		// Formatar o preço antes de exibir na tela
		ListPrice = _.formatCurrency(ListPrice);
		Price     = _.formatCurrency(Price);

		// Product Kit
		const prodTemplate = `
			<div class="produtos-adicionais__content" data-prodtype="${prodType}">
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

	// Taguemento do tipo de produto selecionado
	this.tagSelectType = (prodTypeName) => {
		dataLayer.push({
			event: 'generic',
			category: `[SQUAD] Kit de Instalação para ${prodTypeName}`,
			action: `Escolher tipo de gás ${prodTypeName}`,
			label: 'Step Selação do tipo de gás'
		});
	};

	// Taguemento dos produtos selecionados
	this.tagSelectProduct = (prodName, prodSkuId, prodTypeName) => {
		const productName = window.skuJson.name;
		const productId = skuJson.productId;

		dataLayer.push({
			event: 'generic',
			category: `[SQUAD] Produto: ${productName} - ${productId} + Produto Kit: ${prodName} - ${prodSkuId}`,
			action: `Clique na escolha do produto + Produto Kit: ${prodName} - ${prodSkuId} + ${prodTypeName} + Produto: ${productName} - ${productId}`,
			label: 'Step Clique na escolha do produto'
		});
	};

	// Template de erro
	this.printError = () => {
		const errorTemplate = `
			<div class="produtos-adicionais__error">
				<p>Ops! Tivemos algum problema para carregar os produtos.</p>
				<button class="secondary-button">Tentar novamente</button>
			</div>
		`;

		if (!$additionalProdBox.hasClass('prod-error')) {
			$additionalProdBox.append(errorTemplate);
		}

		$additionalProdBox.addClass('prod-error');
		this.handleError();
	};

	// Tenta carregar os produtos novamente em caso de erro na primeira chamada
	this.handleError = () => {
		const $kitError = $('.produtos-adicionais__error');

		$kitError.find('button').click(() => this.getProducts());
	};

	// Inicia a aplicação somente se encontrar itens cadastrados
	if ($additionalProdTable.length > 0) {
		self.init();
	}
});
