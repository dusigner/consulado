'use strict';

Nitro.module('list-more', function() {


	var self = this,
		$button = $('#list-more'),
		$vitrine = $('.vitrine'),
		$prateleira = $vitrine.find('> .prateleira'),
		query = /load\(\\'(.*)\\'/.exec( $vitrine.find('> script').text() ),
		grid = +$('#PS').val(),
		page = 2,
		url,
		rel = '',
		path = window.location.pathname;

	$(window).on('filter', function(e, currentFilter){
		rel = currentFilter;
		page = 2;
		$button.removeClass('hide');
	});

	this.setup = function() {

		if( query && query.length > 0 && this.isActive() ) {
			url = query[1];
		} else {
			return;
		}

		$button.click(this.loadContent).removeClass('hide');

		this.prefetch();
	};

	this.isActive = function() {
		return $prateleira.find('li[layout]').length % grid === 0;
	};

	this.updateCompare = function() {
		var newsIds = localStore.get('comparador');

		if(newsIds) {
			newsIds.forEach(function(val) {
				var product = $('#prateleira .compare-product-checkbox[rel='+val.rel+']');
				if( product.length > 0 && !product.hasClass('selected') ) {
					product.addClass('selected').parent().find('label').text('Selecionado');
				}
			});
		}
	};

	this.loadContent = function() {
		// console.log('SALE', url + page);
		$.ajax({
			url: url + page + rel,
			localCache: true,
			cacheTTL: 1,
			cacheKey: 'more' + path + page + rel,
			dataType: 'html',
			beforeSend: function(){
				// console.log('page', page);

				if( $button.is('loading') ){
					return false;
				}else{
					$button.addClass('loading');
					return true;
				}

			}
		}).done(function(data) {
			if( data ) {
				$('.vitrine > .prateleira').append( data );
				Nitro.module('prateleira');
				// console.log( 'active', self.isActive() );
				if( self.isActive() ) {
					page++;
					self.prefetch();
				} else {
					$button.addClass('hide');
				}
			} else {
				$button.addClass('hide');
			}
		}).always(function() {
			$button.removeClass('loading');
			self.updateCompare();
		});
	};

	this.prefetch = function() {
		$.ajax({
			url: url + page + rel,
			localCache: true,
			cacheTTL: 1,
			cacheKey: 'more' + path + page + rel,
			dataType: 'html'
		});
	};

	this.setup();

});
