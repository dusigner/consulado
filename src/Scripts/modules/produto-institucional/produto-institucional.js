'use strict';

$('.container-cards').addClass('carousel').slick({
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 3,
    responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        }
    ]
});