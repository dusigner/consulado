'use strict'

Nitro.module('slick-produto-institucional', function () {

    self.init = () => {
        self.slickFacilitaBlog()
    }
    self.slickFacilitaBlog = () => {
        $('.container-cards').slick({
            dots: false,
            infinite: false,
            speed: 300,
            arrows: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            mobileFirst: true,
            responsive: [{
                breakpoint: 300,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
            ]
        });
    }
    self.init()
});
