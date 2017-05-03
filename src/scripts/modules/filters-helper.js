'use strict';

var FiltersHelper = {};

FiltersHelper.rel = '';
FiltersHelper.page = 2;
FiltersHelper.filters = $('.filters');
FiltersHelper.vitrineHolder = $('#prateleira');
FiltersHelper.vitrine = FiltersHelper.vitrineHolder.find('.vitrine');
FiltersHelper.query = /load\(\'(.*)\'/.exec( FiltersHelper.vitrine.find('> script').text() );
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

module.exports = FiltersHelper;