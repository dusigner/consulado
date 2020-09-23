'use strict';
Nitro.module('produto-institucional', function () {
    this.init = function () {
        this.sliderFacilita()
    }
    this.sliderFacilita = function () {
        console.info('batat')
        // $('.container-cards').slick({
        //     dots: true,
        //     infinite: true,
        //     speed: 1000,
        //     slidesToShow: 1,
        //     adaptiveHeight: true,
        //     responsive: [
        //         {
        //             breakpoint: 667,
        //             settings: {
        //                 slidesToShow: 1,
        //                 slidesToScroll: 3,
        //                 arrows: true
        //             }
        //         },
        //         {
        //             breakpoint: 480,
        //             settings: {
        //                 slidesToShow: 1,
        //                 slidesToScroll: 3,
        //                 arrows: true
        //             }
        //         }
        //     ]
        // });
    }
    this.init()
});
