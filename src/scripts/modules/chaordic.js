/* global $: true, Nitro: true */

'use strict';

require('vendors/jquery.cookie');
require('vendors/jquery.debounce');

require('modules/helpers');
require('modules/prateleira');

require('../../templates/chaordic.html');

//DUST FILTER AND HELPERS
_.extend(dust.filters, {
	chaordicName: function(value) {
		value = value.replace(/- .+$/, '');
		value = (value.length > 60 ? value.substr(0, 60) + '...' : value);

		return value;
	},
	chaordicCurrency: function(value) {
		return window.defaultStoreCurrency + ' ' + _.formatCurrency(value);
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
		//OBJETO DE CONFIG GERAL PARA CHAMADAS NA API CHAORDIC
		API = {
			APIHOST: '//recs.chaordicsystems.com/v0',
			SHELFENDPOINT: '/pages/recommendations',
			//QUERY PARAMETROS OBRIGATÓRIOS P/ CHAMADA
			APIPARAMS: {
				apiKey: window.jsnomeLoja.replace(/qa$|mkpqa$/, ''),
				name: null,
				source: (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) ? 'mobile' : 'desktop',
				deviceId: window.getCookie('chaordic_browserId'),
				productFormat: 'onlyIds'
			}
		},
		$window = $(window),
		chaordicData;

	/**
	 * Função bootstrap app | Inicia definindo a página e eventos de scroll para carregar prateleiras e clicks mobile
	 * @param  {String} name Nome da página para request chaordic (home, product, category, subcategory, cart, etc).
	 */
	this.init = function(name) {
		API.APIPARAMS.name = name;

		if(!API.APIPARAMS.deviceId) {
			var checkDeviceId = setInterval(function() {
				if(window.getCookie('chaordic_browserId')) {
					API.APIPARAMS.deviceId = window.getCookie('chaordic_browserId');
					$window.scroll();
					clearInterval(checkDeviceId);
				}
			}, 50);
		}

		if( $('[data-chaordic]').not('.chaordic--runned').length > 0 ) {
			$window.scroll(self.scrollHandler).scroll();

			//ACORDION TITLE
			if ($window.width() <= 768) {
				$(document).on('click', '.js-pre-title', function(e) {
					e.preventDefault();

					$(this)
						.toggleClass('shelf-pre-title--active')
						.next()
						.stop().stop().slideToggle();

					$window.scroll();
				});
			}
		}

	};


	/**
	 * Função de ação do scroll que acha prateleira e roda carregamento da vitrine quando estiver na tela (cuidado ao confundir $shelf, com $self, ou self hihi)
	 */
	this.scrollHandler = $.throttle(function() {
		var $shelfs = $('[data-chaordic]').not('.chaordic--runned');

		if($shelfs.length <= 0) {
			return false;
		}

		var reference = $(window).scrollTop() + $(window).height();

		$shelfs.each(function() {
			var $self = $(this),
				position = $self.data('chaordic');

			if ($self.is(':visible') && reference >= $self.offset().top ) {
				var shelf;

				self.getShelf(name)
					.then(function(res) {
						shelf = res[position];
						var recomendations = self.prepareRecomendations(res[position]);

						return self.getProducts(recomendations);
					})
					.then(function(products) {
						var renderData = self.prepareData(shelf, products);
						return self.render(renderData, $self);
					})
					.then(function($chaordicShelf) {
						//Produtos já foram renderisados
						//Slick
						$chaordicShelf.not('.slick-initialized').slick({
							infinite: false,
							slidesToShow: 3,
							slidesToScroll: 3,
							responsive: [{
								breakpoint: 990,
								settings: {
									dots: true,
									slidesToShow: 2,
									slidesToScroll: 2
								}
							}, {
								breakpoint: 480,
								settings: {
									dots: true,
									slidesToShow: 2,
									slidesToScroll: 2
								}
							}]
						});

						//Rodar modulo de prateleira para montar %OFF e etc
						Nitro.module('prateleira');
						//Previne rodar novamente
						$self.addClass('chaordic--runned');
						//Click nos produtos da chaordic devem disparar o tracking antes de redirecionar
						$chaordicShelf.find('a').click(function(e) {
							e.preventDefault();

							var $link = $(this);

							$.get($link.data('tracking'))
								.always(function() {
									window.location = $link.attr('href');
								});
						});
					});

				return false;
			}
		});
	}, 800);

	/**
	 * Verifica e retorna se existe alguma chave false em um objeto
	 * @param  {Object} obj retorno da API /orders
	 * @returns {Boolean}
	 */
	this._hasFalseKeys = function(obj) {
		return Object.keys(obj).some(function(key) { return !obj[key]; });
	};

	/**
	 * Roda ajax para API recomendations da chaordic
	 * @returns {Promise} resolvida com os dados da API
	 */
	this.getShelf = function() {
		var dfd = jQuery.Deferred();

		if(!chaordicData) {
			if(!self._hasFalseKeys(API.APIPARAMS)) {
				$.ajax({
					method: 'GET',
					dataType: 'json',
					url: API.APIHOST + API.SHELFENDPOINT,
					data: API.APIPARAMS
				})
				.then(function(res) {
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
	 * @param  {Object} res retorno da API recomendations
	 * @returns {String} query string para endpoint da VTEX
	 */
	this.prepareRecomendations = function(res) {
		return res.reduce(function(prev, curr) {
			var res = curr.displays[0].recommendations.reduce(function(prev, curr) {
				return prev + 'fq=productId:' + curr.id + '&';
			}, '');

			return prev + res;
		}, '');
	};

	/**
	 * Faz chamada API da VTEX para pegar dados dos produtos sugeridos pela chaordic
	 * @param  {Object} recomendations recomendações sugeridas pela API chaordic
	 * @returns {Promise} com os dados da API da vtex
	 */
	this.getProducts = function(recomendations) {
		return $.getJSON('/api/catalog_system/pub/products/search/?_from=0&_to=49&' + recomendations)
			.then(function(res) {
				return res;
			});
	};

	/**
	 * D: Prepara objeto final para renderização, mesclando dados chaordic com dados VTEX
	 * @param  {Object} shelfs prateleiras recomendadas pela chaordic
	 * @param  {Object} products produtos retornados pelo search da VTEX
	 * @returns {Object} dados mesclados prontos para o render
	 */
	this.prepareData = function(shelfs, products) {
		$.each(shelfs, function(i, shelf) {
			$.each(shelf.displays[0].recommendations, function(i, recommendation) {
				$.each(products, function(i, product) {
					if(product.productId === recommendation.id) {
						var item = product.items.filter(function(value) {
							return value.sellers[0].commertialOffer.AvailableQuantity > 0;
						});

						recommendation.product = product;
						recommendation.product.available = item.length > 0;

						if(item.length === 0) {
							item = [product.items[0]];
						}

						recommendation.product.priceInfo = item[0].sellers[0].commertialOffer;
						recommendation.product.finalImages = self.prepareImages(item[0].images, '345');
						recommendation.product.maxInstallment = self.prepareInstallments(item[0].sellers[0].commertialOffer.Installments);
						recommendation.product.priceInfo.percentOff = self.preparePercentoff(item[0].sellers[0].commertialOffer.ListPrice, item[0].sellers[0].commertialOffer.Price);
						recommendation.product.clusterHighlights.inCash = self.prepareDiscountPromo(item[0].sellers[0].commertialOffer.Teasers);
						recommendation.product.clusterHighlights = self.prepareclusterHighlights(recommendation.product.clusterHighlights);
						return false;
					}
				});
			});
		});

		return shelfs;
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
			if( image.imageLabel === 'prateleiraPrincipal' ) {
				finalImages.principal = self.replaceImageSize(image.imageTag, size);
			} else if( image.imageLabel === 'prateleiraPerspectiva' ) {
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
			return calc + ' %';
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
				arr.push($.replaceSpecialChars(clusterHighlight));
			}
		});

		return arr;
	};

	/**
	 * Método render do HTML da prateleira e produtos via dust
	 * @param  {Object} renderData objeto com os dados que devem ser usados para o render (objeto final mesclado pelo método prepareData)
	 * @param  {Object} $elem seletor jQuery de onde deve ser "cuspido" o resultado renderizado
	 * @returns {Promise} resolvida retorna o seletor jQuery da lista de produtos renderizados
	 */
	this.render = function(renderData, $elem) {
		var dfd = jQuery.Deferred();

		dust.render('chaordic', renderData, function(err, out) {
			if (err) {
				dfd.reject(err);
				throw new Error('Chaordic Shelf Dust error: ' + err);
			}

			$elem.html(out);
			dfd.resolve($elem.find('.js-chaordic-shelf'));
		});

		return dfd.promise();
	};
});
