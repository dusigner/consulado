'use strict';

require('./../../../Dust/category-combos.html');
require('modules/helpers');

var itemsFilter = require('../../../json/filters.json');


// Dust filters
_.extend(dust.filters, {
	sanitize: function(value) {
		return $.replaceSpecialChars(value).toLowerCase();
	}
});

Nitro.module('search-category', function() {
	var app = this;

	/**
	 * Varre prateleiras da página de combos pegando categorias pelo "data-category" e retornando em um array
	 * @param {Object} $prateleira seletor jQuery das prateleiras
	 * @returns {Array} Array de strings das categorias VTEX
	 */
	app.searchCategory = function($prateleira) {
		var $categoryItems = $prateleira.find('.combos-prateleira__product-item'),
			categories = [];

		// itera entre todos os itens das prateleiras pegando suas categorias e insere em um array
		$categoryItems.each(function() {
			categories.push( $(this).data('category') );
		});

		// filtra removendo duplicados
		categories = categories.filter(function(categoty, indice) {
			return categories.indexOf(categoty) === indice;
		});

		// categorias em array
		return categories;
	};

	app.isCategory = function(categories, value) {
		return categories.some(function(category) {
			return category === value;
		});
	};

	app.searchCategoryPrateleiras = function(category) {
		var prateleira = $('.prateleira-combos');

		prateleira.map(function() {
			var categories = app.searchCategory($(this));

			if (!(app.isCategory(categories, category))) {
				$(this).closest('.combos-prateleira').fadeOut();
			}
		});
	};

	app.addCategories = function(data) {
		dust.render('category-combos', data, function(err, out) {
			if (err) {
				throw new Error('Prateleira Combos Dust error: ' + err);
			}

			$('.combos-category__conteiner').append(out);
		});
	};

	/**
	 * Varre array de nomes de categorias do JSON selecionando a atual
	 * @param {Array} categories array 'name' do JSON com todas as categorias possíveis do grupo
	 * @param {String} value texto da categoria atual que esta sendo procurada
	 * @returns {String} texto da categoria encontrada
	 */
	app.isNameCategory = function(categories, value) {
		return categories.find(function(category) {
			return category === value;
		});
	};

	/**
	 * Varre JSON e retorna os dados/detalhes de determinada categoria
	 * @param  {String} value texto contendo nome da categoria
	 * @returns {Object} Objeto com dados da categoria
	 */
	app.isTextCategory = function(value) {
		return itemsFilter.find(function(category) {
			return app.isNameCategory(category.name, value) === value;
		});
	};

	app.sortFilter = function(categories) {
		return categories.sort(function(a,b) {
			if (a.group < b.group) {
				return -1;
			}

			if (a.group > b.group) {
				return 1;
			}

			return 0;
		});
	};

	app.separateIntoGroups = function(newArrayCategories) {
		var groupName = newArrayCategories[0].group,
			group = [],
			groups = [],
			others = [];

		newArrayCategories.map(function(value, indice) {

			if(value.group === undefined) {
				value.group = 'Outros';
				others.push(value);
			} else {
				if (groupName === value.group) {
					group.push(value);
				} else {
					groupName = value.group;
					groups.push(group);
					group = [];
					group.push(value);
				}
			}

			if ((indice+1) === newArrayCategories.length) {
				groups.push(group);
				others ? groups.push(others) : false;
			}
		});

		return groups;
	};

	app.loadCategories = function() {
		var arrayCategories = app.searchCategory($('.prateleira-combos')),
			newArrayCategories = [],
			groups = [],
			objectCategories;

		if ($(window).width() <= 768) {
			arrayCategories.map(function(category) {
				var itemCategory = app.isTextCategory(category);

				itemCategory ? newArrayCategories.push({'group': itemCategory.group, 'name': category, 'text': itemCategory.text}) : newArrayCategories.push({'name': category, 'text': category});
			});

			app.sortFilter(newArrayCategories);
			groups = app.separateIntoGroups(newArrayCategories);

			groups.map(function(value) {
				objectCategories = {
					categories : value
				};
				app.addCategories(objectCategories);
			});

			return;
		}

		arrayCategories.map(function(category, indice) {
			var itemCategory = app.isTextCategory(category); // Detalhes vindos do JSON

			// Renderiza em grupos a cada 5 categorias, verifica se é multiplo de 5 ou último para o render
			if(((indice+1) % 5) === 0 || (arrayCategories.length-1) === indice) {
				itemCategory ? newArrayCategories.push({'name': category, 'text': itemCategory.text}) : newArrayCategories.push({'name': category, 'text': category});
				objectCategories = {
					categories : newArrayCategories
				};

				app.addCategories(objectCategories); // Render
				newArrayCategories = [];
			} else {
				itemCategory ? newArrayCategories.push({'name': category, 'text': itemCategory.text}) : newArrayCategories.push({'name': category, 'text': category});
			}
		});

		// Tem menos que 5 itens, renderiza em única coluna
		if((arrayCategories.length) <= 5) {
			objectCategories = {
				categories : arrayCategories
			};

			app.addCategories(newArrayCategories); // Render
		}
	};

	app.addGroupMobile = function() {
		var categoryItems = $('.combos-category__items');

		categoryItems.map(function(indice, value) {
			var group = $($(value).find('.combos-category__item')[0]).attr('data-group');
			$(value).find('.combos-category__title-items').text(group);
		});
	};

	return app;
});
