/* global $: true, Nitro: true */
'use strict';

require('vendors/ajax.localstorage');

Nitro.module('list-more', function() {


    var self = this,
        $button = $('#list-more'),
        $vitrine = $('.vitrine'),
        $prateleira = $vitrine.find('> .prateleira'),
        query = /load\(\'(.*)\'/.exec($vitrine.find('> script').text()),
        grid = +$('#PS').val(),
        page = 2,
        url;

    this.loadContent = function() {
        $.ajax({
            url: url + page,
            localCache: true,
            cacheTTL: 1,
            dataType: 'html',
            beforeSend: function() {
                // console.log('page', page);

                if ($button.is('loading')) {
                    return false;
                } else {
                    $button.addClass('loading');
                    return true;
                }

            }
        })
            .done(function(data) {
                if (data) {
                    $('.vitrine > .prateleira').append(data);

                    if (self.isActive()) {

                        page++;

                        self.prefetch();

                    } else {
                        $button.hide();
                    }

                } else {
                    $button.hide();
                }
            })
            .always(function() {
                $button.removeClass('loading');
            });
    };

    this.prefetch = function() {
        $.ajax({
            url: url + page,
            localCache: true,
            cacheTTL: 1,
            dataType: 'html'
        });
    };

    this.isActive = function() {
        return $prateleira.find('li[layout]').length % grid === 0;
    };

    if (query && query.length > 0 && this.isActive()) {
        url = query[1];
    } else {
        return;
    }

    $button.click(self.loadContent).removeClass('hide');

    this.prefetch();
});
