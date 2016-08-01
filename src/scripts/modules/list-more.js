/* global $: true, Nitro: true */

require('vendors/ajax.localstorage');

Nitro.module('list-more', function() {

    'use strict';

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
                    console.log('page', page);

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

                    $prateleira.append(data).find('.helperComplement').remove();

                    console.log('active', self.isActive());

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
