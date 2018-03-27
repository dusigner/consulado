// // 'use strict';


// require('vendors/nitro');

// Nitro.module('smart-beer', function () {
//     this.init = function() {
//     };
    
//     this.init();
// });

var slick = require('vendors/slick');
var modal = require('vendors/vtex-modal');
// var TweenMax = require('vendors/TweenMax');
// var ScrollMagic = require('vendors/ScrollMagic');

// var TimelineMax = require('vendors/TimelineMax');
// var TweenLite = require('vendors/TweenLite');
// var TextPlugin = require('vendors/TextPlugin');
// var addIndicators = require('vendors/debug.addIndicators');
// $('.sb-intro .sb-intro_info .campanha-ofds')


// var animation_Sections = function(){
//     // Init ScrollMagic
//     var controller = new ScrollMagic.Controller();
    
//     var introScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-intro',
//         duration: '100%',
//         triggerHook: 0.9,
//     })
//     .setClassToggle('.sb-intro', 'fade-in')
//     .addTo(controller);
    
//     var videoScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-video',
//         duration: '100%',
//         triggerHook: 0.9,
//     })
//     .setClassToggle('.sb-video', 'fade-in')
//     .addTo(controller);
    
//     var appScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-app',
//         duration: '100%',
//         triggerHook: 0.9
//         // reverse: false
//     })
//     .setClassToggle('.sb-app', 'fade-in')
//     .addTo(controller);
    
//     var featuresScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-features',
//         duration: '100%',
//         triggerHook: 0.9
//         // reverse: false
//     })
//     .setClassToggle('.sb-features', 'fade-in')
//     .addTo(controller);
    
//     var dimensoesScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-dimensoes',
//         duration: '100%',
//         triggerHook: 0.9
//         // reverse: false
//     })
//     .setClassToggle('.sb-dimensoes', 'fade-in')
//     .addTo(controller);
    
//     var vitrineScene = new ScrollMagic.Scene({
//         triggerElement: '.sb-vitrine',
//         triggerHook: 0.9,
//         reverse: false
//     })
//     .setClassToggle('.sb-vitrine', 'fade-in')
//     .addTo(controller);

// };

// var animation_Intro = function(){
//     // Intro Animations Start
    
//     TweenMax.from('.sb-intro .col-4:nth-of-type(2)', 1, {
//         top: 20,
//         delay: 0.25
//     });
//     TweenMax.to('.sb-intro .col-4:nth-of-type(2)', 1, {
//         opacity: 1,
//         delay: 0.25
//     });
    
//     TweenMax.from('.sb-intro .sb-intro_info .campanha-ofds', 1, {
//         top: 20,
//         delay: 0.5
//     });
//     TweenMax.to('.sb-intro .sb-intro_info .campanha-ofds', 1, {
//         opacity: 1,
//         delay: 0.5
//     });
    
//     TweenMax.from('.sb-intro .sb-intro_info h3', 1, {
//         top: 20,
//         delay: 0.75
//     });
//     TweenMax.to('.sb-intro .sb-intro_info h3', 1, {
//         opacity: 1,
//         delay: 0.75
//     });
    
//     TweenMax.from('.sb-intro .sb-intro_info p', 1, {
//         top: 20,
//         delay: 1
//     });
//     TweenMax.to('.sb-intro .sb-intro_info p', 1, {
//         opacity: 1,
//         delay: 1
//     });
    
//     TweenMax.from('.sb-intro .sb-intro_products .sb-intro_title h1', 1, {
//         top: 20,
//         delay: 1.25
//     });
//     TweenMax.to('.sb-intro .sb-intro_products .sb-intro_title h1', 1, {
//         opacity: 1,
//         delay: 1.25
//     });
    
//     TweenMax.from('.sb-intro .sb-intro_products .sb-intro_app', 1, {
//         top: 20,
//         delay: 1.5
//     });
//     TweenMax.to('.sb-intro .sb-intro_products .sb-intro_app', 1, {
//         opacity: 1,
//         delay: 1.5
//     });

//     TweenMax.from('.sb-intro .sb-intro_products .sb-intro-product-price', 1, {
//         top: 20,
//         delay: 1.75
//     });
//     TweenMax.to('.sb-intro .sb-intro_products .sb-intro-product-price', 1, {
//         opacity: 1,
//         delay: 1.75
//     });

//     TweenMax.from('.sb-intro .sb-intro_products .sb-intro_select-sku', 1, {
//         top: 20,
//         delay: 2
//     });
//     TweenMax.to('.sb-intro .sb-intro_products .sb-intro_select-sku', 1, {
//         opacity: 1,
//         delay: 2
//     });

//     TweenMax.from('.sb-intro .sb-intro_products .sb-intro-buttom-buy', 1, {
//         top: 20,
//         delay: 2.25
//     });
//     TweenMax.to('.sb-intro .sb-intro_products .sb-intro-buttom-buy', 1, {
//         opacity: 1,
//         delay: 2.25
//     });
    
//     TweenMax.to('.sb-intro .sb-intro_ilustra', 1, {
//         backgroundImage:'url(/arquivos/imageSteel-smartBeer-03-budweiser.png)',
//         delay: 0.25,
//         // ease:Power2.easeInOut 
//     });
//     TweenMax.to('.sb-intro .sb-intro_ilustra', 1, {
//         backgroundImage:'url(/arquivos/imageSteel-smartBeer-01-Carbono.png)',
//         delay: 1.25,
//         // ease:Power2.easeInOut 
//     });

//     // Intro Animations End
// };

$('document').ready(function(){
    
    // animation_Sections();
    // animation_Intro();

    $('.sb-video .sb-video_btn').on('click', function(){
        $('#modal-video').vtexModal();
    });

    var screenWidth = $(window).width();
    if (screenWidth <= '960') {
        $('.sb-intro .sb-intro_prateleira-mobile ul').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
    if (screenWidth <= '960') {
        $('.sb-dimensoes-mobile-view ul').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
    if (screenWidth <= '960'){
        $('.sb-vitrine .prateleira').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
    if (screenWidth <= '1120') {
        $('.sb-app .mockup-mobile-view .slider').slick({
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: false,
            dots: true
        });
    }
    
});
