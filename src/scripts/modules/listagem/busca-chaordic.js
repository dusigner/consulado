'use strict';

// Dust Templates
require('templates/chaordic/resultado-chaordic.html');
require('templates/chaordic/suggestions-chaordic.html');
require('templates/chaordic/orderby-chaordic.html');
require('templates/chaordic/filters-chaordic.html');
require('templates/chaordic/prateleira-busca-chaordic.html');
require('templates/chaordic/pagination-chaordic.html');

var Uri = require('vendors/Uri');
// var filters = require('modules/listagem/filters');

dust.helpers.eq = function(chunk, context, bodies, params) {
	var location 	= params.key,
		value 		= params.value,
		body 		= bodies.block;

	if (location === value) {
		chunk.render(body, context);
	}
	
	return chunk; 
};

/**
 * @function sanitize
 * Receives a value as a parameter and convert it to lowercase
 * @param {String} value 
 * @returns value with all chars in lowercase
 */
dust.filters.sanitize = function(value) {
	return $.replaceSpecialChars(value).toLowerCase();
};

Nitro.module('busca-chaordic', function () {
	var self = this;

	var uriBusca = new Uri(window.location.href),
		// parametros 	= uriBusca.query(),
		term 		= uriBusca.getQueryParamValues('q'),
		filters 	= uriBusca.getQueryParamValues('filter'), 
		sortby 		= uriBusca.getQueryParamValues('sortBy'),
		sortbyName  = sortby,

		$header 				= $('.resultado-wrapper'),
		$suggestions 			= $('.suggestions-container'),
		$orderby 				= $('#prateleira.list-container .order-wrapper'),
		$filters 				= $('.result-filter .filter-container'),
		$prateleira 			= $('.list-content .vitrine .prateleira.default.n12colunas ul'),
		$prateleiraContainer 	= $('#prateleira'),
		$pagination 			= $prateleiraContainer.find('.paginationSearch');
		// $filterWrapper 			= $('.filter-container div.filter-wrapper');

	/**
	 * 
	 * @function getChaordicData
	 * Receveis a term and init a ajax call using GET method on Chaordic API
	 * @param {String} $termSearch 
	 * @returns an object using Chaordic API with product information
	 */
	this.getChaordicData = function($termSearch) {
		$prateleiraContainer.addClass('loading');
			
		return $.ajax({
			url: '//busca.consul.com.br' + $termSearch, // URL utilizada anteriormente: consul.neemu.com' + $termSearch
			type: 'GET',
			dataType: 'JSON'
		}).done(function() {
			$prateleiraContainer.removeClass('loading');
		}).error(function() {
			// Show the no result statement
			if ($('.result-filter.container h2').length <=0 ){
				$prateleiraContainer.removeClass('loading');
				$('body').addClass('busca-vazio');
				$('#prateleira').remove();
				$('.filter-container, .order-wrapper').css('display', 'none');
				$('.result-filter.container').append('<h2><strong>Ops...Não encontramos nenhum</strong><br/>produto relacionado à sua busca.</h2><div class="nm-not-found-tips-container"><h3 class="nm-not-found-tip-title"> Mas não precisa desanimar! Quer uma dica? </h3><ul><li class="nm-not-found-tip">Verifique se a palavra foi digitada corretamente</li><li class="nm-not-found-tip">Tente buscar por palavras-chave diferentes</li><li class="nm-not-found-tip">Faça buscas relacionadas</li></ul></div>');
				setTimeout(function(){
					$('.resultado-busca .resultado-wrapper').html('<span>Você buscou por:<br/> <strong class="noresult">"'+ term +'"</strong></span>');
				},10);
			}
		});
	};
	
	this.getChaordicDataPagination = function($termSearch) {
		// $prateleiraContainer.addClass('loading');
			
		return $.ajax({
			url: '//busca.consul.com.br' + $termSearch, // URL utilizada anteriormente: consul.neemu.com' + $termSearch
			type: 'GET',
			dataType: 'JSON'
		}).done(function() {
			// $('#prateleira').removeClass('loading');
			// $('html, body').animate({
			// 	scrollTop: $('.duvidas-frequentes').offset().top
			// }, 700);
		});
	};
		
	this.render = function(template, data, el) {
		dust.render(template, data, function (err, out) {
			el.html(out);
		});
	};
	
	this.getTermSearch = function(){	
		var $termSearch = term,
			$paramFilter = filters,
			$qtdFilter = $paramFilter.length,
			$resultFilter = '';

		if ($qtdFilter >= 1) {
			for(var i = 0 ; i < $qtdFilter; i++) {
				$resultFilter = $resultFilter + '&filter=' + $paramFilter[i];
			}
		}

		if (sortby !== '') {
			sortby = '&sortby=' + sortby;
		}

		$termSearch = '/searchapi/v3/search?apikey=consul&terms=' + $termSearch + $resultFilter + sortby;

		return $termSearch;
	};

	this.pagination = function() {
		$('#list-more-products').on('click', function(e) {
			e.preventDefault();
			// console.log('clicou no VER MAIS');
			var $termPagination = $('#list-more-products').attr('rel');
			// console.log('$termPagination', $termPagination);
			
			self.getChaordicDataPagination($termPagination).always(function(data) {
				dust.render('prateleira-busca-chaordic', data, function(err, out) {
					$prateleira.append(out);
				});
				
				self.render('pagination-chaordic', data, $pagination);
				self.priceFlags();
			}).done(function() {
				self.pagination();
			});
		});
	};

	this.dropDown = function() {
		$('.search-multiple-navigator fieldset.even').find('h5').click(function () {
			$(this).toggleClass('closed');
			$(this).next('div').slideToggle();
		});

	};

	this.orderBy = function() {
		// console.log(sortbyName[0]);
		switch (sortbyName[0]) {
		case 'ascPrice':
			$('.order-title em').html('Menor Preço');
			break;
		case 'descPrice':
			$('.order-title em').html('Maior Preço');
			break;
		case 'descSold':
			$('.order-title em').html('Mais Vendidos');
			break;
		case 'descDate':
			$('.order-title em').html('Data de lançamento');
			break;
		case 'descDiscount':
			$('.order-title em').html('Melhor Desconto');
			break;

		default:
			$('.order-title em').html('selecione');
			break;
		}

		$('.order-wrapper .order-title').on('click', function () {
			$(this).find('strong').toggleClass('active');
			$(this).next('ul').slideToggle();
		});

		$('ul.order-by li a').on('click', function() {
			//variavel armazena qual tipo de ordenação foi selecionado
			var $dataOrder = $(this).attr('data-order');
			// Variavel armazena chave da API atual
			// var $relOrder = $(this).attr('rel');
			//pegando link rel da api no input
			var $termFilter = $(this).attr('rel');
			//pegando o nome da Ordenação
			var $orderName = $(this).attr('title');
			
			$termFilter =  '//busca.consul.com.br' + $termFilter;
			
			var apiBusca = new Uri($termFilter),
				// apiParametros 	= apiBusca.query(),
				apiTerm 		= apiBusca.getQueryParamValues('terms'), //term
				apiFilters 		= apiBusca.getQueryParamValues('filter'); // array filters
				// apiSortby 		= apiBusca.getQueryParamValues('sortBy'); // sortBy

			//separando parametros de Filter e concatenando para montar URL
			var $paramFilter = apiFilters;
			var $qtdFilter = $paramFilter.length;
			var $resultFilter = '';
			if($qtdFilter >= 1){
				for(var i=0 ; i< $qtdFilter; i++){
					$resultFilter = $resultFilter+'&filter='+$paramFilter[i];
				}
			}

			$termFilter = '/searchapi/v3/search?apikey=consul&terms=' +apiTerm + $resultFilter + $dataOrder;
		
			window.history.pushState('','', '?q='+term+$resultFilter+$dataOrder);
			
			self.getChaordicData($termFilter).always(function (data) {
					
				self.render('filters-chaordic', data, $filters);
				self.render('orderby-chaordic', data, $orderby);
				self.render('prateleira-busca-chaordic', data, $prateleira);
				self.render('pagination-chaordic', data, $pagination);
				self.pagination();
				self.dropDown();
				self.checkFilter();
				self.clearFilter();
				self.orderBy();
				self.priceFlags();
			}).done(function(){
				$('.order-title em').html($orderName);
			});


		});
	
	};
	
	this.checkFilter = function () {
		//No click do filtro input:
		$('.list-values').find('label').on('click', function(){
			
			$(this).addClass('loading');
			//pegando link rel da api no input
			var $termFilter = $(this).find('input').attr('rel');
				// $termFilter =  '//busca.consul.com.br' + $termFilter;
			
			var apiBusca = new Uri($termFilter),
				// apiParametros 	= apiBusca.query(),
				apiTerm 		= apiBusca.getQueryParamValues('terms'), //term
				apiFilters 		= apiBusca.getQueryParamValues('filter'), // array filters
				apiSortby 		= apiBusca.getQueryParamValues('sortby'); // sortBy
			
			//separando parametros de Filter e concatenando para montar URL
			// var $paramFilter = $termFilter.split('&filter=');
			var $paramFilter = apiFilters;
			var $qtdFilter = $paramFilter.length;
			var $resultFilter = '';
			if($qtdFilter >= 1){
				for(var i=0 ; i< $qtdFilter; i++){
					$resultFilter = $resultFilter+'&filter='+$paramFilter[i];
				}
			}
			//recuperando parametro sortBy e se existir concatenando para montar URL;
			
			if($termFilter.indexOf('sortby')>=0){
				$resultFilter = '?q=' + apiTerm + $resultFilter + '&sortBy=' + apiSortby ;
				sortbyName = apiSortby;
				window.history.pushState('','', $resultFilter);
			}else{
				//Concatena parametros filter sem sortBy
				$resultFilter = '?q=' +  apiTerm + $resultFilter;
				window.history.pushState('','', $resultFilter);
			}
			// Chamando função para montar os Dust Templates
			self.getChaordicData($termFilter).always(function (data) {
				
				self.render('filters-chaordic', data, $filters);
				self.render('resultado-chaordic', data, $header);
				self.render('orderby-chaordic', data, $orderby);
				self.render('prateleira-busca-chaordic', data, $prateleira);
				self.render('pagination-chaordic', data, $pagination);
				
				self.pagination();
				self.dropDown();
				self.checkFilter();
				self.clearFilter();
				self.orderBy();
				self.priceFlags();
			});
			
			// console.log('VARIAVEL SORTBY2>'+sortbyName[0]);
				
			switch (sortbyName[0]) {
			case 'ascPrice':
				$('.order-title em').html('Menor Preço');
				break;
			case 'descPrice':
				$('.order-title em').html('Maior Preço');
				break;
			case 'descSold':
				$('.order-title em').html('Mais Vendidos');
				break;
			case 'descDate':
				$('.order-title em').html('Data de lançamento');
				break;
			case 'descDiscount':
				// console.log('entrou dec desconto');
				$('.order-title em').html('Melhor Desconto');
				break;

			default:
				$('.order-title em').html('selecione');
				break;
			}
			if($(document).width() <= 992){
				$('.overlay-filter').delay(500).addClass('hide');
			}
			
		});
	};

	//Função que limpa os filtros
	this.clearFilter = function () {
		$('.clear-filter').on('click', function(){
			var removeAllFiltersLink = $(this).attr('rel');
			var $termSearch = removeAllFiltersLink;
			
			if ($termSearch !== ''){
				self.getChaordicData($termSearch).always(function (data) {
					// Google Promises
					self.render('filters-chaordic', data, $filters);
					self.render('resultado-chaordic', data, $header);
					self.render('suggestions-chaordic', data, $suggestions);
					self.render('orderby-chaordic', data, $orderby);
					self.render('prateleira-busca-chaordic', data, $prateleira);
					self.render('pagination-chaordic', data, $pagination);
					
					// console.log(data);
					self.pagination();
					self.dropDown();
					self.checkFilter();
					self.clearFilter();
					self.orderBy();
					self.priceFlags();
				});

				window.history.pushState('','', '/busca/?q='+term);
			} else {
				window.location.href = '/busca/?q='+term;
			}

			if ($(document).width() <= 992) {
				$('.overlay-filter').delay(500).addClass('hide');
			}
		});
	};

	/**
	* Recebe todos as formas de parcelamento do produto (vindo da API VTEX) para retornar a maior parcela possível sem juros
	* @param  {Array} installments formas de parcelamento
	* @returns {Object} dados da maior parcela sem juros
	*/
	this.prepareInstallments = function(installments) {
		return installments.map(function(installment) {
			if(installment.InterestRate === 0) {
				return installment;
			}
		}).sort(function(a, b) {
			return b.NumberOfInstallments - a.NumberOfInstallments;
		})[0];
	};

	/**
	 * Calcula percentual de desconto do produto com base no preço "de", "por"
	 * @param  {Float} listPrice preço "de"
	 * @param  {Float} price preço "por"
	 * @returns {String} retorna valor de percentual no formato "NN.NN...%"
	 */
	this.preparePercentoff = function(listPrice, price) {
		var calc = ((listPrice - price) / listPrice) * 100;
		if(calc) {

			return calc;
		}
	};

	/**
	 * Recebe as promoções da API da vtex procurando pela promo de desconto no boleto e/ou cartão para render (X% MENOS A VISTA)
	 * @param  {Object} teasers objeto de promos do produto
	 * @returns {Object} objeto com o nome da promo de desconto
	 */
	this.prepareDiscountPromo = function(teasers) {
		return teasers.reduce(function(prev, curr) {
			if(/(Cartão e Boleto|Cartão|Boleto) \d+%/ig.test(curr['<Name>k__BackingField'])) {
				return curr['<Name>k__BackingField'];
			}
		}, {});
	};

	/**
	 * Recebe todos os highlights de selos e retorna em um objeto preparado para o render apenas com os valores
	 * @param  {Object} clusterHighlights objeto de promos do produto
	 * @returns {Array}
	 */
	this.prepareclusterHighlights = function(clusterHighlights) {
		var arr = [];

		$.each(clusterHighlights, function(i, clusterHighlight) {
			if( typeof clusterHighlight === 'string' ) {
				clusterHighlight = clusterHighlight.replace('[','-');
				clusterHighlight = clusterHighlight.replace(']','-');
				arr.push($.replaceSpecialChars(clusterHighlight));
			}
		});

		return arr;
	};

	this.getVtexData = function ($idProduto, el) {
		// console.log('entrou na GetVtexData id do produto é >>>>>'+ $idProduto);

		var settings = {
			'url': '//consul.vtexcommercestable.com.br/api/catalog_system/pub/products/search/?fq=productId:' + $idProduto,
			'method': 'GET'
		};

		return $.ajax(settings).done(function(response) {
			// console.log($idProduto);
			// console.log('response:', response, response.length, typeof response);

			function buildShelf() {
				var precoDe = response[0].items[0].sellers[0].commertialOffer.ListPrice;
				var precoPor = response[0].items[0].sellers[0].commertialOffer.Price;

				if (precoDe === 0 && response[0].items.length > 1) {
					precoDe = response[0].items[1].sellers[0].commertialOffer.ListPrice;
					precoPor = response[0].items[1].sellers[0].commertialOffer.Price;
					var objParcelas = self.prepareInstallments(response[0].items[1].sellers[0].commertialOffer.Installments);

					// console.log('objParcelas IF', objParcelas);

					if (objParcelas !== undefined){
						numParcelas = objParcelas.NumberOfInstallments;
						// console.log('numParcelas IF', numParcelas);
						
						valueParcela = objParcelas.Value;
						// console.log('valueParcela IF', valueParcela);
					} else {
						numParcelas = 0;
						valueParcela = 0;
					}
					
				} else {
					objParcelas = self.prepareInstallments(response[0].items[0].sellers[0].commertialOffer.Installments);
					// console.log('objParcelas ELSE', objParcelas);

					if (objParcelas !== undefined) {
						var numParcelas = objParcelas.NumberOfInstallments;
						// console.log('numParcelas ELSE', numParcelas);
						var valueParcela = objParcelas.Value;	
						// console.log('valueParcela ELSE', valueParcela);
					} else {
						numParcelas = 0;
						valueParcela = 0;
					}
				}

				// console.log('precoDe >>>' + precoDe);
				// console.log('precoPor >>>' + precoPor);
				// console.log('objParcelas >>>',objParcelas);
				// console.log('numParcelas >', numParcelas);
				// console.log('valueParcela >>>', valueParcela);
				
				el.find('.descricao-prod .price .de .val').html('R$ '+_.formatCurrency(precoDe));
				// el.find('.descricao-prod .price .por').html(numParcelas+'<span>x</span> de R$ '+_.formatCurrency(valueParcela)+' <span class="juros">sem juros</span><span class="total-parcelado">Total parcelado:<span class="val"> R$ '+_.formatCurrency(precoPor)+'</span></span>');
				el.find('.descricao-prod .price .por').html('<span class="txtPor">Por: </span> <span class="val">R$ '+_.formatCurrency(precoPor));
				el.find('.descricao-prod .price .adicional').html('<span class="vezes">'+numParcelas+'<span class="x">x</span></span> <span class="d">de</span> <span class="val">R$ '+_.formatCurrency(valueParcela)+' </span><span class="total-parcelado"><span class="total-parcelado__txt hide">Total parcelado: </span><span class="val">'+_.formatCurrency(precoPor)+'</span></span>');

				if (precoDe === 0){
					// console.log('produto indisponivel');
					el.find('.price').html('<p class="indisponivel">Produto indisponível</p>');
				}
	
				var promoPercentOff = self.preparePercentoff(precoDe, precoPor);

				if (promoPercentOff !== undefined){
					promoPercentOff = promoPercentOff.toFixed(0);
					// el.find('.descricao-prod .price .por').append('<span class="off">'+promoPercentOff+'<small>%</small><p><em>Off</em></p></span>');
					el.find('.descricao-prod .price .por').append(' <span class="off" style="display: inline;">'+promoPercentOff+'% OFF</span>');
				}

				// console.log('promoPercentOff>', promoPercentOff);
				
				var clusterHighlights = self.prepareclusterHighlights(response[0].clusterHighlights);
				// console.log('clusterHighlights>', clusterHighlights);
	
				$.each(clusterHighlights, function (index) {
					// console.log(clusterHighlights[index]);
					el.find('.FlagsHightLight').append('<p class="flag '+clusterHighlights[index]+'">'+clusterHighlights[index]+'</p>');
				});
			}

			if (response.length === 0) {
				// console.log('sem info na vtex');
			} else {
				buildShelf();
			}
		});
	};

	this.priceFlags = function(){
		// console.log('entrou na PriceFlags');
		$('article.box-produto').each(function(){
			var $idProduto = $(this).attr('data-idproduto');
			self.getVtexData($idProduto, $(this));
			// $(this).css('border', '1px solid red');
		});
	};

	this.openFilter = function() {
		// console.log('openfilter');
		$('.open-filter').click(function() {
			// console.log('entrou no OpenFilter');
			if($('.overlay-filter').length === 0) {
				$('body').prepend('<div class="overlay-filter"></div>');
			}else {
				$('.overlay-filter').removeClass('hide');
			}
			$('.filter-wrapper').addClass('opened');

			$('.overlay-filter').unbind('click').click(function() {
				self.closeFilter();
			});
		});
	};

	this.closeFilter = function() {
		$('.filter-wrapper').removeClass('opened');
		$('.overlay-filter').addClass('hide');
	};

	this.setup = function() {
		var $termSearch = self.getTermSearch();

		self.getChaordicData($termSearch).always(function (data) {
			// console.log(data);

			// Google Promises
			self.render('filters-chaordic', data, $filters);
			self.render('resultado-chaordic', data, $header);
			self.render('suggestions-chaordic', data, $suggestions);
			self.render('orderby-chaordic', data, $orderby);
			self.render('prateleira-busca-chaordic', data, $prateleira);
			self.render('pagination-chaordic', data, $pagination);
			
			self.pagination();
			self.dropDown();
			self.checkFilter();
			self.clearFilter();
			self.orderBy();
			self.priceFlags();
			self.openFilter();
			self.closeFilter();
		});

		$(document).ajaxStop(function(){
			// self.pagination();
			// self.priceFlags();
		});
	};

	self.setup();
});