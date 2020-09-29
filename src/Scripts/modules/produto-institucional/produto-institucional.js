$('.container-cards').slick({
    dots: false,
    infinite: false,
    speed: 300,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [{
        breakpoint: 375,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
        }
    }]
});
