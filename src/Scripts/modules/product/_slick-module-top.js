Nitro.module('slider-module-prateleira', function () {

    this.slickStartModule = () => {
        const $sliderPrateleira = $('.module-top10');

        $sliderPrateleira
            .slick({
                arrows: true,
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 5,
                slidesToScroll: 5,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                ]
            });
    };

    this.init = () => {
        this.slickStartModule();
    };

    this.init();
});


var self = this,
    $slider = $('section.vitrines:not(.vitrine-ofertas-interesses, .vitrine-ofertas-alavancas)').find('.prateleira-slider .prateleira>ul').not('.slick-initialized');

//INICIA CHAMADA DAS VITRINES CHAORDIC
//chaordic.init('home');

this.setupSlider = function ($currentSlider) {
    $currentSlider.not('.slick-initialized').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 990,
                settings: {
                    dots: true,
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    //ajusta para mobile - prateleira slider
    //$('section.slider .prateleira-slider .prateleira ul').find('.detalhes>a').addClass('col-xs-6 col-md-12');
};