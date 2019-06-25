/* global $:true, Nitro: true, _:true */
'use strict';

require('vendors/vtex-modal');

require('modules/list-more');
require('modules/listagem/filters');
require('modules/listagem/order-by');
require('modules/listagem/calculadorabtu');
require('modules/listagem/comparebar');
require('modules/slider-banner');
require('modules/resultado-busca');
require('modules/chaordic');
require('modules/listagem/busca-chaordic');
require('modules/listagem/comparebar');
// require('modules/compare');
//require('custom/modal.cupom10off');
//require('modules/filters');

Nitro.controller('listagem', ['chaordic', 'list-more', 'filters', 'order-by', 'slider-banner', 'resultado-busca', 'calculadorabtu' , 'busca-chaordic', 'comparebar' ], function(chaordic) {
	var $body = $('body');

	//INICIA CHAMADA DAS VITRINES CHAORDIC
	chaordic.init('category');

	// Limpar localstorage na página de busca
	if( $body.hasClass('busca') ) {
		localStorage.clear();
	}

	// Teste AB
	var urlTesteAb = window.location.search;
	var testeA = 'testeab=a';
	var testeB = 'testeab=b';

	if ( urlTesteAb.indexOf(testeA) >= 0 ) {
		$body.addClass('ab-test__mobile--show-b');
	}
	else if ( urlTesteAb.indexOf(testeB) >= 0 ) {
		$body.addClass('ab-test__mobile--show-b');
		// teste vitrine chaordic
		$body.addClass('test__vitrine--show-b');
	}


	var self = this,
		$searchSingle = $('.search-single-navigator'),
		$listOrders = $('ul.order-by');

	var $filterOptions = $('#O:first option'),
		// $filterSelected = $filterOptions.filter(':selected'),
		ignoreFilters = ['OrderByNameASC', 'OrderByNameDESC', 'OrderByReviewRateDESC'],
		urlParams = _.urlParams(); //parse params from url

	var $filters = $filterOptions.filter(function() {
		return $(this).val() !== '' && ignoreFilters.indexOf($(this).val()) === -1;
	}).map(function() {

		var self = $(this);

		urlParams.O = self.val(); //set Order Parameter value

		var url = window.location.pathname + '?' + $.param(urlParams); //encode params to string

		return '<li><a href="' + url + '" title="' + self.text() + '">' + self.text() + '</a></li>';
	}).get().join('');

	$listOrders.append($filters);

	//TODO: pluralize
	var orderText = !$('body').is('.busca') ? 'Temos ' + $('.resultado-busca-numero:first .value').text() + ' itens' : '';
	$('.order-title').html('<span>' + orderText + ' ordenados por </span><em>selecione</em>');
	$('.order-wrapper').prepend('<span class="txt-filtro"></span> ');


	var $categoriesList, $dropElements, $moreCatHolder, $moreCatList;

	if ($('body').is('.departamento')) {

		//get all categories
		$categoriesList = $searchSingle.find('h4');

		//create more drowpdown if category bigger than 2
		if ($categoriesList.length > 1) {

			$dropElements = $categoriesList.slice(2, $categoriesList.length);

			$moreCatHolder = $('<div class="single-filter-wrapper more-cat"><h5>Mais categorias</h5></div>');
			$moreCatList = $('<ul />');

			$dropElements.each(function() {
				$moreCatList.append('<li>' + $(this).html() + '</li>');
			});

			$moreCatList.append($dropElements);

			$moreCatHolder
				.append($moreCatList)
				.appendTo($('.departament-nav > div'));

			$dropElements.remove();

		}

		//show first 2 categories, TODO: use css nth-child
		$categoriesList.css('display', 'inline-block');

	} else if ($('body').is('.busca')) {

		//get all categories
		$categoriesList = $('.menu-departamento li').not('.lista-completa');

		//console.log('$categoriesList', $categoriesList);

		//create more drowpdown if category bigger than 2
		if ($categoriesList.length > 1) {

			$dropElements = $categoriesList.slice(2, 20);

			//console.log('$dropElements', $dropElements);

			$moreCatHolder = $('<div class="single-filter-wrapper more-cat"><h5>Mais categorias</h5></div>');

			$moreCatList = $('<ul />');

			$moreCatList.append($dropElements.clone());

			$moreCatHolder
				.append($moreCatList)
				.appendTo($('.departament-nav > div'));

			//$dropElements.remove();

		}

		//show first 2 categories, TODO: use css nth-child
		$categoriesList.css('display', 'inline-block');

	}

	//ANTIGO FILTRO
	// $searchSingle.find('h5:not(.HideMarca)').each(function() {
	//     var self = $(this),
	//         $list = self.next('ul'),
	//         $childens = $list.children(),
	//         $active = $childens.filter('.filtro-ativo');

	//     if ($childens.length > 0) {
	//         $list.andSelf().wrapAll('<div class="single-filter-wrapper"/>');

	//         if ($active.length > 0) {
	//             self.text($active.text());
	//             self.parent().addClass('active-filter');
	//             $list.remove();
	//         }
	//     } else {
	//         self.remove();
	//     }
	// });

	// $searchSingle.find('h4 + ul').each(function() {
	//     $(this).appendTo($(this).prev('h4'));
	// });

	// //remove count from filters;
	// $searchSingle.find('a').each(function() {
	//     $(this).text($(this).attr('title'));
	// });

	/*if( $searchSingle.find('.single-filter-wrapper').length <= 0 && $searchSingle.find('h4:visible').length <= 0 ) {
		$('.filter-wrapper').remove();
	}*/

	var activeItem = function(e) {
		e.preventDefault();
		$(this).next('ul').andSelf().toggleClass('active');
	};

	$('.more-cat-title').hover(activeItem);

	$('.order-title').click(activeItem);



	//build clear filter button
	var map = _.urlParams().map;

	if (map && map !== '') {

		var mapParams = map.split(','),
			urlRest = window.location.pathname.split('/');

		//get categories count
		var count = $.grep(mapParams, function(item) {
			return item === 'c';
		}).length;

		// concat only categories from pathname plus first slash
		var url = urlRest.slice(0, count + 1).join('/');

		$('.departament-nav > div').append('<a href="' + url + '" class="clear-filter">Limpar</a>');
	}

	/*if( $searchSingle.find('.active-filter').length > 0 ) {
		$('.departament-nav > div').append('<a href="'+ window.location.href.substr(0, window.location.href.lastIndexOf('/')) +'" class="clear-filter">Limpar</a>');
	}*/

	//--MEDIA QUERY SCRIPTS
	//-TABLET RETRATO
	$(window).resize(function() {

		if( $(window).width() <= 768 ) {
			$('.title-filter').click(function(e) {
				e.preventDefault();
				$(this).add('.search-single-navigator').toggleClass('active');
			});

			$(document).on('click', '.single-filter-wrapper', function() {
				$(this).find('ul').toggleClass('active');
			});
		}
	}).resize();

	var $slider = $('section.slider .prateleira-slider .prateleira>ul').not('.slick-initialized');

	this.setupSlider = function($currentSlider) {
		$currentSlider.not('.slick-initialized').slick({
			infinite: true,
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
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});

		//ajusta para mobile - prateleira slider
		$('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');

	};


	$('#quem-viu-clicou h2').text('Produtos em destaque');


	//ANTIGO FILTRO
	//click abrir filtros no mobile
	// $('.open-filter').click(function(e) {
	//     e.preventDefault();

	//     $filter.slideToggle();
	// });

	// var $singleFilterWrapper = $searchSingle.find('.single-filter-wrapper h5');
	// $singleFilterWrapper.click(function(e) {
	//     e.preventDefault();

	//     var $singleFilterOptions = $(this).next('ul');

	//     if (!$singleFilterOptions.hasClass('open')) {
	//         $searchSingle.find('.open').slideUp().removeClass('open');
	//     }

	//     $singleFilterOptions.slideToggle().toggleClass('open');
	// });


	//inicia automaticamente prateleiras sliders no desktop
	if ($(window).width() > 768) {
		self.setupSlider($slider);
	}


	//mobile - abrir vitrines
	if ($(window).width() <= 768) {
		$('section.slider .pre-title').click(function(e){
			e.preventDefault();

			if ($(this).hasClass('open')) {
				$(this).removeClass('open');
				$(this).siblings().find('.prateleira>ul').slideUp();
			} else {
				$('section.slider .open').siblings().find('.prateleira>ul').slideUp();
				$('section.slider .open').removeClass('open');
				$(this).addClass('open');
				$(this).siblings().find('.prateleira>ul').slideDown('slow',function(){
					self.setupSlider($(this));
				});
			}
		});

		$('section.slider').each(function() {
			$(this).find('.pre-title').trigger('click');
		});

		// $('section.slider').eq(0).find('.pre-title').trigger('click');
	}


	if ($('.category-list ul').length === 0) {
		$('.category-list').addClass('hide');
		$('.filter-wrapper > p:first-of-type').addClass('hide');
	}
});
