/* global $: true, Nitro: true */
'use strict';

require('vendors/ajax.localstorage');

Nitro.module('infinite-scroll', function() {


    var $window = $(window),
        $footer = $('footer'),
        $vitrine = $('.vitrine'),
        $prateleira = $vitrine.find('> .prateleira'),
        loader = $('<div class="loading" />'),
        query = /load\(\'(.*)\'/.exec($vitrine.find('> script').text()),
        grid = +$('#PS').val(),
        page = 2,
        loading = false;

    if (query && query.length > 0) {
        query = query[1];
    } else {
        return;
    }

    var loadContent = function() {

        $.ajax({
            url: query + page,
            localCache: true,
            cacheTTL: 1,
            dataType: 'html',
            beforeSend: function() {
                // console.log('page', page);

                loading = true;
                $prateleira.append(loader);
            },
            success: function(data) {
                if (data) {
                    $prateleira.append(data);

                    loading = false;

                    page++;
                }
            },
            complete: function() {
                loader.remove();
            }
        });
    };

    $window.scroll($.throttle(function() {
        //console.log( $window.scrollTop() + $window.height() > $footer.offset().top, loading);

        if ($window.scrollTop() + $window.height() > $footer.offset().top && !loading) {

            var active = $prateleira.find('li[layout]').length % grid === 0;

            // console.log('active', active);

            if (active) {
                loadContent();
            }
        }
    }, 250));



});
