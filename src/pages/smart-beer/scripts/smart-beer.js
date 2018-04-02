'use strict';

var slick = require('vendors/slick'),
    modal = require('vendors/vtex-modal');

var tagueamento = function() {
    
    $('.sb-intro-buttom-buy a').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Comprar – ' + $(this).attr('data-item')
        });           
    });

    $('.sb-intro_select-sku ul li a').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Selecionar Cor – ' + $(this).attr('rel')
        });           
    });

    $('.sb-intro_prateleira-mobile .sb-vitrine_btn').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Comprar – ' + $(this).prev('h3').text() 
        });           
    });

    $('.sb-vitrine .sb-vitrine_btn').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Comprar – ' + $(this).prev('h3').text() + ' - Cervejeira Smartbeer'
        });           
    });

    $('.sb-intro .sb-intro_prateleira-mobile ul').on('afterChange', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Bullet Button - ' + $(this).slick('slickCurrentSlide') + ' – Banner Inicial'
        });
    });

    $('.sb-video_btn').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Assista Ao Vídeo'
        });
    });

    $('.mockup-mobile-view .slider').on('afterChange', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Bullet Button - ' + $(this).slick('slickCurrentSlide') + ' – Aplicativo SmartBeer'
        });
    });

    $('.sb-dimensoes-mobile-view ul').on('afterChange', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Bullet Button - ' + $(this).slick('slickCurrentSlide') + ' – Armazenamento de Alta Capacidade'
        });
    });

    $('.sb-vitrine .prateleira').on('afterChange', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Bullet Button - ' + $(this).slick('slickCurrentSlide') + ' – Cervejeira Smartbeer'
        });
    });


    $('.link-sm').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Saiba Mais – ' + $(this).parent().find('h3').text() + ' - Cervejeira Smartbeer'
        });           
    });

    
    $('.sb-app-download a').on('click', function () {
        dataLayer.push({
            event:'generic-event-trigger',
            category : 'TED',
            action: 'Click',
            label: 'Download – ' + $(this).attr('data-store')
        });           
    });
    
};

var sbModal = function(){
    //Modal QuickView
    $('.modal-quickview').on('click', function (e) {
        e.preventDefault();
        var link_quickview = $(this).attr('href');
        $('#modal-quickview iframe').attr('src', link_quickview);
        $('#modal-quickview').vtexModal();
    });

    // Modal Video
    $('.sb-video_btn').on('click', function () {
        $('#modal-video').vtexModal();

        $('#vtex-modal-video iframe').attr('src', 'https://www.youtube.com/embed/dlDP5JzdHpQ?rel=0&amp;showinfo=0');
    });

    $('.link-termo').on('click', function () {
        $('#modal-termo').vtexModal();
    });
    

    $(window).on('closeVtexModal', function() {
        $('#vtex-modal-video iframe').removeAttr('src');
    });

    //Modal Detalhes internos;
    $('.sb-features-interna .instruction').on('click', function (e) {
        e.preventDefault();
        var instruction = $(this).attr('rel');
        console.log(instruction);
        $('.' + instruction).css('display', 'block');
    });
    // Close Modal Detalhes internos;
    $('.sb-features-interna .zoom .close').on('click', function (e) {
        e.preventDefault();
        $('.zoom').fadeOut(300);
    });
    //modal close video
    
};

var sbSlick = function(){
    var screenWidth = $(window).width();

    //Slick slider intro mobile
    if (screenWidth <= '960') {
        $('.sb-intro .sb-intro_prateleira-mobile ul').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }

    //Slick slider Dimensoes mobile
    if (screenWidth <= '960') {
        $('.sb-dimensoes-mobile-view ul').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }

    // Slick slider Prateleira end mobile
    if (screenWidth <= '960') {
        $('.sb-vitrine .prateleira').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
    //slick slider do APP no mobile
    if (screenWidth <= '1120') {
        $('.sb-app .mockup-mobile-view .slider').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
};

var sbSelectSku = function(){
    //Select SKU INTRO
    $('.sb-intro .sb-intro_select-sku ul li a').on('click', function (e) {
        e.preventDefault();
        var selectBeer = $(this).attr('rel');
        $('.sb-intro .sb-intro_select-sku ul li a').removeClass('current');
        $(this).addClass('current');
        $('#sb-intro_ilustra').removeAttr('style');
        $('#sb-intro_ilustra').removeClass('carbono');
        $('#sb-intro_ilustra').removeClass('cubo');
        $('#sb-intro_ilustra').removeClass('budweiser');
        $('#sb-intro_ilustra').addClass(selectBeer);
        $('.sb-intro-buttom-buy a').css('display', 'none');
        $('.sb-intro-buttom-buy a.' + selectBeer).css('display', 'block');

    });
};

$(document).ready(function(){

    tagueamento();
    sbModal();
    sbSlick();
    sbSelectSku();
});

$(document).on('ajaxStop', function() {
    console.log('close', $('#vtex-modal-video .close'));

    $('#vtex-modal-video .close').unbind('click').bind('click', function() {
        console.log('Clicoooou');
    });
});

// $('.close').on('click', function () {
//     $('#vtex-modal-video iframe').removeAttr('src');
//     // var src = $('#vtex-modal-video iframe').attr('src');
//     // // console.log('src', src);
//     // $('#vtex-modal-video iframe').attr('src', src);

//     console.log('Clicoooou');
// });


// // // If resize
// // $(window).resize(function () {
// //     $('body').scrollTop(0);
// // });
