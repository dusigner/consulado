/* global store:true, FB:true */

'use strict';

require('modules/helpers');

//load Nitro Lib
require('vendors/nitro');
require('expose?store!modules/store/store');
require('vendors/slick');
// require('modules/product/facebook-share');

var CRM = require('modules/store/crm');

Nitro.setup(['facebook-init'], function () {

	console.log('teste');

	var Index = {

		init: function(){
			this.sliderPrateleira();

		},
		// monta slick da prateleira
		sliderPrateleira: function() {
			console.log('slick');
			$('.helperComplement').remove();
			$(window).on('load', function() {
				$('.prateleira-bf .prateleira-slider ul').slick({
					arrows: true,
					dots: false,
					infinite: true,
					slidesToShow: 3,
					slidesToScroll: 3,
					responsive: [{
						breakpoint: 990,
						settings: {
							arrows: false,
							dots: false,
							slidesToShow: 1,
							slidesToScroll:1
						}
					}, {
						breakpoint: 480,
						settings: {
							arrow: false,
							dots: false,
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}]
				});
			});
		},
	};

	Index.init();
});