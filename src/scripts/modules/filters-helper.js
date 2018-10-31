'use strict';

var FiltersHelper = {};

FiltersHelper.rel = '';
FiltersHelper.orderRel = '';
FiltersHelper.page = 2;
FiltersHelper.filters = $('.filters');
FiltersHelper.vitrineHolder = $('#prateleira');
FiltersHelper.vitrine = FiltersHelper.vitrineHolder.find('.vitrine');
FiltersHelper.query = /load\(\'(.*)\'/.exec( FiltersHelper.vitrine.find('> script').text() ); // eslint-disable-line
FiltersHelper.url = function(){
	if( FiltersHelper.query && FiltersHelper.query.length > 0 ) {
		return FiltersHelper.query[1];
	} else {
		return;
	}
};
FiltersHelper.setRel = function(e, currentFilter, isOrder){
	if(!isOrder){
		FiltersHelper.rel = currentFilter;
	}
	$('#list-more').removeClass('hide');
};
FiltersHelper.setURL = function(){
	if(FiltersHelper.rel === '&'){
		window.history.pushState(null, null, '?filter' + encodeURIComponent(FiltersHelper.orderRel));
	} else if(FiltersHelper.orderRel === '&'){
		window.history.pushState(null, null, '?filter' + encodeURIComponent(FiltersHelper.rel));
	} else {
		window.history.pushState(null, null, '?filter' + encodeURIComponent(FiltersHelper.rel + FiltersHelper.orderRel));
	}
};

FiltersHelper.setOrderRel = function(order){
	FiltersHelper.orderRel = order;
};

FiltersHelper.getOrderRel = function(){
	return this.orderRel;
};

FiltersHelper.setFilterRel = function (newRel){
	FiltersHelper.rel = newRel;
};

FiltersHelper.getFilterRel = function (){
	return this.rel;
};

module.exports = FiltersHelper;
