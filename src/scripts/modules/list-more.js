'use strict';

require('vendors/ajax.localstorage');

Nitro.module('list-more', function() {


    var self = this,
        $button = $('#list-more'),
        $vitrine = $('.vitrine'),
        $prateleira = $vitrine.find('> .prateleira'),
        query = /load\(\'(.*)\'/.exec( $vitrine.find('> script').text() ),
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
        })
        .done(function(data) {
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
        })
        .always(function() {
            $button.removeClass('loading');
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