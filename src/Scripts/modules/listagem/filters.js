'use strict';

var helper = require('modules/filters-helper');
var noUiSlider = require('vendors/nouislider');

require('Dust/listagem/range.html');
require('Dust/listagem/filter-submenu.html');
require('modules/listagem/order-by');

Nitro.module('filters', ['order-by'], function(orderBy) {
	var self = this,
		$filterWrapper = $('.filter-wrapper'),
		$holder = $('.search-multiple-navigator'),
		$options = $holder.find('fieldset.refino'),
		$checkbox = $('.multi-search-checkbox'),
		$listMore = $('#list-more'),
		page = 1,
		sliderStats = {
			start: 0,
			end: 150
		},
		sliderOpts = {
			connect: true,
			step: 100,
			margin: 100,
			format: {
				to: function(value) {
					return Math.round(value);
				},
				from: function(value) {
					return Math.round(value);
				}
			}
		};

	this.setup = function() {
		$options.each(function() {
			let $option = $(this),
				title = $option.find('h5').text();

			if (title === 'Faixa de preço') {
				$option.addClass('filtro-preco');
			}
		});

		$checkbox.change(function(e) {
			e.preventDefault();

			var $checked = $('.multi-search-checkbox:checked');

			self.setFilters();

			$checkbox.parent('label').removeClass('active');
			$checked.parent('label').addClass('active');

			$(this)
				.parent()
				.addClass('loading');
		});

		self.hideEmpty();
		self.dropDown();
		self.mobileClearFilter();
		self.specificationRange();
		self.openFilter();
		self.autoFilter();
	};

	/**
	 * Hides something empty
	 * */
	this.hideEmpty = function() {
		$options.each(function() {
			if (
				$(this)
					.find('div')
					.children().length === 0
			) {
				$(this).hide();
			}
		});
	};

	/**
	 * Make an ajax request to fill the showcase
	 * */
	this.request = function() {
		$.ajax({
			url: helper.url() + page + helper.getFilterRel() + helper.getOrderRel(),
			dataType: 'html',
			beforeSend: function() {
				helper.vitrineHolder.addClass('loading');
				helper.vitrine.removeClass('loaded');
			}
		})
			.done(function(data) {
				if (data) {
					try {
						localStorage.setItem(
							'filter' + vtxctx.categoryId + page + helper.getFilterRel() + helper.getOrderRel(),
							data
						);
					} catch (e) {
						if (e.code === 22 || e.code === 1014) {
							console.info('Quota exceeded! Clean ');
							localStorage.clear();
						}
					}
					$(window).trigger('filter', helper.getFilterRel());

					$('.vitrine > .prateleira').remove();

					helper.vitrine.addClass('loaded').append($(data).filter('.prateleira.default'));

					//aplica novamente a ordenacao apos selecionar um filtro
					if ($('ul.order-by .selected').length > 0) {
						orderBy.order($('ul.order-by .selected'));
					}

					self.renderSubmenu();

					$(window).trigger('changedFilter');

					Nitro.module('prateleira');

					//se tiver menos de 12 produtos, remove botão 'Ver mais'
					if (
						$(data)
							.filter('.prateleira.default')
							.find('>ul>li:not(.helperComplement)').length < 12
					) {
						$('#list-more').addClass('hidden');
					} else {
						$('#list-more').removeClass('hidden');
					}

					$('.sidebar-filter-submenu li').each(function() {
						if ($(this).attr('data-rel')) {
							if (
								$(this).attr('data-rel') &&
								$(this)
									.attr('data-name')
									.includes('BTU')
							) {
								$(this).css('display', 'none');
							}
							if (
								$(this).attr('data-rel') &&
								$(this)
									.attr('data-name')
									.match(/[0-9]*L/)
							) {
								$(this).css('display', 'none');
							}
							if (
								$(this).attr('data-rel') &&
								$(this)
									.attr('data-name')
									.match(/[0-9]*Kg/)
							) {
								$(this).css('display', 'none');
							}
							if (
								$(this).attr('data-rel') &&
								$(this)
									.attr('data-value')
									.match(/\[(\d+) TO (\d+)\]/)
							) {
								$(this).css('display', 'none');
							}
						}
					});

					if ($('.sidebar-filter-submenu li:visible').length === 1) {
						$('.erase-filter').css('display', 'none');
					}

					helper.setURL();
				}
			})
			.always(function() {
				helper.vitrineHolder.removeClass('loading');
				$checkbox.parent().removeClass('loading');
				$listMore.show();
			});
	};

	this.dropDown = function() {
		$('.refino-marca, .refino')
			.find('h5')
			.click(function() {
				$(this).toggleClass('closed');
				$(this)
					.next('div')
					.stop()
					.slideToggle();
			});
	};

	/**
	 *  Clear all filters selected and show the default product list without filters
	 * */
	this.clearFilter = function() {
		// Remove class which defines the first and last value of range
		$('.filtro-range label')
			.removeClass('firstValue')
			.removeClass('lastValue');
		helper.setFilterRel('');
		$('.multi-search-checkbox:checked')
			.prop('checked', false)
			.change();
		self.specificationRange();
		self.clearFilterRel();
	};

	/**
	 *  Clear button which works on mobile
	 * */
	this.mobileClearFilter = function() {
		var $button = $(`
			<div class="mobile-buttons">
				<button class="clear-filter">Limpar filtros</button>
				<button class="close-filter">Voltar</button>
			</div>
		`);

		$filterWrapper.prepend($button);

		$('.clear-filter').click(function() {
			self.clearFilter();
		});

		$('.close-filter').on('click', function() {
			self.closeFilter();
		});
	};

	/**
	 * Create a range selector based on category specification
	 */
	this.specificationRange = function() {
		//REORDENA HTML ASC LIST = LABELS DO REFINO
		var sortLabels = function(list) {
			list.sort(function(a, b) {
				var aVal = $(a)
						.find('input')
						.val()
						.match(/\d+/gi),
					bVal = $(b)
						.find('input')
						.val()
						.match(/\d+/gi);
				if (aVal && bVal) {
					aVal = parseInt(aVal[0]);
					bVal = parseInt(bVal[0]);
				}
				return aVal - bVal;
			});
		};

		$options.each(function() {
			var $option = $(this),
				title = $option.find('h5').text();

			if (title === 'Capacidade' || title === 'BTUs') {
				var $labels = $option.find('label'),
					arrayOfLabels = [],
					rangeId,
					measure,
					step,
					$labelList;

				$labels.hide();

				// Choose the correct parameters to create the range slider based on category page
				if ($labels.length >= 1) {
					if (
						title === 'Capacidade' &&
						window.location.href.toLowerCase().indexOf('geladeira---refrigerador') >= 0
					) {
						rangeId = 'rangeListagem';
						measure = 'L';

						$labelList = $('h5:contains("Capacidade") + div label');
						sortLabels($labelList);
						$('h5:contains("Capacidade") + div').html($labelList);
					}

					if (title === 'BTUs') {
						rangeId = 'rangeBTUs';
						measure = 'BTU/h';

						$labelList = $('h5:contains("BTUs") + div label');
						sortLabels($labelList);
						$('h5:contains("BTUs") + div').html($labelList);
					}

					if (
						title === 'Capacidade' &&
						window.location.href.toLowerCase().indexOf('lavadora-de-roupas') >= 0
					) {
						rangeId = 'rangeQuilos';
						measure = 'Kg';

						$labelList = $('h5:contains("Capacidade") + div label');
						sortLabels($labelList);
						$('h5:contains("Capacidade") + div').html($labelList);
					}

					//MONTA ARRAY COM VALORES UNICOS P/ MONTAR O RANGE
					$labels.each(function() {
						var value = $(this)
								.find('input')
								.val(),
							numValue = value.match(/\d+/gi);
						if (numValue) {
							numValue = parseInt(numValue[0]);
							arrayOfLabels.push(numValue);
						}
					});

					arrayOfLabels.sort(function(a, b) {
						return a - b;
					});

					// Render slider
					dust.render('range', { rangeId: rangeId }, function(err, out) {
						if (err) {
							throw new Error('Modal Warranty Dust error: ' + err);
						}
						$option.find('div').append(out);
					});

					$option.addClass('filtro-range');

					if ($('.filtro-range').find('label').length <= 1) {
						$('.filtro-range').addClass('hide');
						return;
					}

					var $range = $('#' + rangeId)[0],
						steps = 100 / arrayOfLabels.length,
						actualStep = 0;

					sliderOpts.range = {};

					//MONTA CADA STEPS DO RANGE COM BASE NO ARRAYDELABELS ORDENADO
					$.each(arrayOfLabels, function(i, e) {
						var actualFinal = '';
						actualStep += steps;

						if (i === 0) {
							sliderOpts.range.min = e;
						} else if (i === arrayOfLabels.length - 1) {
							sliderOpts.range.max = e;
						} else {
							actualFinal = parseInt(actualStep) + '%';
							sliderOpts.range[actualFinal] = e;
						}
					});

					// Set intervals to the slider
					sliderOpts.start = [arrayOfLabels[0], arrayOfLabels[arrayOfLabels.length - 1]];
					sliderOpts.snap = true;
					sliderOpts.step = step;
					sliderOpts.margin = step;
					//sliderOpts.handles = step;

					noUiSlider.create($range, sliderOpts);

					// Function to update displayed intervals
					$range.noUiSlider.on('update', function(v) {
						sliderStats.start = v[0];
						sliderStats.end = v[1];
						$('#' + rangeId)
							.find('.slider__value--from')
							.text(v[0] + ' ' + measure);
						$('#' + rangeId)
							.find('.slider__value--to')
							.text(v[1] + ' ' + measure);
						$('#rangeBTUs')
							.find('.slider__value--from')
							.text((v[0] * 1000).toLocaleString('pt-BR') + ' ' + measure);
						$('#rangeBTUs')
							.find('.slider__value--to')
							.text((v[1] * 1000).toLocaleString('pt-BR') + ' ' + measure);
					});

					// Set the first and last interval values.
					$range.noUiSlider.on('change', function() {
						//RANGE ATUAL
						var thisRange = $('#' + rangeId).parents('.refino');

						//PEGA PRIMEIRO E ULTIMO VALOR SELECIONADO E ADD CLASS PREPARANDO OS VALORES DO REQUEST
						thisRange.find('label').removeClass('firstValue lastValue');
						thisRange
							.find('input[value^="' + sliderStats.start + '"]')
							.parent()
							.addClass('firstValue');
						thisRange
							.find('input[value^="' + sliderStats.end + '"]')
							.parent()
							.addClass('lastValue');

						self.setFilters();
					});
				}
			}
		});
	};

	this.openFilter = function() {
		$('.open-filter').click(function() {
			$filterWrapper.addClass('opened');
			//console.log('teste');
			if($('.overlay-filter').length === 0) {
				$('body').prepend('<div class="overlay-filter"></div>');
			} else {
				$('.overlay-filter').removeClass('hide');
			}

			$('.overlay-filter')
				.unbind('click')
				.click(function() {
					self.closeFilter();
				});
		});
	};

	this.closeFilter = function() {
		$('.overlay-filter').addClass('hide');
		$filterWrapper.removeClass('opened');
	};

	/**
	 * Render submenu, where user can remove filters
	 * */
	self.renderSubmenu = function() {
		let $checked = $('.multi-search-checkbox:checked'),
			$range,
			measure,
			data = {};

		data.filters = [];
		data.range = [];
		data.showEraseAll = false;

		// Find all checked filters
		$('.sidebar-filter-submenu').remove();
		$checked.each(function(i, e) {
			var filter = {};
			if (
				$(e)
					.parents('fieldset')
					.is('.refino-marca')
			) {
				filter.value = $(e)
					.parent()
					.text();
			} else {
				filter.value = $(e).attr('value');
			}
			filter.rel = $(e).attr('rel');
			filter.name = $(e).attr('name');

			data.filters.push(filter);
			data.showEraseAll = true;
		});

		// Find the correct parameters based on category page
		if (vtxctx && vtxctx.categoryName) {
			if (vtxctx.categoryName.toLowerCase().indexOf('geladeira') >= 0) {
				measure = 'L';
			} else if (vtxctx.categoryName.toLowerCase().indexOf('lavadora') >= 0) {
				measure = 'Kg';
			} else if (vtxctx.categoryName.toLowerCase().indexOf('condicionado') >= 0) {
				measure = 'BTU/h';
			} else {
				measure = 'not';
			}
		}

		// Find the first and last element in the slider interval
		$range = self.getRange();
		if (measure !== 'not' && $range.length > 0 && self.checkRange()) {
			var range = {};
			if ($range[0] === $range[1]) {
				range.value = $range[0] + ' ' + measure;
			} else {
				range.value = $range[0] + ' ' + measure + ' a ' + $range[1] + ' ' + measure;
			}
			data.range.push(range);
			data.showEraseAll = true;
		}

		// Render submenu
		dust.render('filter-submenu', data, function(err, out) {
			if (err) {
				throw new Error('Sidebar Filter Submenu Dust error: ' + err);
			}
			$('div.main').prepend(out);
			self.filterSubmenu();
		});
	};

	/**
	 * Add functions to the submenu buttons
	 */

	self.filterSubmenu = function() {
		// Button to remove regular filters
		$('.sidebar-filter-submenu li')
			.not('.erase-filter')
			.not('.remove-range')
			.on('click', function(e) {
				e.stopPropagation();

				var rel = $(this).data('rel');
				$('.multi-search-checkbox[rel="' + rel + '"]').trigger('click');
			});

		// Button to remove slider filters
		$('.remove-range').on('click', function(e) {
			e.stopPropagation();

			$('.filtro-range label')
				.removeClass('firstValue')
				.removeClass('lastValue');
			self.setFilters();

			self.specificationRange();
		});

		// Button to remove all filters
		$('.erase-filter').on('click', function(e) {
			e.stopPropagation();

			self.clearFilter();
		});
	};

	/**
	 * Function to read all URL parameters and filter according to fq parameters.
	 * Additionally, also reads ranged filters and display the slider according to the interval
	 * */
	this.autoFilter = function() {
		let filterComponents = helper.autoSortAndFilter(true),
			$range = $('.filtro-range');

		for (let index = 0; index < filterComponents.length; index++) {
			let element = filterComponents.eq(index);

			// Checks if this is a ranged filter and determines the first and last value from range
			// Else, if this is a regular filter, just check the respective checkbox
			if (self.isRangeFilter(element[0])) {
				if ($range.length > 0 && !$range.find('label').hasClass('firstValue')) {
					element
						.parent()
						.addClass('firstValue')
						.addClass('lastValue');
				} else if ($range.find('label').hasClass('firstValue')) {
					filterComponents
						.eq(index - 1)
						.parent()
						.removeClass('lastValue');
					element.parent().addClass('lastValue');
				}
			} else {
				if (element.attr('checked', false)) {
					element.attr('checked', true).change();
				}
			}
		}

		$range.find('label').removeClass('active');

		self.setFilters();
	};

	this.isRangeFilter = function(elementParameter) {
		let isQA = $('body').hasClass('consul') ? false : true;
		if (!isQA) {
			return (
				elementParameter.outerHTML.includes('specificationFilter_810') ||
				elementParameter.outerHTML.includes('specificationFilter_811') ||
				elementParameter.outerHTML.includes('specificationFilter_814')
			);
		} else {
			return (
				elementParameter.outerHTML.includes('specificationFilter_74') ||
				elementParameter.outerHTML.includes('specificationFilter_77')
			);
		}
	};

	/**
	 * Filter according to selected filters
	 * */
	this.setFilters = () => {
		var $checked = $('.multi-search-checkbox:checked'),
			$option = $('.filtro-range'),
			rangeId;

		helper.setFilterRel('');

		// Find the correct parameters based on category page
		if (vtxctx && vtxctx.categoryName) {
			if (vtxctx.categoryName.toLowerCase().indexOf('geladeira') >= 0) {
				rangeId = 'rangeListagem';
			} else if (vtxctx.categoryName.toLowerCase().indexOf('lavadora') >= 0) {
				rangeId = 'rangeQuilos';
			} else if (vtxctx.categoryName.toLowerCase().indexOf('condicionado') >= 0) {
				rangeId = 'rangeBTUs';
			} else {
				rangeId = 'not';
			}
		}

		// Add to URL regular filters selected
		$checked.each(function() {
			helper.setFilterRel(helper.getFilterRel() + '&' + $(this).attr('rel'));
		});
		// Add to URL ranged filters selected
		if (rangeId !== 'not' && self.checkRange()) {
			if ($option.find('label').hasClass('firstValue')) {
				// Checks if the first value and the last value in the interval are the same.
				if ($option.find('label.firstValue').index() === $option.find('label.lastValue').index()) {
					helper.setFilterRel(
						helper.getFilterRel() +
							'&' +
							$option
								.find('label.firstValue')
								.children('input')
								.attr('rel')
					);
				} else {
					$option
						.find('label.firstValue')
						.nextUntil('label.lastValue')
						.add('label.firstValue, label.lastValue')
						.each(function() {
							helper.setFilterRel(
								helper.getFilterRel() +
									'&' +
									$(this)
										.children('input')
										.attr('rel')
							);
						});
				}
			}
			helper.vitrine.addClass('filtered');

			let startAndEnd = self.getRange(),
				$range = $('#' + rangeId)[0];

			// Show on the slider the correct interval values
			if (startAndEnd.length > 0) {
				sliderOpts.start = [startAndEnd[0], startAndEnd[1]];
				$range.noUiSlider.updateOptions(sliderOpts);
			}
		}

		self.request();
	};

	/**
	 * Check if the first value is also the last interval element and if the last value is also the last interval element on slider. If they are, them it is not filtering anything
	 * @return true if they are not the same respective value
	 * @return false if they are the same respective value
	 */
	this.checkRange = () => {
		let isFiltering,
			$element = $('.filtro-range label');

		$element.first().hasClass('firstValue') && $element.last().hasClass('lastValue')
			? (isFiltering = false)
			: (isFiltering = true);
		if (!isFiltering) {
			$element.removeClass('firstValue').removeClass('lastValue');
		}
		return isFiltering;
	};

	/**
	 * Get the first and the last selected value on slider
	 * @return an array containing the first and last value selected by the user
	 * */
	this.getRange = () => {
		let ans = [],
			$element = $('.filtro-range');

		if ($element.find('label').hasClass('firstValue')) {
			// Get the first selected element on range
			ans.push($element.find('.firstValue')[0].innerText.match(/(\d+)/gim)[0]);

			// Get the last selected element on range
			ans.push($element.find('.lastValue')[0].innerText.match(/(\d+)/gim)[0]);
		}

		return ans;
	};

	// ESCUTA CALCULADORA DE BTU E REALIZA FILTRO
	$(window).on('calculadora.filter', function(e, res) {
		helper.setFilterRel(helper.getFilterRel() + res);
		helper.setURL();
		self.autoFilter();
	});

	this.setup();
});
