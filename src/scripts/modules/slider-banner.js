/* global $: true, Nitro: true */

// var bannerColor = require('modules/banner-color');

Nitro.module('slider-banner', function() {

    'use strict';

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
