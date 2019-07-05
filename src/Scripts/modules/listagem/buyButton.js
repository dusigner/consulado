'use strict';

Nitro.module('buy-button', function () {

	var _self = this;

	// PREPARE DATA TO OBJECT -> RENDER
	this.setup = function(){
		let productBox = $('.list-content article');
		let skus = productBox.find('.product-insertsku');

		skus.each(function(index) {
			let item = skus.eq(index).find('.from-shelf');

			if(skus.find('.prod__selectSKU').children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					let title = item.eq(i).find('input[type=text]').attr('title');
					let skuId = item.eq(i).find('input[type=checkbox]').attr('rel');
					skus.eq(index).parents('article').find('.prod__selectSKU').append(`
												<div class="sku__selector" data-title="${title}">
													<input class="sku_radio" type="radio" id="${title}_${skuId}" name=${skuId}>
													<label class="sku_title" for=${title}_${skuId}>${title}</label>
												</div>`);
				}
			}
		});
	};

	this.setup();
});