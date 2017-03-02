'use strict';

Nitro.module('slider-banner', function() {
    var $buttonOpenRegulamento = $('.open-regulamento');

    this.setupMainSlider = function() {
        var $bannerPrincipal = ($(window).width() >= 768) ? $('.banners .banner-principal') : $('.banners-mobile .banner-principal'),
            qtdBanners;

        $bannerPrincipal.on('init', function(){
            qtdBanners = $('.banners .banner-principal.slides .slick-slide:not(.slick-cloned)').length;

            if ($(window).width() <= 768) {
                qtdBanners = $('.banners-mobile .banner-principal.slides .slick-slide:not(.slick-cloned)').length;
            }
        });

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
        }).on('afterChange', function(event, slick, currentSlide, nextSlide){
            if ($('#modal-regulamento-banner').text() !== '' && (qtdBanners > 1) && (currentSlide === qtdBanners - 1)) {
                $buttonOpenRegulamento.show();
            } else {
                $buttonOpenRegulamento.hide();
            }
        });

        $buttonOpenRegulamento.click(function(e){
            e.preventDefault();

            $('#modal-regulamento-banner').vtexModal({
                'title': 'Regulamento',
                cookieOptions: {
                    expires: 0,
                    path: '/'
                }
            });
        });
    };

    this.setupMainSlider();

});
