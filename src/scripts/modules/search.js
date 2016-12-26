/* global Nitro: true, $: true */

'use strict';

require('vendors/jquery.debounce');
//require('vendors/portal-buy-button');

Nitro.module('search', function() {


    var API_ENDPOINT = '/buscapagina?cc=10&sm=0&PageNumber=1',
        $document = $(document),
        $searchContainer = $('.cont-search'),
        $searchForm = $('header .form-search'),
        $searchField = $searchForm.find('input'),
        $searchBox = $('#autocomplete-search'),
        $content = $searchBox.find('.autocomplete-content'),
        $searchAction = $searchBox.find('.autocomplete-footer a'),
        $searchActionText = $searchAction.find('strong'),
        $loader = $('<div class="loader" />'),
        layout = $searchBox.data('layout'),
        $results,
        searchTerm = '',
        total = 5;


    // $searchForm.find('> .icon').click(function(e) {
    //     e.preventDefault();

    //     $searchContainer.toggleClass('search-active');

    //     $(document).trigger('search', $searchContainer.is('.search-active') ? null : false);
    // });

    var loadContent = $.debounce(function(term) {

        console.info('loadContent', term);

        $.ajax({
            url: API_ENDPOINT,
            data: {
                ft: term,
                PS: total,
                sl: layout
            },
            localCache: true,
            cacheTTL: 1,
            cacheKey: 'search:' + term,
            dataType: 'html',
            beforeSend: function() {
                searchTerm = term;

                $searchForm.addClass('loading').append($loader);
            }
        })
        .done(function(data) {
            if (data) {
                $content.html(data).find('.helperComplement').remove();

                $results = $content.find('a');

                $(document).trigger('search', true);
            }
        })
        .always(function() {
            $searchForm.removeClass('loading');
            $loader.remove();
        });

    }, 250);

    $searchField.on('keyup focus', function() {

        var value = $.trim($(this).val());

        //console.info('input change', value);

        if (searchTerm !== value) {
            $document.trigger('search');

            if (value.length >= 3) {
                loadContent(value);
            }
        }

    });


    $searchForm.submit(function(e) {
        e.preventDefault();
        window.location.href = '/' + encodeURIComponent($searchField.val());
    });

    $document.on('search', function(e, status) {

        if (status === false) {
            $searchField.val('').trigger('keyup');
        }

        $searchBox.toggle(!!status); //force boolean

        $searchActionText.text('"' + searchTerm + '"');

        $searchAction.attr({
            title: 'Buscar Por "' + searchTerm + '"',
            href: '/' + encodeURIComponent(searchTerm)
        });

    }).keydown(function(e) {

        if ((e.keyCode === 40 || e.keyCode === 38) && $('body').is('.search-active')) {

            var $focus = $searchContainer.find(':focus').removeClass('active');

            if (e.keyCode === 40) { //down

                $results.eq($results.index($focus) + 1).focus().addClass('active');

            } else if (e.keyCode === 38) { //up

                ($results.index($focus) <= 0 ? $searchField : $results.eq($results.index($focus) - 1)).focus().addClass('active');

            }

            return false;
        }
    });

});
