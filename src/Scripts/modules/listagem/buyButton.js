'use strict';

Nitro.module('buy-button', function () {
	// PREPARE DATA TO OBJECT -> RENDER
	this.setup = function(){
		let productBox = $('.list-content article');
		let skus = productBox.find('.product-insertsku');

		skus.each(function(index) {
			let item = skus.eq(index).find('.from-shelf'),
				skuName = skus.eq(index).find('input[type=checkbox]').attr('name');

			if(skus.find('.prod__selectSKU').children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					let title = item.eq(i).find('input[type=text]').attr('title'),
						skuId = item.eq(i).find('input[type=checkbox]').attr('rel'),
						objectClass = title.replace(/\s/g, '') + '_' + skuId;

					skus.eq(index).parents('article').find('.prod__selectSKU').attr('name', skuName).append(`
												<div class="sku__selector" data-title="${title}">
													<input class="sku_radio" type="radio" id="${objectClass}" name=${skuName}>
													<label class="sku_title" for="${objectClass}" name=${skuName}>${title}</label>
												</div>`);
				}
			}
		});
	};

	this.setup();
});