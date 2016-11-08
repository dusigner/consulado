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

    var self = this;

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


    $(document).ajaxComplete(function(e, xhr, settings) {
        if (/outrasformasparcelamento/.test(settings.url)) {
            self.valoresParcelas();
        }
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


    //Opções de parcelamento
    self.valoresParcelas = function() {
        var $valoresParcelas = $('.valores-parcelas'),
            $showParcelas = $valoresParcelas.find('.titulo-parcelamento'),
            $opcoesParcelamento = $valoresParcelas.find('.other-payment-method-ul');

        $showParcelas.text('Ver parcelas');

        $opcoesParcelamento.find('li').each(function() {
            var $numeroParcelas = $(this).find('span:first-child'),
                numeroParcelas = $numeroParcelas.text().split('X')[0],
                $valorParcela = $(this).find('strong'),
                valorParcela = parseFloat($valorParcela.text().replace('.','').replace(',', '.').split('R$')[1]),
                text = $numeroParcelas.text().replace('de', ''),
                precoTotal = parseFloat(numeroParcelas * valorParcela).toFixed(2);

            $(this).append('<span class="valor-total">Total: R$ ' + precoTotal.toString().replace('.',',') + '</span>');
            $numeroParcelas.text(text);
            $valorParcela.text('de ' + $valorParcela.text());
        });

        $showParcelas.click(function() {
            if ($(this).hasClass('active') || $opcoesParcelamento.find('.other-payment-method-intereset-yes').length === 0) {
                $valoresParcelas.find('>p').slideUp();
            } else {
                $valoresParcelas.find('>p').slideDown();
            }

            $(this).toggleClass('active');
            $opcoesParcelamento.slideToggle();
        });

        $('.select-voltage .select.skuList label').click(function(){
            $valoresParcelas.find('>p').slideUp();
            $opcoesParcelamento.slideUp();
        });
    };



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


    self.valoresParcelas();


    var ID_GA, ACCES_TOKEN, urlAPI;
    var qnt110v, qnt220v; 
    var pathname = window.location.pathname;

    var Index = {   


        init: function (){
            Index.postToken();
            Index.getQntStoq();
        },

        template: function (){

            var content = '';

            content += '<div class="usuarios-ativos">'; 
            content += '<h4 id="qnt_stoke">Últimas unidades no estoque</h4>',
            content += '<p class="qtn_pessoas_on"><span id="pessoas_on"></span> pessoas estão visualizando essa promoção no momento</p>';
            content += '<small class="txt_small_110">*O produto na voltagem 110 já se encontra indisponível</small>';
            content += '<small class="txt_small_220">*O produto na voltagem 220 já se encontra indisponível</small>';
            content += '</div>';

            return content;
        },

        changeQntStoq: function (){
            $('.usuarios-ativos').hide();
            var qntEstoque = setInterval(function (){
                
                Index.getQntStoq();

            }, 30000);

        },


        getQntStoq: function (){

            Index.getAPI('/api/catalog_system/pub/products/search?fq=productId:' + skuJson.productId).then(function (data){


                qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
                qnt220v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

                console.log(qnt110v);
                console.log(qnt220v);


                Index.calcQntStoq(qnt110v, qnt220v);

            });
            
        },

        postToken: function (){

            $.post('https://www.googleapis.com/oauth2/v4/token?client_secret=vcVfvtauoijtyCY9g88gRIXO&grant_type=refresh_token&refresh_token=1%2F-xS6M_8QKU241QLNTKQgNerhukSPKUC5VEoepL8hUaxaJgmy9bdGK0eHuyiRJlLp&client_id=168418120255-nksioaabb1tdt17d8ca6vscgvbspcbds.apps.googleusercontent.com', function (data){
                var token = data.access_token;


                localStorage.setItem('token', token);

                 $('.produto .lead').append(Index.template);
            });
        },

        getURL: function (token){
            ID_GA = '23515006';
            urlAPI = 'https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:' + ID_GA + '&metrics=rt:activeUsers&dimensions=rt%3ApagePath&access_token=' + token;

            var i = 0;

            setInterval(function (){
                i++;
                Index.getAPI(urlAPI).then(function (data){

                    var currentURL = pathname;
                    var visitas = 0;

                    for (var i = 0; i < data.rows.length; i++) {

                       if(data.rows[i][0] === currentURL) {
                           visitas = data.rows[i][1];
                       }
                    }

                    $('#pessoas_on').html(visitas);
                });

            }, 5000);
        },

        refreshToken: function (){

            var tokenRefresh = setInterval(function (){

                Index.postToken();        

            }, 3000000);

        },

        calcQntStoq: function (qnt110v, qnt220v){
            console.log(qnt110v);            
            console.log(qnt220v);            
            console.log('ola');
            if( (qnt110v > 30) && (qnt220v > 30) ){
                $('.usuarios-ativos').hide();
                $('.txt_small_110').hide();
                $('.txt_small_220').hide();

            } else if ( qnt110v === 0 && qnt220v > 30 ){
                $('.usuarios-ativos').show();
                $('.txt_small_220').hide();
                $('#qnt_stoke').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if( qnt110v > 30 && qnt220v === 0 ){
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('#qnt_stoke').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if ( qnt110v === 0 && qnt220v <= 30 ){
                $('.usuarios-ativos').show();
                $('.txt_small_220').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if( qnt110v <= 30 && qnt220v === 0 ){
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else{
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').hide();
                $('.qtn_pessoas_on').removeClass('p_orange');
            }

        },

        randNumber: function (){
            var intervalo = setInterval(function (){

                var n = Math.floor((Math.random() * 20) + 2);

                }, 1000);

        },

       
         getAPI: function (url){
            return $.get(url);
        }
    };

    $(function(){
        Index.init();
    });  
});
