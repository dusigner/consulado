/* global $: true, Nitro: true */

// var bannerColor = require('modules/banner-color');

'use strict';

Nitro.module('slider-banner', function() {


    this.setupMainSlider = function() {

        var $bannerPrincipal = $('.banner-principal');

        // bannerColor($bannerPrincipal);

        $bannerPrincipal.slick({
            autoplay: true,
            autoplaySpeed: 6000,
            mobileFirst: true,
            dots: true,
            arrows: false,
            responsive: [{
                breakpoint: 568,
                settings: {
                    arrows: true,
                }
            }]
        });

    };

    this.setupMainSlider();

});
