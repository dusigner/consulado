/* global $: true, Nitro: true */
'use strict';

Nitro.module('resultado-busca', function() {


    var params = _.urlParams();

    if ($.isEmptyObject(params) || !('fq' in params)) {

        if (window.vtxctx.searchTerm) {
            $('.busca-termos').html('Você buscou por <strong>"' + window.vtxctx.searchTerm + '"</strong>');
        }

        //Encontramos 131 itens para você dar uma olhada
        if ($('.resultado-busca-numero').length > 0) {
            $('.busca-resultados').html('Encontramos <strong>' + $('.resultado-busca-numero:first .value').text() + ' itens</strong> para você dar uma olhada');
        }

        if ($('.busca-vazio').length > 0) {
            $('body').addClass('busca-vazia');
        }

    } else {

        // CAMPAIGN -  NÃO CONSIGO DORMIR

        switch (params.fq) {

        case 'H:231':
            $('.banner-dormir-100 .box-banner').show();
            break;

        case 'H:232':
            $('.banner-dormir-200 .box-banner').show();
            break;

        case 'H:233':
            $('.banner-dormir-400 .box-banner').show();
            break;

        case 'H:234':
            $('.banner-dormir-800 .box-banner').show();
            break;

        default:
            $('.banner-default .box-banner').show();
        }

        $('.resultado-busca').remove();

    }


});
