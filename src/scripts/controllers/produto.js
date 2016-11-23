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
        $('html, body').animate({scrollTop:170}, 1500);
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


    var ID_GA, urlAPI, end, rand, dataRandom, coe;
    var qnt110v, qnt220v;
    var pathname = window.location.pathname;
    var users = 0;
    var data = new Date();
    var dataBF = new Date('November 24, 2016 20:00:00');

    var Index = {


        init: function (){
            Index.changeQntStoq();
            Index.getPathName();
        },

        template: function (){

            var content = '';

            content += '<div class="usuarios-ativos">';
            content += '<h4 id="qnt_stoke">Últimas unidades no estoque</h4>';
            content += '<p class="qtn_pessoas_on"><span id="pessoas_on"></span> pessoas estão visualizando essa promoção no momento</p>';
            content += '</div>';

            return content;
        },

        changeQntStoq: function (){
            $('.produto .prod-preco').prepend(Index.template);
            Index.getQntStoq();
            var qntEstoque = setInterval(function (){

                Index.getQntStoq();

            }, 900000);

        },


        getQntStoq: function (){

            Index.getAPI('/api/catalog_system/pub/products/search?fq=productId:' + window.skuJson.productId).then(function (data){

                if(data[0].items.length >= 2){

                    if(data[0].items[0].name === '110V'){
                        qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
                        qnt220v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

                        Index.calcQntStoq(qnt110v, qnt220v);

                    }else{
                        qnt220v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
                        qnt110v = data[0].items[1].sellers[0].commertialOffer.AvailableQuantity;

                        Index.calcQntStoq(qnt110v, qnt220v);

                    }
            
                } else{

                    qnt110v = data[0].items[0].sellers[0].commertialOffer.AvailableQuantity;
                    var nome = data[0].items[0].name;


                    Index.calcQntStoqOnly(qnt110v);

                    if(nome === 'BIVOLT' && qnt110v === 0){
                        console.log('ola');
                        $('.usuarios-ativos').hide();

                    }else if(nome === '110V' && qnt110v === 0){

                        $('.usuarios-ativos').hide();

                    }else if(nome === '220V' && qnt110v === 0){

                        $('.usuarios-ativos').hide();
                
                    }
                    
                }

            });

        },

        calcQntStoqOnly: function (qnt110v){
            data = new Date();
            dataBF = new Date('November 24, 2016 20:00:00');

            if(data >= dataBF){

                if( qnt110v > 30 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();

                } else if ( qnt110v === 0 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                }else if( qnt110v <= 30 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                } else{
                    $('#qnt_stoke').show();
                    $('.usuarios-ativos').show();
                }


            } else {


                if( qnt110v > 3){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();

                } else if ( qnt110v === 0 ){
                    $('.usuarios-ativos').hide();
                }else if( qnt110v <= 3 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                } else{
                    $('#qnt_stoke').show();
                    $('.usuarios-ativos').show();
                }

            }

        },

        calcQntStoq: function (qnt110v, qnt220v){
            data = new Date();
            dataBF = new Date('November 24, 2016 20:00:00');

            if(data >= dataBF){

                if( (qnt110v > 30) && (qnt220v > 30) ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if ( (qnt110v === 0) && (qnt220v === 0) ){
                    $('.usuarios-ativos').hide();
                } else if ( qnt110v === 0 && qnt220v > 30 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if( qnt110v > 30 && qnt220v === 0 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if ( qnt110v === 0 && qnt220v <= 30 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                } else if( qnt110v <= 30 && qnt220v === 0 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                }else if(qnt110v <= 3 && qnt220v <= 3){
                    $('#qnt_stoke').show();
                    $('.usuarios-ativos').show();
                } else{
                    $('.usuarios-ativos').hide();
                }

            } else {

                if( (qnt110v > 3) && (qnt220v > 3) ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if ((qnt110v === 0) && (qnt220v === 0)){
                    $('.usuarios-ativos').hide();
                } else if ( qnt110v === 0 && qnt220v > 3 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if( qnt110v > 3 && qnt220v === 0 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').hide();
                } else if ( qnt110v === 0 && qnt220v <= 3 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                } else if( qnt110v <= 3 && qnt220v === 0 ){
                    $('.usuarios-ativos').show();
                    $('#qnt_stoke').show();
                }else if(qnt110v <= 3 && qnt220v <= 3){
                    $('#qnt_stoke').show();
                    $('.usuarios-ativos').show();
                }else{
                    $('.usuarios-ativos').hide();
                }

            }

        },

        callbackAPI: function (data){
            if(data && data.status && data.status.error) {
               console.log('erro');
            } else {
                console.log('foi');
               $('#pessoas_on').html(data.data.count);
            }
            

        },

        getPathName: function (){

            var path = window.top.location.pathname;
            console.log(path);

            this.getSession(path, 'brastemp', Index.callbackAPI);

            setInterval(function (){

            Index.getSession(path, 'brastemp', Index.callbackAPI);

            },  300000);

        },

        configs: {
            // url: 'http://awesome.dev/mangocorp/jussi/brastemp/brastemp-usu-rios-ativos/users/current',
            url: 'http://jussi-pagesessions.herokuapp.com/users/current',
            cookieName: 'vygfubhjh78'
        },

        getSession: function (path, store, callback) {
            var content = {path: path, store: store};
            if(this.getCookie(this.configs.cookieName)) {
                content['c'] = this.getCookie(this.configs.cookieName);
            }

            var me = this;
            $.post(me.configs.url, content, function (result) {
                me.setCookie(me.configs.cookieName, result.data.c);
                callback(result);
            }).fail(function (result){
                console.log('erro');
                $('.usuarios-ativos').hide();
                $('.qtn_pessoas_on').hide();
            });
        },

        setCookie: function (cname, cvalue) {
            var d = new Date();
            d.setTime(d.getTime() + (5 * 60 * 60));
            var expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        },

        getCookie: function (cname) {
            var name = cname + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        },

        getAPI: function (url){
            return $.get(url);
        }
    };

    $(function(){
        Index.init();
    });
});
