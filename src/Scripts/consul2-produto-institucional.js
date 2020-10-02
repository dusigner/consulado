/* global $: true, Nitro: true */
'use strict';

// import 'modules/product/video';
import 'modules/product/sku-fetch';
// import 'modules/product/gallery-v2';
 import 'modules/product/product-nav-v2';
// import 'modules/product/details';
// import 'modules/product/specifications-v2';
// import 'modules/product/selos';
// import 'modules/product/sku-select';
// import 'modules/product/produtos-adicionais';
// import 'modules/product/boleto';
// import 'modules/product/notify-me';
// import 'modules/product/share';
// import 'modules/product/upsell';
// import 'modules/product/recurrence';
// import 'modules/product/deliveryTime';
// import 'modules/product/color-selector';
// import 'modules/product/product-tags';
// import 'modules/product/outline-products';
// import 'modules/chaordic';
// import 'dataLayers/dataLayer-product';
import 'modules/caracteristicas';
import 'modules/produto-institucional/produto-institucional';

Nitro.controller(
    'produto-institucional',
    [
        'produto-institucional',
        // 'chaordic',
        // 'color-selector',
        'sku-fetch',
        // 'galleryv2',
        'product-nav',
        // 'video',
        // 'details',
        // 'specifications-v2',
        // 'selos',
        // 'sku-select',
        // 'produtos-adicionais',
        // 'boleto',
        // 'share',
        // 'upsell',
        // 'deliveryTime',
        // 'recurrence',
        // 'notify-me',
        // 'product-tags',
        // 'dataLayer-product',
        // 'outline-products',
    ]
)

let sbSlick = function () {
    var screenWidth = $(window).width();
    //Slick slider intro mobile
    if (screenWidth <= '660') {
        $('.container-cards').slick({
            autoplay: true,
            autoplaySpeed: 1000,
            arrows: false,
            dots: true
        });
    }
    this.sbSlick()
};
