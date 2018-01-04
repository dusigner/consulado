'use strict';

require('vendors/slick');

Nitro.controller('landing-wonderland', function() {

    var $slider = $('.slider');

    $slider.slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
    });

});
