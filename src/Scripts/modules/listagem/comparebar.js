'use strict';

//import  Modal from 'components/_modal';
require('vendors/vtex-modal');

Nitro.module('comparebar', function() {
	var $compareBar         = $('.compare-bar');
	var $btnComparar        = $('.js-compare-btn-compare');
	var $btnLimpar          = $('.js-compare-btn-limpar');
	var $btnAbrirBarra      = $('.js-compare-bar');
	var $qtdSelecionada     = $('.js-compare-selected-quantity');
	var categoryTitle       = $('.titulo-sessao:visible').text();
	var $categotyText       = $('.compare-bar__category');
	var $maxQuantity        = $('.js-compare-max-quantity');
	var self                = this;
	var $compareBarProducts = $('.compare-bar-products .grid-middle-3_sm-1');

	var $productsDefaultTemplate = 
		'<div class="compare-bar__product col">'+
			'<div class="compare-bar__product-close js-remove-item"></div>'+
			'<div class="compare-bar__product-image"></div>'+
			'<div class="compare-bar__product-name"></div>'+
		'</div>';

	var itensToCompare = [];
	var productsData   = [];
	var maxProductsToCompare;
	var $removeProduct;
	var template;
	var url;

	window.alert = function(e){
		console.error(e);
		return;
	};

	this.init = function(){
		this.setMaxQuantity();
		this.triggerClick();
		this.updateCategory();
		this.toggleBar();
		
		setTimeout(function(){
			self.setInputs();
		}, 100);

		$productsDefaultTemplate = $productsDefaultTemplate + $productsDefaultTemplate + $productsDefaultTemplate;
		$compareBarProducts.html( $productsDefaultTemplate );

		$btnLimpar.click( this.clearProducts );
		$btnComparar.click( this.redirectToCompare );
	};

	// Verifica se a resolução é de mobile
	this.isMobile = function(){
		if ( $(window).width() <= 768 ) {
			return true;
		}
		return false;
	};

	// seleciona os produtos que vieram ja setados para comparar
	this.setInputs = function(){
		var newsIds = localStore.get('comparador');

		if(newsIds) {
			newsIds.forEach(function(val){
				var product = $('#prateleira .compare-product-checkbox[rel='+val.rel+']');
				if (val.category === window.vtxctx.categoryName) {
					if( product.length > 0 ) {
						//product.trigger('click');
						product.addClass('selected');
						self.verifyClass(product);
					} else {
						self.addProductsInfo(val.rel, val.image, val.title, val.category);
		
						self.addProductsToCompare(itensToCompare, val.rel);
					}
				}
				// else {
				// 	localStore.remove('comparador');
				// }
			});
		}
	};

	// Configura a quantidade máxima de produtos comparáveis
	// à parir da resolução da tela do usuário
	this.setMaxQuantity = function(){
		maxProductsToCompare = this.isMobile() ? 2 : 3;
		$maxQuantity.text( maxProductsToCompare );
	};

	this.verifyClass = function(element) {
		var product = element;
		self.selectProductsToCompare(product);
	};

	this.triggerClick = function() {
		$(document).on('click', '.btn-comparar label', function(){
			var element = $(this).parent().find('.compare-product-checkbox'),
				skuProduto = $(this).parent('.box-produto').find('.nome .product-field ul li').text();
			element.toggleClass('selected');
			dataLayer.push({event: 'generic', category: 'Categoria', action: 'Comparador de Produtos', label: skuProduto});
			self.verifyClass(element);
		});
	};

	// Seleciona os produtos para comparação
	this.selectProductsToCompare = function(element){
		var item = element;
		var actualItem = item.attr('rel');
		var actualItemInArray = itensToCompare.indexOf( actualItem );

		var thisProduct = item.parents('.box-produto');
		var imgWay = thisProduct.find('.image .main img').length > 0 ? '.image .main img' : '.image .backup img';
		var thisImage = thisProduct.find(imgWay).attr('src');
		var thisTitle = thisProduct.find('.nome').text();
		var category = window.vtxctx.categoryName;


		item.hasClass('selected') ? item.parent().find('label').text('Selecionado') : item.parent().find('label').text('Comparar produto');

		// Remove o item caso ele já exista no array
		if ( actualItemInArray !== -1 ) {
			item.removeClass('selected').parent().find('label').text('Comparar produto');
			self.removeIfExist(actualItemInArray, itensToCompare);
			self.removeIfExist(actualItemInArray, productsData);
			return;
		}

		// Não marcar o check se já tivermos 3 produtos selecionados
		if ( itensToCompare.length === maxProductsToCompare ) {
			item.removeClass('selected').parent().find('label').text('Comparar produto');
			item.removeClass('selected');
			self.initCompareModal();
			return;
		}


		// Insere as informações do item atual no objeto de template
		self.addProductsInfo(actualItem, thisImage, thisTitle, category);

		// Insere item atual no array de produtos para comparar
		self.addProductsToCompare(itensToCompare, actualItem);
	};

	this.updateProduct = function(){
		$compareBarProducts.html();
		$compareBarProducts.html( $productsDefaultTemplate );

		var productContainer = document.querySelectorAll('.compare-bar__product');

		productsData.map(function( item, index ) {
			template = 
				'<div class="compare-bar__product-close js-remove-item" data-text="'+item.title+'" data-rel="'+item.rel+'"></div>'+
				'<div class="compare-bar__product-image">'+
					'<img src="'+item.image+'" alt="'+item.title+'" />'+
				'</div>'+
				'<div class="compare-bar__product-name">'+item.title+'</div>';

			var product = $( productContainer[ index ] );

			product
				.addClass('-has-product')
				.html(template);
		});
	};

	// Adiciona informações dos produtos para o template da barra de comparação
	this.addProductsInfo = function( thisRel, thisImage, thisTitle , thisCategory ){
		productsData.push({
			rel   	: thisRel,
			image 	: thisImage,
			title 	: thisTitle,
			category: thisCategory
		});
	};

	// Adiciona produtos na lista de comparação
	this.addProductsToCompare = function( addTo, itemsToAdd ){
		addTo.push( itemsToAdd );
		self.updateBar();
	};

	// Remove produtos da lista de comparação
	this.removeProductsToCompare = function( product ){
		var itemToRemove = itensToCompare.indexOf(String( product ));

		if ( itemToRemove !== -1 ) {
			self.removeIfExist(itemToRemove, itensToCompare);
			self.removeIfExist(itemToRemove, productsData);
		}

		$('input[rel="'+product+'"]').removeClass('selected');
	};

	// Remove itens de um array
	// Atualiza a barra de comparação
	this.removeIfExist = function( itemToRemove, removeFrom ){
		removeFrom.splice( itemToRemove, 1);
		self.updateBar();
	};

	// Remove todos os produtos da lista de comparação
	// Fecha a barra de comparação
	this.clearProducts = function(){
		window.selectedForComparison = [];
		itensToCompare = [];
		productsData = [];
		url = '';
		localStore.remove('comparador');

		dataLayer.push({event: 'generic', category: 'Categoria', action: 'Comparador de Produtos', label: 'Botão Limpar'});

		$('input.compare-product-checkbox').removeClass('selected').parent().find('label').text('Comparar produto');
		self.openBar();
	};

	// Verifica a quantidade de iten para comparação e libera o botão de comparar
	this.updateButton = function(){
		var allProducts = itensToCompare.join(';').toString();
		url = '/compare?refp=' + allProducts + '&ReturnUrl=' + document.location.origin + document.location.pathname;

		if ( itensToCompare.length >= 2 ) {
			$btnComparar.removeClass('disabled');
		}
		else {
			$btnComparar.addClass('disabled');
		}
	};

	// atualiza localstor conforme interações na pagina
	this.updateStore = function(){
		localStore.set('comparador', productsData);
	};

	// Com o mínimo de produtos selecionados, direciona
	// o usuário para a página de comparação
	this.redirectToCompare = function() {
		if ( !$(this).hasClass('disabled') ) {
			dataLayer.push({event: 'generic', category: 'Categoria', action: 'Comparador de Produtos', label: 'Botão Comparar'});
			document.location.href = url;
		}
	};

	// Abrir a barra quando tivermos produtos para comparar
	this.openBar = function(){
		if ( itensToCompare.length > 0 ) {
			$compareBar.addClass('-is--active');
		}
		else {
			$compareBar.removeClass('-is--active');
		}
	};

	// Controla o tamanho da barra
	this.toggleBar = function(){
		$btnAbrirBarra.click(function() {
			$compareBar.toggleClass('-is--closed');
		});
	};

	// Atualiza a quantidade de itens selecionados
	this.updateQuantity = function(){
		$qtdSelecionada.text( itensToCompare.length );
	};

	// Atualiza o texto que informa a categoria de comparação
	this.updateCategory = function(){
		$categotyText.text( categoryTitle );
	};

	// Modal que exibe a quantidade máxima permitida para comparação
	this.initCompareModal = function(){
		$('.js-modal-compare').vtexModal();

		// Adiciona a opção de fechar o modal
		$('.js-close-compare-modal').on('click', function() {
			$('.vtex-modal .close').trigger('click');
		});
	};

	// Atualiza a barra de produtos para comparação
	this.updateBar = function(){
		self.openBar();
		self.updateProduct();
		self.updateQuantity();
		self.updateButton();
		self.updateStore();

		$removeProduct = $('.js-remove-item');
		$removeProduct.click(function() {
			var productId = $(this).data('rel');
			dataLayer.push({event: 'generic', category: 'Categoria', action: 'Comparador de Produtos', label: 'Remover produto'});
			$('#prateleira').find('input[rel='+productId+']').parent().find('label').text('Comparar produto').removeClass('selected');
			self.removeProductsToCompare( productId );
		});
	};

	this.init();
});
