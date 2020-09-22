'use strict';

Nitro.module('slider-facilita-blog', [], function () {
    this.sliderFacilita = function () {
        $('.card-blog').slick({
            dots: true,
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            adaptiveHeight: true,
            responsive: [
                {
                    breakpoint: 1275,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 667,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true
                    }
                }
            ]
        });
    }

    this.sliderFacilita()
});
