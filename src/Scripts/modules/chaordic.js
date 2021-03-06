/* global $: true, Nitro: true */

'use strict';

//Templates dust usados
require('Dust/chaordic/shelf-content-placeholder-product.html');
require('Dust/chaordic/shelf-content-placeholder-default.html');
require('Dust/chaordic/shelf-content-placeholder-ultimateBuy.html');
require('Dust/chaordic/shelf-content-placeholder-personalized.html');
require('Dust/chaordic/shelf-content-placeholder-history-personalized.html');
require('Dust/chaordic/shelf-content-placeholder-product-history-personalized.html');
require('Dust/chaordic/shelf-content-placeholder-frequentlyBoughtTogether.html');
require('Dust/chaordic/shelf-content-placeholder-product-frequentlyBoughtTogether.html');
require('Dust/chaordic/shelf-content-placeholder-product-ultimateBuy.html');
require('Dust/chaordic/shelf-content-placeholder.html');
require('Dust/chaordic/shelf-content-placeholder-cart.html');
require('Dust/chaordic/shelf-content-placeholder-cart-mostPopular.html');
require('Dust/chaordic/chaordic-unavailable.html');
require('Dust/chaordic/chaordic-price.html');
require('Dust/chaordic/chaordic-voltage.html');
require('Dust/chaordic/chaordic-hightlight.html');

//require('vendors/dust-helpers');

dust.helpers.eq = function(chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;

	if (location === value) {
		chunk.render(body, context);
	}

	return chunk;
};

//DUST FILTER AND HELPERS
_.extend(dust.filters, {
	chaordicCurrency: function(value) {
		return (window.defaultStoreCurrency || 'R$') + ' ' + _.formatCurrency(value);
	}
});

dust.helpers.neq = function(chunk, context, bodies, params) {
	var location = params.key,
		value = params.value,
		body = bodies.block;
	if (location !== value) {
		chunk.render(body, context);
	}

	return chunk;
};

