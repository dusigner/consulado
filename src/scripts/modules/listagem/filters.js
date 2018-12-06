'use strict';

var helper = require('modules/filters-helper');
var noUiSlider = require('vendors/nouislider');

require('Dust/listagem/range-price.html');
require('Dust/listagem/range.html');
require('Dust/listagem/filter-submenu.html');

require('modules/listagem/order-by');

Nitro.module('filters', ['order-by'], function (orderBy) {
	var self = this,
		$filterWrapper = $('.filter-wrapper'),
		$holder = $('.search-multiple-navigator'),
		$options = $holder.find('fieldset.refino'),
		$checkbox =$('.multi-search-checkbox'),
		$listMore = $('#list-more'),
		page = 1,
		sliderStats = {
			start: 0,
			end: 150
		},
		sliderInit,
		sliderEnd,
		sliderOpts = {
			connect: true,
			step: 100,
			margin: 100,
			format: {
				to: function ( value ) {
					return Math.round(value);
				},
				from: function ( value ) {
					return Math.round(value);
				}
			}
		};


	this.setup = function() {

		// if (!$('body').hasClass('ab-test__mobile--show-b')) { // teste ab
		// 	// REMOVE NÚMEROS DOS ITENS DE FILTRO *(NN)*
		// 	$('.refino label, .refino-marca label').each(function() {
		// 		var menuText = $(this).text(),
		// 			menuInput = $(this).find('input');

		// 		$(this).text(menuText.replace(/ \(\d+\)/, ''));
		// 		$(this).prepend(menuInput);
		// 	}).css('display', 'block');
		// } // teste ab

		$checkbox.change(function(e) {
			e.preventDefault();

			var $checked = $('.multi-search-checkbox:checked');

			helper.setFilterRel('');

			$checked.each(function() {
				helper.setFilterRel(helper.getFilterRel() + '&' + $(this).attr('rel'));
			});
			

			$checkbox.parent('label').removeClass('active');
			$checked.parent('label').addClass('active');

			$(this).parent().addClass('loading');
			self.request();

		});

		self.autoFilter(null);
		self.hideEmpty();
		self.dropDown();
		self.mobileClearFilter();
		self.priceRange();
		self.specificationRange();
		self.openFilter();
	};

	this.hideEmpty = function() {
		$options.each(function() {
			if( $(this).find('div').children().length === 0 ) {
				$(this).hide();
			}
		});
	};

	this.request = function() {
		$.ajax({
			url: helper.url() + page +  helper.getFilterRel() + helper.getOrderRel(),
			dataType: 'html',
			beforeSend: function() {
				helper.vitrineHolder.addClass('loading');
				helper.vitrine.removeClass('loaded');
			}
		}).done(function(data) {
			if( data ) {

				try {
					localStorage.setItem('filter' + vtxctx.categoryId + page + helper.getFilterRel() + helper.getOrderRel(), data);
				} catch (e) {

					if (e.code === 22 || e.code === 1014) {
						console.info('Quota exceeded! Clean ');
						localStorage.clear();
					}
				}

				helper.setURL();

				$(window).trigger('filter', helper.getFilterRel());

				$('.vitrine > .prateleira').remove();

				helper.vitrine.addClass('loaded').append( $(data).filter('.prateleira.default') );

				//aplica novamente a ordenacao apos selecionar um filtro
				if ($('ul.order-by .selected').length > 0) {
					orderBy.order($('ul.order-by .selected'));
				}

				self.renderSubmenu();

				$(window).trigger('changedFilter');

				Nitro.module('prateleira');

				//se tiver menos de 12 produtos, remove botão 'Ver mais'
				if ($(data).filter('.prateleira.default').find('>ul>li:not(.helperComplement)').length < 12) {
					$('#list-more').addClass('hidden');
				} else {
					$('#list-more').removeClass('hidden');
				}

			}
		}).always(function() {
			helper.vitrineHolder.removeClass('loading');
			$checkbox.parent().removeClass('loading');
			$listMore.show();
		});
	};

	this.dropDown = function() {
		$('.refino-marca, .refino').find('h5').click(function() {
			$(this).toggleClass('closed');
			$(this).next('div').stop().slideToggle();
		});
	};

	this.clearFilter = function() {
		$('.multi-search-checkbox:checked').prop('checked', false).change();
		$('.priceRange').remove();
		self.priceRange();
		self.specificationRange();
	};

	this.mobileClearFilter = function() {
		var $button = $('<button class="clear-filter">Limpar filtros</div>');

		$filterWrapper.append($button);

		$('.clear-filter').click(function() {
			self.clearFilter();
			self.closeFilter();
		});

	};

	this.priceRange = function() {
		$options.each(function() {

			var $option = $(this),
				title = $option.find('h5').text();

			if( title === 'Faixa de preço' ){
				var $labels = $option.find('label'),
					firstLabel = $labels.filter(':first-child').find('input').val(),
					lastLabel = $labels.filter(':last-child').find('input').val();

				sliderInit = $.trim(firstLabel.substring(1, firstLabel.indexOf(' TO')));
				sliderEnd = $.trim(lastLabel.substring( lastLabel.lastIndexOf(' '), lastLabel.lastIndexOf(']') ));


				dust.render('range-price', [], function(err, out) {
					if (err) {
						throw new Error('Modal Warranty Dust error: ' + err);
					}

					$option.find('div').append(out);

				});


				$option.addClass('filtro-preco');

				var $range = $('#range')[0];

				sliderOpts.start = [0, parseInt(sliderEnd)];
				sliderOpts.range = {
					'min': parseInt(sliderInit),
					'max': parseInt(sliderEnd)
				};

				noUiSlider.create($range, sliderOpts);

				$range.noUiSlider.on('update', function(v){
					sliderStats.start = v[0];
					sliderStats.end = v[1];
					//console.log(v[0], v[1]);
					$('#range').find('.slider__value--from').text('R$ ' + _.formatCurrency(v[0]));
					$('#range').find('.slider__value--to').text('R$ ' + _.formatCurrency(v[1]));
				});


				$range.noUiSlider.on('change', function(){

					var $checked = $('.multi-search-checkbox:checked');

					helper.setFilterRel('');
					helper.setFilterRel('&fq=P:[' + sliderStats.start + ' TO ' + sliderStats.end + ']');

					$checked.each(function() {
						helper.setFilterRel(helper.getFilterRel() + '&' + $(this).attr('rel'));
					});

					helper.vitrine.addClass('filtered');

					self.request();
				});

			}
		});
	};

	this.specificationRange = function() {

		//REORDENA HTML ASC LIST = LABELS DO REFINO
		var sortLabels = function (list) {
			list.sort(function(a, b) {
				var aVal = $(a).find('input').val().match(/\d+/gi),
					bVal = $(b).find('input').val().match(/\d+/gi);
				if(aVal && bVal) {
					aVal = parseInt(aVal[0]);
					bVal = parseInt(bVal[0]);
				}
				return aVal - bVal;
			});
		};

		$options.each(function() {

			var $option = $(this),
				title = $option.find('h5').text();

			if( title === 'Capacidade' || title === 'BTUs' ){
				var $labels = $option.find('label'),
					arrayOfLabels = [],
					rangeId, measure, step, $labelList;

				$labels.hide();

				if($labels.length >= 1){

					if(title === 'Capacidade' && vtxctx.categoryName.toLowerCase().indexOf('geladeira') >= 0) {
						rangeId = 'rangeListagem';
						measure = 'L';

						$labelList =  $('h5:contains("Capacidade") + div label');
						sortLabels($labelList);
						$('h5:contains("Capacidade") + div').html($labelList);
					}

					if(title === 'BTUs') {
						rangeId = 'rangeBTUs';
						measure = 'BTU/h';

						$labelList =  $('h5:contains("BTUs") + div label');
						sortLabels($labelList);
						$('h5:contains("BTUs") + div').html($labelList);
					}

					if(title === 'Capacidade' && vtxctx.categoryName.toLowerCase().indexOf('lavadora') >= 0) {
						rangeId = 'rangeQuilos';
						measure = 'Kg';

						$labelList =  $('h5:contains("Capacidade") + div label');
						sortLabels($labelList);
						$('h5:contains("Capacidade") + div').html($labelList);
					}

					/*if(title === 'CapacidadeTeste' && vtxctx.categoryName.toLowerCase().indexOf('geladeira') >= 0) {
						rangeId = 'rangeTeste';
						measure = 'Kg';

						var $labelList =  $('h5:contains("CapacidadeTeste") + div label');
						sortLabels($labelList);
						$('h5:contains("CapacidadeTeste") + div').html($labelList);
					}*/

					//MONTA ARRAY COM VALORES UNICOS P/ MONTAR O RANGE
					$labels.each(function() {
						var value = $(this).find('input').val(),
							numValue = value.match(/\d+/gi);
						if(numValue) {
							numValue = parseInt(numValue[0]);
							arrayOfLabels.push(numValue);
						}
					});

					arrayOfLabels.sort(function(a, b){
						return a - b;
					});

					dust.render('range', { rangeId: rangeId}, function(err, out) {
						if (err) {
							throw new Error('Modal Warranty Dust error: ' + err);
						}

						$option.find('div').append(out);

					});


					$option.addClass('filtro-range');

					var $range = $('#' + rangeId)[0],
						steps = (100 / arrayOfLabels.length),
						actualStep = 0;

					sliderOpts.range = {};

					//MONTA CADA STEPS DO RANGE COM BASE NO ARRAYDELABELS ORDENADO
					$.each(arrayOfLabels, function(i, e) {
						var actualFinal = '';

						actualStep += steps;

						if(i === 0) {
							sliderOpts.range.min = e;
						} else if (i === (arrayOfLabels.length - 1)) {
							sliderOpts.range.max = e;
						} else {
							actualFinal = parseInt(actualStep) + '%';
							sliderOpts.range[actualFinal] = e;
						}
					});

					sliderOpts.start = [arrayOfLabels[0], arrayOfLabels[arrayOfLabels.length - 1]];
					sliderOpts.snap = true;
					sliderOpts.step = step;
					sliderOpts.margin = step;
					//sliderOpts.handles = step;

					noUiSlider.create($range, sliderOpts);

					$range.noUiSlider.on('update', function(v){
						sliderStats.start = v[0];
						sliderStats.end = v[1];
						$('#' + rangeId).find('.slider__value--from').text((v[0] * 1000).toLocaleString('pt-BR') + ' ' + measure);
						$('#' + rangeId).find('.slider__value--to').text((v[1] * 1000).toLocaleString('pt-BR') + ' ' + measure);
					});


					$range.noUiSlider.on('change', function(){

						//pega os atuais filtros
						helper.setFilterRel(decodeURIComponent(window.location.hash).substr(decodeURIComponent(window.location.hash).indexOf('&')));
						//helper.rel = '&fq=P:[' + sliderStats.start + ' TO ' + sliderStats.end + ']';


						//remove todas as opções do range atual da string de filtros
						$option.find('label').each(function(){
							helper.setFilterRel(helper.getFilterRel().replace('&' + $(this).children('input').attr('rel'), ''));
						});


						//RANGE ATUAL
						var thisRange = $('#' + rangeId).parents('.refino');

						//PEGA PRIMEIRO E ULTIMO VALOR SELECIONADO E ADD CLASS PREPARANDO OS VALORES DO REQUEST
						thisRange.find('label').removeClass('firstValue lastValue');
						thisRange.find('input[value^="' + sliderStats.start + '"]').parent().addClass('firstValue');
						thisRange.find('input[value^="' + sliderStats.end + '"]').parent().addClass('lastValue');

						//adiciona na string os valores do range selecionado
						if ($option.find('label.firstValue').index() === $option.find('label.lastValue').index()) {
							helper.setFilterRel(helper.getFilterRel() + '&' + $option.find('label.firstValue').children('input').attr('rel'));
						} else {
							$option.find('label.firstValue').nextUntil('label.lastValue').add('label.firstValue, label.lastValue').each(function(){
								helper.setFilterRel( helper.getFilterRel() + '&' + $(this).children('input').attr('rel'));
							});
						}

						helper.vitrine.addClass('filtered');

						self.request();

					});
				}
			}
		});
	};

	this.openFilter = function() {

		$('.open-filter').click(function() {
			//console.log('teste');
			if($('.overlay-filter').length === 0) {
				$('body').prepend('<div class="overlay-filter"></div>');
			}else {
				$('.overlay-filter').removeClass('hide');
			}
			$filterWrapper.addClass('opened');

			$('.overlay-filter').unbind('click').click(function() {
				self.closeFilter();
			});
		});
	};

	this.closeFilter = function() {
		$filterWrapper.removeClass('opened');
		$('.overlay-filter').addClass('hide');
	};


	self.renderSubmenu = function() {
		var $checked = $('.multi-search-checkbox:checked'),
			data = {};

		data.filters = [];

		$('.sidebar-filter-submenu').remove();

		$checked.each(function(i, e) {
			var filter = {};
			if($(e).parents('fieldset').is('.refino-marca')) {
				filter.value = $(e).parent().text();
			}else {
				filter.value = $(e).attr('value');
			}
			filter.rel = $(e).attr('rel');
			filter.name = $(e).attr('name');


			data.filters.push(filter);
		});

		//console.log('filters', data);

		dust.render('filter-submenu', data, function(err, out) {
			if (err) {
				throw new Error('Sidebar Filter Submenu Dust error: ' + err);
			}
			$('div.main').prepend(out);
			self.filterSubmenu();
		});
	};


	self.filterSubmenu = function() {
		$('.sidebar-filter-submenu li').not('.erase-filter').on('click', function(e) {
			e.stopPropagation();

			var rel = $(this).data('rel');
			$('.multi-search-checkbox[rel="' + rel +'"]').trigger('click');

		});

		$('.erase-filter').on('click', function(e) {
			e.stopPropagation();

			self.clearFilter();

		});
	};

	this.autoFilter = function(state) {
		var loc = state ? state : window.location.href;

		if( /\?filter./.test(decodeURIComponent(loc))) {	
			helper.setFilterRel(decodeURIComponent(loc).substr(decodeURIComponent(loc).indexOf('&')));
			
			$('.order-by li a').each(function(){
				helper.setFilterRel(helper.getFilterRel().replace($(this).attr('data-order'), ''));
			});

			var currentFilters = helper.getFilterRel().split('&');

			currentFilters = $('.multi-search-checkbox').filter(function() {
				return ( currentFilters.indexOf( $(this).attr('rel') ) !== -1 && $(this).attr('value') );
			});

			if(currentFilters.attr('checked', false)){
				currentFilters.attr('checked', true).change();
			}

			self.request();
		}
	};

	// ESCUTA CALCULADORA DE BTU E REALIZA FILTRO
	$(window).on('calculadora.filter', function(e, res) {
		self.autoFilter(res);
	});

	/*window.onpopstate = function(e) {
		window.history.pushState(null, null, e.currentTarget.location.hash);
		self.autoFilter(e.currentTarget.location.hash);
	};*/

	this.setup();


});