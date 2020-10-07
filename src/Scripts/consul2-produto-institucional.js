/* global $: true, Nitro: true */
'use strict';

// import 'modules/product/video';
// import 'modules/product/sku-fetch';
// import 'modules/product/gallery-v2';
// import 'modules/product/product-nav-v2';
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
import 'modules/produto-institucional/produto-institucional';
import 'modules/produto-institucional/main-banner-datalayer';

Nitro.controller(
    'produto-institucional',
    [
        'produto-institucional',
        'main-banner-datalayer',
        // 'chaordic',
        // 'color-selector',
        // 'sku-fetch',
        // 'galleryv2',
        // 'product-nav',
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
    ],
    function(){}
)

$(document).ready(function(){
    // Check if element is on the screen
    // Necessário para checagem de viability
	$.fn.isOnScreen = function (x, y) {
		if (x == null || typeof x == 'undefined') x = 1;
		if (y == null || typeof y == 'undefined') y = 1;

		var win = $(window);

		var viewport = {
			top: win.scrollTop(),
			left: win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var height = this.outerHeight();
		var width = this.outerWidth();

		if (!width || !height) {
			return false;
		}

		var bounds = this.offset();
		bounds.right = bounds.left + width;
		bounds.bottom = bounds.top + height;

		var visible = !(
			viewport.right < bounds.left ||
			viewport.left > bounds.right ||
			viewport.bottom < bounds.top ||
			viewport.top > bounds.bottom
		);

		if (!visible) {
			return false;
		}

		var deltas = {
			top: Math.min(1, (bounds.bottom - viewport.top) / height),
			bottom: Math.min(1, (viewport.bottom - bounds.top) / height),
			left: Math.min(1, (bounds.right - viewport.left) / width),
			right: Math.min(1, (viewport.right - bounds.left) / width)
		};

		return (
			deltas.left * deltas.right >= x && deltas.top * deltas.bottom >= y
		);
	};
})

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