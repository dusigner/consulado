'use strict';

Nitro.module('facilita-blog', function () {
    this.slickFacilita = () => {
        var $facilitaBlog = $('.container-cards .carousel');
        $facilitaBlog
            .slick({
                autoplay: true,
                autoplaySpeed: 7000,
                mobileFirst: true,
                dots: true,
                arrows: false,
            });
    };
    this.init = () => {
        this.slickFacilita();
    };
    this.init();
});