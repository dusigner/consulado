'use strict';

var uri = require('vendors/Uri');

var FiltersHelper = {};

FiltersHelper.rel = '';
FiltersHelper.orderRel = '';
FiltersHelper.otherParametersRel = '';
FiltersHelper.page = 2;
FiltersHelper.filters = $('.filters');
FiltersHelper.vitrineHolder = $('#prateleira');
FiltersHelper.vitrine = FiltersHelper.vitrineHolder.find('.vitrine');
FiltersHelper.query = /load\(\'(.*)\'/.exec( FiltersHelper.vitrine.find('> script').text() );  // eslint-disable-line
FiltersHelper.url = function(){
	if( FiltersHelper.query && FiltersHelper.query.length > 0 ) {
		return FiltersHelper.query[1];
	} else {
		return;
	}
};
FiltersHelper.setRel = function(e, currentFilter, isOrder){
	if (!isOrder) {
		FiltersHelper.rel = currentFilter;
	}

	$('#list-more').removeClass('hide');
};

FiltersHelper.setURL = function() {
	var url = new uri(decodeURIComponent(window.location.href)).queryPairs;
	var otherParameters = [''];
	for (var i = 0; i < url.length; i++) {
		if ((url[i][0] === 'fq' && url[i][1].includes('H:')) || (url[i][0] !== 'fq' && url[i][0] !== '' && url[i][0] !== 'O') && (otherParameters.includes(url[i][0] +'='+ url[i][1]) === false)) {
			otherParameters.push(url[i][0] +'='+ url[i][1]);
		}
	}
	window.history.pushState(null, null, '?' + encodeURIComponent(FiltersHelper.rel + FiltersHelper.orderRel) + otherParameters.join('&'));
};

FiltersHelper.setOrderRel = function(order) {
	order.replace(order.match(/O=([^&]*)/), '');
	FiltersHelper.orderRel = order;
};

FiltersHelper.getOrderRel = function() {
	return this.orderRel;
};

FiltersHelper.setFilterRel = function (newRel) {
	FiltersHelper.rel = newRel;
};

FiltersHelper.getFilterRel = function () {
	return this.rel;
};

FiltersHelper.autoSortAndFilter = function (isFilter) {
	var filterComponents = decodeURIComponent(window.location.search).match(/fq=specificationFilter([^&]*)|fq=p:([^&]*)/gmi) || this.getFilterRel();
	var sortComponent = decodeURIComponent(window.location.search).match(/O=([^&]*)/gmi) || this.getOrderRel();

	if (sortComponent) {
		if (this.getOrderRel() === '') {
			sortComponent = '&' + sortComponent[0];
			this.setOrderRel(sortComponent);
		}
		sortComponent = $('.order-by li a').filter(function() {
			if ($(this).attr('data-order')) {
				return (sortComponent.indexOf($(this).attr('data-order').replace('&','')) !== -1);
			} else {
				return false;
			}
		});
	}

	if (filterComponents) {
		if (this.getFilterRel() === '') {
			this.setFilterRel(filterComponents.toString().replace(',','&'));
		}
		filterComponents = $('.multi-search-checkbox').filter(function() {
			return (filterComponents.indexOf( $(this).attr('rel') ) !== -1 && $(this).attr('value'));
		});
	}

	if (isFilter) {
		return filterComponents;
	} else {
		return sortComponent;
	}
};

module.exports = FiltersHelper;