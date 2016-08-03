/* global $: true, Nitro: true, skuJson: true */
'use strict';

require('vendors/slick');
require('vendors/vtex-modal');
// require('modules/product/video');
require('modules/product/sku-fetch');
require('modules/product/gallery');
require('modules/product/product-nav');
require('modules/product/details');
require('modules/product/specifications');
require('modules/product/selos');
require('modules/product/supermodel');
require('modules/product/sku-select');
require('modules/product/boleto');
// require('modules/product/special-content');

Nitro.controller('produto', [ /*'video', */ 'sku-fetch', 'gallery', 'product-nav', 'details', 'specifications', 'selos', 'supermodel', 'sku-select', 'boleto' /*, 'special-content'*/ ], function() {

    window.alert = function(e) {
        console.error(e);
        return;
    };

    // Exibe Informação de "Compra segura" quando o
    // botão comprar estiver exibindo na página
    if ($('#BuyButton .buy-button').is(':visible')) {
        $('.secure').show();
    } else {
        $('body').addClass('produto-indisponivel');
    }

    // TROCA DE NOME BOTÃO AVISE-ME
    // $('.portal-notify-me-ref').find('.notifyme-button-ok').val('Avise-me');

    var televendas = $('a[title*="Televendas"]').clone().attr('title', 'Televendas').addClass('notifyme-televendas');
    var notifyMeButton = $('.portal-notify-me-ref').find('.notifyme-button-ok');

    notifyMeButton.parent()
        .append('<a href="#relacionados" class="primary-button notifyme-button-ok scroll-to">Veja outros produtos relacionados</a>');

    notifyMeButton.val('Avise-me');
    if (typeof televendas !== 'undefined') {
        $('.notifyme-form')
            .find('p')
            .append('<br>Ou entre em contato com nosso ').append(televendas[0]);
    }

    var isAvailable = skuJson.skus.some(function(e) {
        return e.available;
    });

    if (!isAvailable) {
        var notifyMe = $('.portal-notify-me-ref').data('notifyMe');
        if (typeof notifyMe !== 'undefined') {
            notifyMe.showNM();
        }
    }

    var $reference = $('.reference'),
        $productSku = $('.productSku');

    //TROCA DE NOMES PRODUCT / SKUREF
    $(document).on('skuSelected.vtex', function() {
        $reference.addClass('hide');
        $productSku.removeClass('hide');
    }).on('skuUnselected.vtex', function() {
        $productSku.addClass('hide');
        $reference.removeClass('hide');
    });

    $('.prateleira-slider .prateleira ul').not('.product-field ul').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1019,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });


    //setup modal
    $('a[data-modal]').click(function(e) {
        e.preventDefault();
        $('#modal-' + $(this).data('modal')).vtexModal();
    });



    //Compre Junto
    $('.comprar-junto a').text('compre junto');



    //Rating TruxtVox
    $(document).on('click', '.trustvox-fluid-jump', function(e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $('#trustvox-rating').offset().top + 'px'
        }, 'slow');
    });


    //Google PLA
    if ($.getParameterByName('utmi_cp') === 'pla' || $.cookie('google_pla')) {
        $.cookie('google_pla', true, {
            path: '/',
            expires: 1
        });

        $('body').addClass('google-pla');
    }
});
