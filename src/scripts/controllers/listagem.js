/* global $:true, Nitro: true, _:true */

var enquire = require('vendors/enquire');
require('vendors/slick');

require('modules/list-more');
require('modules/compare');
require('modules/slider-banner');
require('modules/resultado-busca');
require('custom/modal.overlayAbandono');
//require('custom/promo.lightbox');
//require('custom/modal.cupom10off');
//require('modules/filters');

Nitro.controller('listagem', ['list-more', 'compare', 'slider-banner', 'modal.overlayAbandono'/*, 'promo.lightbox'*//*, 'modal.cupom10off'*//*, 'filters'*/], function() {

	'use strict';

	// $('.titulo-sessao')
	// 	.after( $('.didyoumean').show() )
	// 	.append( $('.resultado-busca-termo .value').first().show() );

	var $filter 		= $('.filter-wrapper'),
		$listContainer = $('.list-container'),
		$searchSingle 	= $('.search-single-navigator'),
		$listOrders 	= $('ul.order-by');
	$(window).scroll( $.throttle(function(){

		$filter.add('.filter-container').toggleClass('pinned', $(window).scrollTop() >= $listContainer.offset().top - $filter.height() );

	}, 250) ).scroll();


	var $filterOptions = $('#O:first option'),
		$filterSelected = $filterOptions.filter(':selected'),
		ignoreFilters = ['OrderByNameASC', 'OrderByNameDESC', 'OrderByReviewRateDESC'],
		urlParams = _.urlParams(); //parse params from url

	var $filters = $filterOptions.filter(function() {
		return  $(this).val() !== '' && ignoreFilters.indexOf( $(this).val() ) === -1;
	}).map(function() {

		var self = $(this);

		urlParams.O = self.val(); //set Order Parameter value

		var url = window.location.pathname + '?' + $.param( urlParams ); //encode params to string

		return '<li><a href="' + url + '" title="' + self.text() + '">' + self.text() + '</a></li>';
	}).get().join('');

	$listOrders.append( $filters );

	//TODO: pluralize
	var orderText = ! $('body').is('.busca') ? 'Temos ' + $('.resultado-busca-numero:first .value').text() + ' itens' : '';
	$('.order-title').html('<span>' + orderText + ' ordenados por </span>' + $filterSelected.text() );


	var $categoriesList, $dropElements, $moreCatHolder, $moreCatList;

	if( $('body').is('.departamento') ) {

		//get all categories
		$categoriesList = $searchSingle.find('h4');

		//create more drowpdown if category bigger than 2
		if( $categoriesList.length > 1 ) {

			$dropElements = $categoriesList.slice(2, $categoriesList.length);

			$moreCatHolder = $('<div class="single-filter-wrapper more-cat"><h5>Mais categorias</h5></div>');
			$moreCatList = $('<ul />');

			$dropElements.each(function() {
				$moreCatList.append( '<li>' + $(this).html() + '</li>' );
			});

			$moreCatList.append( $dropElements );

			$moreCatHolder
				.append( $moreCatList )
				.appendTo( $('.departament-nav > div') );

			$dropElements.remove();

		}

		//show first 2 categories, TODO: use css nth-child
		$categoriesList.css('display', 'inline-block');

	} else if( $('body').is('.busca') ) {

		//get all categories
		$categoriesList = $('.menu-departamento li').not('.lista-completa');

		//console.log('$categoriesList', $categoriesList);

		//create more drowpdown if category bigger than 2
		if( $categoriesList.length > 1 ) {

			$dropElements = $categoriesList.slice(2, 20);

			//console.log('$dropElements', $dropElements);

			$moreCatHolder = $('<div class="single-filter-wrapper more-cat"><h5>Mais categorias</h5></div>');

			$moreCatList = $('<ul />');

			$moreCatList.append( $dropElements.clone() );

			$moreCatHolder
				.append( $moreCatList )
				.appendTo( $('.departament-nav > div') );

			//$dropElements.remove();

		}

		//show first 2 categories, TODO: use css nth-child
		$categoriesList.css('display', 'inline-block');

	}

	$searchSingle.find('h5:not(.HideMarca)').each(function(){
		var self 		= $(this),
			$list 		= self.next('ul'),
			$childens 	= $list.children(),
			$active		= $childens.filter('.filtro-ativo');

		if($childens.length > 0 ) {
			$list.andSelf().wrapAll('<div class="single-filter-wrapper"/>');

			if( $active.length > 0 ) {
				self.text($active.text());
				self.parent().addClass('active-filter');
				$list.remove();
			}
		}else{
			self.remove();
		}
	});

	$searchSingle.find('h4 + ul').each(function() {
		$(this).appendTo( $(this).prev('h4') );
	});

	//remove count from filters;
	$searchSingle.find('a').each(function() {
		$(this).text( $(this).attr('title') );
	});

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

	if( map && map !== '') {

		var mapParams = map.split(','),
			urlRest = window.location.pathname.split('/');

		//get categories count
		var count = $.grep(mapParams, function( item ){
			return item === 'c';
		}).length;

		// concat only categories from pathname plus first slash
		var url = urlRest.slice(0, count + 1).join('/');

		$('.departament-nav > div').append('<a href="'+ url +'" class="clear-filter">Limpar</a>');
	}

	/*if( $searchSingle.find('.active-filter').length > 0 ) {
		$('.departament-nav > div').append('<a href="'+ window.location.href.substr(0, window.location.href.lastIndexOf('/')) +'" class="clear-filter">Limpar</a>');
	}*/


		//--MEDIA QUERY SCRIPTS
	//-TABLET RETRATO
	var queryTablet = 'screen and (max-width: 60em)';

	enquire.register(queryTablet, {

		match: function() {

			$('.title-filter').click(function(e) {
				e.preventDefault();
				$(this).add('.search-single-navigator').toggleClass('active');
			});

			$(document).on('click', '.single-filter-wrapper' , function(){
				$(this).find('ul').toggleClass('active');
			});

		}

	});

	enquire.unregister(queryTablet);


	$('.prateleira-slider .prateleira ul').not('.product-field ul').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3,
		responsive: [
			{
				breakpoint: 1019,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});


	$('#quem-viu-clicou h2').text('Produtos em destaque');

});