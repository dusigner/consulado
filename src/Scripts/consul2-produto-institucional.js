/* global $: true, Nitro: true */
'use strict';
import 'modules/produto-institucional/produto-institucional';
// import 'modules/product/video';
import 'modules/product/sku-fetch';
// import 'modules/product/gallery-v3';
// import 'modules/product/product-nav-v2';
// import 'modules/product/details-v3';
// import 'modules/product/specifications-v3';
import 'modules/product/selos';
import 'modules/product/sku-select-v3';
import 'modules/product/voltage-modal';
// import 'modules/product/produtos-adicionais';
import 'modules/product/boleto';
import 'modules/product/notify-me';
// import 'modules/product/share';
// import 'modules/product/upsell';
// import 'modules/product/recurrence';
 import 'modules/product/deliveryTime';
// import 'modules/product/color-selector';
// import 'modules/product/product-tags';
import 'modules/product/outline-products';
// import 'modules/chaordic';
// import 'dataLayers/dataLayer-product';
// import 'dataLayers/dataLayer-main-tabs';
// import 'dataLayers/dataLayer-topbar-nav';
// import 'modules/listagem/comparebar';

// import 'modules/product/compare';

Nitro.controller(
	'produto-institucional',
	[	'produto-institucional',
		// 'chaordic',
		// 'color-selector',
		'sku-fetch',
		// 'gallery-v3',
		// 'product-nav',
		// 'video',
		// 'details-v3',
		// 'specifications-v3',
		'selos',
		'sku-select-v3',
		'voltage-modal',
		// 'produtos-adicionais',
		'boleto',
		// 'share',
		// 'upsell',
		'deliveryTime',
		// 'recurrence',
		 'notify-me',
		// 'product-tags',
		// 'dataLayer-product',
		'outline-products',
		// 'dataLayer-main-tabs',
		// 'dataLayer-topbar-nav',
		// 'topBarV2',
		// 'comparebar',
		// 'compare'
	],
	function(){}
);
