'use strict';
require('vendors/slick');
console.clear();
console.log('slick');
// monta slick da prateleira
$('.tbs-videos').slick({
    arrows: false,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true
});