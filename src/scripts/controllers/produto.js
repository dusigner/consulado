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


    var $slider = $('section.slider .prateleira-slider .prateleira>ul').not('.slick-initialized');

    this.setupSlider = function($currentSlider) {
        $currentSlider.not('.slick-initialized').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [{
                breakpoint: 990,
                settings: {
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });

        //ajusta para mobile - prateleira slider
        $('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');

    };


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


    //inicia automaticamente prateleiras sliders no desktop
    if ($(window).width() > 768) {
        self.setupSlider($slider);
    }


    //mobile - abrir vitrines
    if ($(window).width() <= 768) {
        $('section.slider .pre-title').click(function(e){
            e.preventDefault();

            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
                $(this).siblings().find('.prateleira>ul').slideUp();
            } else {
                $('section.slider .open').siblings().find('.prateleira>ul').slideUp();
                $('section.slider .open').removeClass('open');
                $(this).addClass('open');
                $(this).siblings().find('.prateleira>ul').slideDown('slow',function(){
                    self.setupSlider($(this));
                });
            }
        });

        $('section.slider').eq(0).find('.pre-title').trigger('click');
    }


    self.valoresParcelas();


    var ID_GA, urlAPI;
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

            }, 15000);

        },


        getQntStoq: function (){

            Index.getAPI('/api/catalog_system/pub/products/search?fq=productId:' + skuJson.productId).then(function (data){


                qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
                qnt220v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

                Index.calcQntStoq(qnt110v, qnt220v);

            });

        },

        postToken: function (){

            $.post('https://www.googleapis.com/oauth2/v4/token?client_secret=vcVfvtauoijtyCY9g88gRIXO&grant_type=refresh_token&refresh_token=1%2F-xS6M_8QKU241QLNTKQgNerhukSPKUC5VEoepL8hUaxaJgmy9bdGK0eHuyiRJlLp&client_id=168418120255-nksioaabb1tdt17d8ca6vscgvbspcbds.apps.googleusercontent.com', function (data){
                var token = data.access_token;


                Index.getURL(token);
                Index.refreshUserGet(token);

                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').hide();
            });
        },

        refreshUser: function (users){

            var intervalo = setInterval(function (){
                var coe = 0;
                users = 5;
                var dataRandom = [-1,-2,-3,-4,-5,1,2,3,4,5];

                var rand = Math.floor((Math.random() * 10));

                var end = dataRandom[rand];

                if (end >= users) {
                    coe = users  + 2;
                } else {
                    coe = users  + end;
                }

                $('#pessoas_on').html(coe);

            }, 15000);
            

        },


        refreshUserGet: function (token){

            setInterval(function (){

                Index.getURL(token);

            }, 300000);
        },

        getURL: function (token){
            ID_GA = '23515006';
            urlAPI = 'https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:' + ID_GA + '&metrics=rt:activeUsers&dimensions=rt%3ApagePath&access_token=' + token;


            Index.getAPI(urlAPI).then(function (data){

                var currentURL = pathname;
                var visitas = 0;

                for (var i = 0; i < data.rows.length; i++) {

                    if(data.rows[i][0] === currentURL) {
                        visitas = data.rows[i][1];
                    }
                }

                $('#pessoas_on').html(visitas); 

                Index.refreshUser(visitas);

            }).fail(function (){
                $('#vtexIdUI-global-loader').remove();
                $('#vtexIdContainer').remove();
            });

            $('.produto .lead').append(Index.template);
        },

        refreshToken: function (){

            var tokenRefresh = setInterval(function (){

                Index.postToken();

            }, 3000000);

        },

        calcQntStoq: function (qnt110v, qnt220v){

            if( (qnt110v > 30) && (qnt220v > 30) ){
                $('#qnt_stoke').hide();
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').hide();

            } else if ( qnt110v === 0 && qnt220v > 30 ){
                $('.usuarios-ativos').show();
                $('.txt_small_220').hide();
                $('.txt_small_110').show();
                $('#qnt_stoke').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if( qnt110v > 30 && qnt220v === 0 ){
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').show();
                $('#qnt_stoke').hide();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if ( qnt110v === 0 && qnt220v <= 30 ){
                $('.usuarios-ativos').show();
                $('.txt_small_220').hide();
                $('.txt_small_110').show();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else if( qnt110v <= 30 && qnt220v === 0 ){
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').show();
                $('.qtn_pessoas_on').addClass('p_orange');
            } else{
                $('#qnt_stoke').show();
                $('.usuarios-ativos').show();
                $('.txt_small_110').hide();
                $('.txt_small_220').hide();
                $('.qtn_pessoas_on').removeClass('p_orange');
            }

        },

        getAPI: function (url){
            return $.get(url);
        }
    };

    $(function(){
        Index.init();
    });
});