//MODULE
Nitro.module('chaordic', function() {
	var self = this,
		API = {
			//OBJETO DE CONFIG GERAL PARA CHAMADAS NA API CHAORDIC
			APIHOST: '//recs.chaordicsystems.com/v0',
			SHELFENDPOINT: '/pages/recommendations',
			//QUERY PARAMETROS OBRIGATÓRIOS P/ CHAMADA
			APIPARAMS: {
				apiKey:
					window.vtex.accountName ||
					window.vtex.vtexid.accountName ||
					window.jsnomeLoja.replace(/qa$|mkpqa$/, ''),
				//name: null,
				source: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
					navigator.userAgent.toLowerCase()
				)
					? 'mobile'
					: 'desktop',
				deviceId: window.getCookie('chaordic_browserId'),
				productFormat: 'compact'
			}
		},
		$window = $(window),
		chaordicData,
		vtexRenderedProducts = [];

	/**
	 * Função bootstrap app | Inicia definindo a página e eventos de scroll para carregar prateleiras e clicks mobile
	 * @param  {String} name Nome da página para request chaordic (home, product, category, subcategory, cart, etc).
	 */
	this.init = function(name, productId) {
		name ? (API.APIPARAMS.name = name) : '';
		productId ? (API.APIPARAMS.productId = productId) : '';
		if ($('[data-chaordic]').length > 0) {
			if (!API.APIPARAMS.deviceId) {
				var checkDeviceId = setInterval(function() {
					if (window.getCookie('chaordic_browserId')) {
						API.APIPARAMS.deviceId = window.getCookie('chaordic_browserId');
						self.getRecommendations();
						$window.scroll();
						clearInterval(checkDeviceId);
					}
				}, 50);
			} else {
				self.getRecommendations();
				$window.scroll();
			}

			$window.scroll(self.loadProducts).scroll();

			//Click nos produtos da chaordic devem disparar o tracking antes de redirecionar
			$(document).on('click', '[data-chaordic] article a', function(e) {
				e.preventDefault();

				var $link = $(this);

				$.get($link.data('tracking')).always(function() {
					window.location = $link.attr('href');
				});
			});

			//ACORDION TITLE
			if ($window.width() <= 1024) {
				$(document).on('click', '.js-pre-title', function(e) {
					e.preventDefault();
					$(this).toggleClass('shelf-pre-title--active');
					$window.scroll();
				});
			}
		}
	};

	/**
	 * Função de ação do scroll que acha prateleira e roda carregamento da vitrine quando estiver na tela (cuidado ao confundir $shelf, com $self, ou self hihi)
	 */
	this.getRecommendations = function() {
		var $shelfs = $('[data-chaordic]').not('.chaordic--run');

		if ($shelfs.length <= 0) {
			return false;
		}

		// var reference = $(window).scrollTop() + $(window).height();

		//Prevent multiple ajax calls, toDo rewrite
		self.getShelf().then(function() {
			$shelfs.each(function() {
				var $self = $(this),
					position = $self.data('chaordic'),
					shelf;
				self.getShelf().then(function(res) {
					shelf = res[position];

					$.each(shelf, function(i, v) {
						if (v.feature === 'FrequentlyBoughtTogether') {
							v.oldPrice = _.formatCurrency(
								v.displays[0].references[0].oldPrice + v.displays[0].recommendations[0].oldPrice
							);
							v.price = _.formatCurrency(
								v.displays[0].references[0].price + v.displays[0].recommendations[0].price
							);
							v.numberInstallments = 10;
							v.instalments = _.formatCurrency(
								(v.displays[0].references[0].price + v.displays[0].recommendations[0].price) /
									v.numberInstallments
							);
						}

						self.cropName(v, 25);
						v.isPersonalized =
							v.feature === 'ViewPersonalized' ||
							v.feature === 'HistoryPersonalized' ||
							v.feature === 'CartPersonalized';
					});

					self.placeHolderRender(shelf, $self).then(function($chaordicShelf) {
						//Slick, porram tive que colocar timeout pq tava bugando no mobile :/
						var $slider = $chaordicShelf.filter('.js-chaordic-slider').not('.slick-initialized');

						$slider.each(function() {
							var slidesToShow = $(this).data('slidestoshow') || 4;
							self.slider($(this), slidesToShow);
						});

						$window.scroll();
					});
				});
			});
		});
	};

	/**
	 * Função para cortar o nome dos produtos no carrossel lateral vertical e tirar o dominio de prod das url's
	 */
	this.cropName = function(item, size) {
		$.each(item.displays, function(i, v) {
			$.each(v.references, function(i, val) {
				val.cropName = val.name.substring(0, size) + '...';
				// remover dominio para funcionar em todos ambientes
				val.url = val.url.replace('loja.consul.com.br', '');
			});
			$.each(v.recommendations, function(i, val) {
				val.cropName = val.name.substring(0, size) + '...';
				// remover dominio para funcionar em todos ambientes
				val.url = val.url.replace('loja.consul.com.br', '');
			});
		});
	};

	/**
	 * Função de ação do scroll que acha prateleira e roda carregamento da vitrine quando estiver na tela (cuidado ao confundir $shelf, com $self, ou self hihi)
	 */
	this.loadProducts = function() {
		var $shelfs = $('[data-chaordic] .js-content-lazy:not(".vtex-load")');

		if ($shelfs.length <= 0) {
			return false;
		}

		var windowTop = $window.scrollTop(),
			windowBottom = $window.scrollTop() + $window.height();

		$shelfs.each(function() {
			var $self = $(this),
				itemTop = $self.offset().top,
				itemBottom = $self.offset().top + $self.outerHeight(),
				position = $self.parents('[data-chaordic]').data('chaordic');

			if ($self.is(':visible') && (windowBottom >= itemTop && windowTop <= itemBottom)) {
				$self.addClass('vtex-load');

				$.get($self.attr('data-impressionUrl')).always(function() {});

				var shelf = chaordicData[position][$self.data('index')],
					recomendations = self.prepareRecomendations(shelf, shelf.isPersonalized);
				//

				if (recomendations) {
					self.getProducts(recomendations)
						.then(function(products) {
							if (shelf.isPersonalized) {
								self.prepareData(shelf, products, 'references');
							}

							return self.prepareData(shelf, products);
						})
						.then(function() {
							//Produtos já foram renderizados
							//Rodar modulo de prateleira para montar %OFF e etc
							Nitro.module('prateleira');

							$self.parents('[data-chaordic]').addClass('chaordic--runned');
							//$self.removeClass('js-content-lazy');
						});
				}
			}
		});
	};

	/**
	 * Verifica e retorna se existe alguma chave false em um objeto
	 * @param  {Object} obj retorno da API /orders
	 * @returns {Boolean}
	 */
	this._hasFalseKeys = function(obj) {
		return Object.keys(obj).some(function(key) {
			return !obj[key];
		});
	};

	/**
	 * Roda ajax para API recomendations da chaordic
	 * @returns {Promise} resolvida com os dados da API
	 */
	this.getShelf = function() {
		var dfd = jQuery.Deferred();
		if (!chaordicData) {
			if (!self._hasFalseKeys(API.APIPARAMS)) {
				$.ajax({
					method: 'GET',
					dataType: 'json',
					url: API.APIHOST + API.SHELFENDPOINT,
					data: API.APIPARAMS
				}).then(function(res) {
					chaordicData = res;
					dfd.resolve(res);
				});
			}
		} else {
			dfd.resolve(chaordicData);
		}

		return dfd.promise();
	};

	/**
	 * Prepara query strings com os ids de produto para fazer chamada no search da VTEX
	 * @param  {Object} res retorno da API recomendations (current shelf)
	 * @returns {String} query string para endpoint da VTEX
	 */
	this.prepareRecomendations = function(res, isPersonalized) {
		var response = res.displays[0].recommendations.reduce(self.recomendationsReducer, '');

		if (isPersonalized) {
			response = res.displays[0].references.reduce(self.recomendationsReducer, response);
		}


		return response;
	};

	this.recomendationsReducer = function(prev, curr) {
		if ($.inArray(curr.id, vtexRenderedProducts) < 0) {
			vtexRenderedProducts.push(curr.id);
			return prev + 'fq=productId:' + curr.id + '&';
		} else {
			return prev;
		}
	};

	/**
	 * Faz chamada API da VTEX para pegar dados dos produtos sugeridos pela chaordic
	 * @param  {Object} recomendations recomendações sugeridas pela API chaordic
	 * @returns {Promise} com os dados da API da vtex
	 */
	this.getProducts = function(recomendations) {
		return $.getJSON('/api/catalog_system/pub/products/search/?_from=0&_to=49&' + recomendations).then(function(
			res
		) {
			return res;
		});
	};

	/**
	 * D: Prepara objeto final para renderização, mesclando dados chaordic com dados VTEX
	 * @param  {Object} shelf prateleiras recomendadas pela chaordic
	 * @param  {Object} products produtos retornados pelo search da VTEX
	 * @returns {Object} dados mesclados prontos para o render
	 */
	this.prepareData = function(shelf, products, type) {
		var dfd = jQuery.Deferred();

		type = type || 'recommendations';
		if (shelf.feature === 'FrequentlyBoughtTogether') {
			self.renderReferenceShelf(shelf);
		}

		$.each(shelf.displays[0][type], function(i, recommendation) {
			$.each(products, function(i, product) {
				if (product.productId === recommendation.id) {
					var $box = $('.shelf-item[data-idproduto="' + product.productId + '"]');

					if (!$box.hasClass('box-produto')) {
						var item = product.items.filter(function(value) {
							return value.sellers[0].commertialOffer.AvailableQuantity > 0;
						});
						if (item.length > 0) {
							product.isPurificador = product.categories.forEach(function(value) {
								if (value.toLowerCase().indexOf('purificador') > -1) return true;
							});


							product.available = item.length > 0;
							product.priceInfo = item[0].sellers[0].commertialOffer;
							product.maxInstallment = self.prepareInstallments(
								item[0].sellers[0].commertialOffer.Installments
							);
							product.priceInfo.percentOff = self.preparePercentoff(
								item[0].sellers[0].commertialOffer.ListPrice,
								item[0].sellers[0].commertialOffer.Price
							);

							product.finalImages = self.prepareImages(item[0].images, '210');

							// product.clusterHighlights.inCash = self.prepareDiscountPromo(item[0].sellers[0].commertialOffer.Teasers);
							product.clusterHighlights = self.prepareclusterHighlights(
								product.clusterHighlights,
								item[0].sellers[0].commertialOffer.Teasers
							);

							product.isPurificador = (product['Tipo do produto'][0].toLowerCase().indexOf('purificador') > -1);
							$box.attr('data-ispurificador', product.isPurificador);
							self.finalRender(product, $box);
						} else {
							product.finalImages = self.prepareImages(product.items[0].images, '210')
							self.renderUnavailable(product, $box);
						}
					}
				}
				//
			});
		});

		dfd.resolve();
		return dfd.promise();
	};

	/**
	 * Render reference shelf on frequently bought together section
	*/

	this.renderReferenceShelf = shelf => {
		const referenceItem = shelf.displays[0]['references'][0];

		let $box = $('.shelf-item[data-idproduto="' + referenceItem.id + '"]');

		$.ajax({
			url: '/api/catalog_system/pub/products/search?fq=productId:' + window.skuJson.productId,
			accept:'application/json'
		}).then(function(product) {
			if (!$box.hasClass('box-produto')) {
				let item = product[0].items.filter(function(value) {
					return value.sellers[0].commertialOffer.AvailableQuantity > 0;
				});
				product[0].available = item.length > 0;
				product[0].priceInfo = item[0].sellers[0].commertialOffer;
				product[0].maxInstallment = self.prepareInstallments(
					item[0].sellers[0].commertialOffer.Installments
				);

				product[0].priceInfo.percentOff = self.preparePercentoff(
					item[0].sellers[0].commertialOffer.ListPrice,
					item[0].sellers[0].commertialOffer.Price
				);
				product[0].finalImages = self.prepareImages(item[0].images, '300');
				// product.clusterHighlights.inCash = self.prepareDiscountPromo(item[0].sellers[0].commertialOffer.Teasers);
				product[0].clusterHighlights = self.prepareclusterHighlights(
					product[0].clusterHighlights,
					item[0].sellers[0].commertialOffer.Teasers
				);
				self.finalRender(product[0], $box);
			} else {
				self.renderUnavailable(product[0], $box);
			}
		});
	};

	/**
	 * Prepara tag de imagem setando tamanho da imagem e ajustando hostda img vinda do search VTEX
	 * @param  {String} tag tag da imagem da api VTEX
	 * @param  {Int} size tamanho int(px) desejado para a imagem
	 * @returns {String} image tag pronta para renderizar
	 */
	this.replaceImageSize = function(tag, size) {
		return tag.replace(/#width#|#height#/g, size).replace('~/', '/');
	};

	/**
	 * Recebe todas as imagens de produto vindas da VTEX para montar objeto para render com foto principal e hover perspective
	 * @param  {Object} images imagens do produto da api vtex
	 * @param  {Int} size tamanho int(px) desejado para a imagem (vai rodar o método replaceImageSize)
	 * @returns {Object} objeto (imagens) final para render
	 */
	this.prepareImages = function(images, size) {
		var finalImages = {};

		finalImages.principal = self.replaceImageSize(images[0].imageTag, size);

		$.each(images, function(i, image) {
			if (image.imageLabel === 'prateleiraPrincipal') {
				finalImages.principal = self.replaceImageSize(image.imageTag, size);
			} else if (image.imageLabel === 'prateleiraPerspectiva') {
				finalImages.perspectiva = self.replaceImageSize(image.imageTag, size);
			}
		});

		return finalImages;
	};

	/**
	 * Recebe todos as formas de parcelamento do produto (vindo da API VTEX) para retornar a maior parcela possível sem juros
	 * @param  {Array} installments formas de parcelamento
	 * @returns {Object} dados da maior parcela sem juros
	 */
	this.prepareInstallments = function(installments) {
		return installments
			.map(function(installment) {
				if (installment.InterestRate === 0) {
					return installment;
				}
			})
			.sort(function(a, b) {
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
		if (calc) {
			return calc + ' %';
		}
	};

	/**
	 * Recebe as promoções da API da vtex procurando pela promo de desconto no boleto e/ou cartão para render (X% MENOS A VISTA)
	 * @param  {Object} teasers objeto de promos do produto
	 * @returns {Object} objeto com o nome da promo de desconto
	 */
	// TODO: Review if method is useful
	this.prepareDiscountPromo = function(teasers) {
		return teasers.reduce(function(prev, curr) {
			if (/(Cartão e Boleto|Cartão|Boleto) \d+%/gi.test(curr['<Name>k__BackingField'])) {
				return curr['<Name>k__BackingField'];
			}
		}, {});
	};

	/**
	 * Recebe todos os highlights de selos e retorna em um objeto preparado para o render apenas com os valores
	 * @param  {Object} clusterHighlights objeto de promos do produto
	 * @returns {Array}
	 */
	this.prepareclusterHighlights = function(clusterHighlights, benefitsHighlights) {
		var arr = [];

		// TODO: each function abstraction to avoid duplicate
		$.each(clusterHighlights, function(i, clusterHighlight) {
			if (typeof clusterHighlight === 'string') {
				arr.push($.replaceSpecialChars(clusterHighlight));
			}
		});

		if (benefitsHighlights && $.isArray(benefitsHighlights) && benefitsHighlights.length) {
			$.each(benefitsHighlights, function(i, benefitHighlight) {
				if (typeof benefitHighlight['<Name>k__BackingField'] === 'string') {
					arr.push($.replaceSpecialChars(benefitHighlight['<Name>k__BackingField']));
				}
			});
		}

		return arr;
	};

	/**
	 * Método render do HTML da prateleira para produtos indisponiveis
	 */
	this.renderUnavailable = function(renderData, $elem) {

		if (renderData && renderData.finalImages) {
			if (renderData.finalImages.principal) {
				$elem.find('.js-item-image-principal').html(renderData.finalImages.principal);
			}

			if (renderData.finalImages.perspectiva) {
				$elem.find('.js-item-image').html(renderData.finalImages.perspectiva);
			}
		}

		$elem.find('.js-item-sku').text(renderData.productReference);

		$elem.find('.shelf-item__price--list').text('Produto Indisponível');

		$elem.find('.shelf-item--empty').removeClass('shelf-item--empty');
		$elem.addClass('box-produto').addClass('unavailable');
	};

	/**
	 * Método render do HTML da prateleira e produtos via dust
	 * @param  {Object} renderData objeto com os dados que devem ser usados para o render (objeto final mesclado pelo método prepareData)
	 * @param  {Object} $elem seletor jQuery de onde deve ser "cuspido" o resultado renderizado
	 * @returns {Promise} resolvida retorna o seletor jQuery da lista de produtos renderizados
	 */
	this.finalRender = function(renderData, $elem) {
		self.priceRender(renderData, $elem);
		self.voltageRender(renderData, $elem);
		self.hightlightRender(renderData, $elem);

		if (renderData && renderData.finalImages) {
			if (renderData.finalImages.principal) {
				$elem.find('.js-item-image-principal').html(renderData.finalImages.principal);
			}

			if (renderData.finalImages.perspectiva) {
				$elem.find('.js-item-image').html(renderData.finalImages.perspectiva);
			}
		}

		$elem.find('.js-item-sku').text(renderData.productReference);
		$elem.attr('data-percent', renderData.priceInfo.percentOff);

		if (renderData.items.length > 1) {
			for (let i = 0; i < renderData.items.length; i++) {
				if (renderData.items[0].name.includes('110')) {
					$elem.attr('data-sku', renderData.items[0].itemId);
					$elem.attr('data-sku-220', renderData.items[1].itemId);
				} else {
					$elem.attr('data-sku', renderData.items[1].itemId);
					$elem.attr('data-sku-220', renderData.items[0].itemId);
				}
			}
		} else {
			$elem.attr('data-sku', renderData.items[0].itemId);
		}

		$elem.find('.shelf-item--empty').removeClass('shelf-item--empty');
		$elem.addClass('box-produto');
	};

	/**
	 * Método render do HTML da prateleira e produtos via dust
	 * @param  {Object} renderData objeto com os dados que devem ser usados para o render (objeto final mesclado pelo método prepareData)
	 * @param  {Object} $elem seletor jQuery de onde deve ser "cuspido" o resultado renderizado
	 * @returns {Promise} resolvida retorna o seletor jQuery da lista de produtos renderizados
	 */
	this.placeHolderRender = function(renderData, $elem) {
		var dfd = jQuery.Deferred();
		var placeholderDust;

		$('body').hasClass('body-cart')
			? (placeholderDust = 'shelf-content-placeholder-cart')
			: (placeholderDust = 'shelf-content-placeholder');

		if (renderData[0] && renderData[0].name === 'Complementares') {
			renderData[0].subtitle = 'Compre <span class="shelf--compre-junto">junto</span>';
		}
		if (renderData[1] && renderData[1].name === 'Preferidos') {
			renderData[1].title = 'Confira <span class="shelf--preferidos">os preferidos</span>';
		}
		if(renderData[0] && renderData[0].name === 'Visualizados') {
			renderData[0].title = 'Você <span class="shelf--visited">visitou</span>';
			renderData[0].subtitle = 'Talvez se <span class="shelf--visited">interesse por</span>';
		}

		if(renderData[1] && renderData[1].name === 'Histórico') {
			renderData[1].title = 'Últimos <span class="shelf--visited">vistos</span>';
			renderData[1].subtitle = 'Relacionados aos <span class="shelf--visited">seus interesses</span>';
		}

		dust.render(placeholderDust, renderData, function(err, out) {
			if (err) {
				throw new Error('Chaordic Placeholder Dust error: ' + err);
			}

			$elem.html(out);
			$elem.addClass('chaordic--run');
			dfd.resolve($elem.find('.js-chaordic-shelf'));

			self.buyChaordicInstall();
		});

		return dfd.promise();
	};

	this.priceRender = function(renderData, $elem) {
		dust.render('chaordic-price', renderData, function(err, out) {
			if (err) {
				throw new Error('Chaordic Price Dust error: ' + err);
			}

			$elem.find('.js-item-price').html(out);
		});
	};

	this.hightlightRender = function(renderData, $elem) {
		dust.render('chaordic-hightlight', renderData, function(err, out) {
			if (err) {
				throw new Error('Chaordic Hightlight Dust error: ' + err);
			}

			$elem.find('.js-item-flagshightlight').html(out);
		});
	};

	this.voltageRender = function(renderData, $elem) {
		dust.render('chaordic-voltage', renderData, function(err, out) {
			if (err) {
				throw new Error('Chaordic Price Dust error: ' + err);
			}

			$elem.find('.js-item-voltage').html(out);
			self.buyChaordicInstallCart();

			$.each(renderData.items, function(i, val) {
				if (val.name === 'BIVOLT') {
					$elem.find('.js-shelf-item__button-cart').attr('data-href', val.itemId);
				}
			});
		});
	};

	/**
	 * Método para montar slick carrosel nas prateleiras
	 * @param  {Object} $slider seletor jQuery do elemento pai com os slides
	 * @param  {Integer} slidesToShow número com o total de slides que vão aparecer e rodar na versão Desk do slider
	 */
	this.slider = function($slider, slidesToShow) {
		$slider.slick({
			infinite: false,
			slidesToShow: slidesToShow,
			slidesToScroll: slidesToShow,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						dots: true,
						slidesToShow: 2,
						slidesToScroll: 2,
						vertical: false
					}
				},
				{
					breakpoint: 480,
					settings: {
						dots: true,
						slidesToShow: 1,
						slidesToScroll: 1,
						vertical: false
					}
				}
			]
		});
	};

	/**
	 * Método para montar link de carrinho com produtos
	 */
	this.buyChaordicInstall = function() {
		$('.js-shelf-item__button').on('click', function(e) {
			e.preventDefault();

			var buyButton = $('#BuyButton a.buy-button'),
				buyButtonLink = buyButton.attr('href'),
				modalBuyButton = $('#modal-sku .buy-button'),
				skuInstall = $(this)
					.closest('.shelf--personalized')
					.find('.js-content-sku-ref article.shelf-item')
					.attr('data-sku'),
				skuInstall220 = $(this)
					.closest('.shelf--personalized')
					.find('.js-content-sku-ref article.shelf-item')
					.attr('data-sku-220');

			if ($('.skuselector-specification-label').length <= 0) {
				$(location).attr('href', `${buyButtonLink}&sku=${skuInstall}&qty=1&seller=1&redirect=true&sc=3`);
			} else if ($('.skuselector-specification-label').hasClass('checked')) {
				let itemSelected = $('.skuselector-specification-label.checked').attr('value');
				// prettier-ignore
				itemSelected.includes('220') && skuInstall220
					? $(location).attr(
						'href',
						`${buyButtonLink}&sku=${skuInstall220}&qty=1&seller=1&redirect=true&sc=3`
					)
					: $(location).attr('href', `${buyButtonLink}&sku=${skuInstall}&qty=1&seller=1&redirect=true&sc=3`);
			} else {
				buyButton.trigger('click');

				$(window).on('skuSelected.vtex', function() {
					let itemSelected = $('.skuselector-specification-label.checked').attr('value');
					// prettier-ignore
					itemSelected.includes('220') && skuInstall220
						? modalBuyButton.attr(
							'href',
							`${modalBuyButton.attr('href')}&sku=${skuInstall220}&qty=1&seller=1&redirect=true&sc=3`
						)
						: modalBuyButton.attr(
							'href',
							`${modalBuyButton.attr('href')}&sku=${skuInstall}&qty=1&seller=1&redirect=true&sc=3`
						);
				});
			}
		});
	};

	/**
	 * Método para add produto no carrinho
	 */
	this.buyChaordicInstallCart = function() {
		$('.js-item-voltage input').on('change', function(e) {
			e.preventDefault();

			var sku = $(this).attr('data-sku');

			$('.shelf-item__voltage-option').removeClass('checked');
			$(this)
				.parent('.shelf-item__voltage-option')
				.addClass('checked');
			$(this)
				.closest('.js-item-voltage')
				.find('.js-shelf-item__button-cart')
				.attr('data-href', sku);
		});

		$('.js-shelf-item__button-cart').on('click', function(e) {
			e.preventDefault();

			var item = {
				id: $(this).attr('data-href'),
				quantity: 1,
				seller: '1'
			};

			vtexjs.checkout.addToCart([item], null, 3).done(function() {
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			});
		});
	};
});
