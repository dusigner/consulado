const setSKUselector = () => {
	let productBox = $('.list-content article');
	let skus = productBox.find('.product-insertsku');

	skus.each(function(index) {
		let item = skus.eq(index).find('.from-shelf'),
			skuName = skus.eq(index).find('input[type=checkbox]').attr('name'),
			sku = skus.eq(index).parents('.detalhes').find('.prod__selectSKU');

		if(sku.children().length === 0) {
			for (var i = 0; i < item.length; i++) {
				let title = (item.eq(i).find('input[type=text]').attr('title') === '127V') ? '110V' : item.eq(i).find('input[type=text]').attr('title'),
					skuId = item.eq(i).find('input[type=checkbox]').attr('rel'),
					objectClass = title.replace(/\s/g, '') + '_' + skuId,
					isAvailable = (item.eq(i).hasClass('unavailable')) ? 'unavailable' : 'available';

				skus.eq(index).parents('article').find('.prod__selectSKU').attr('name', skuName).append(`
				<div class="sku__selector" data-title="${title}" data-sku-value="${skuId}">
				<input class="sku_radio ${isAvailable}" type="radio" id="${objectClass}" name=${skuName}>
				<label class="sku_title ${isAvailable}" for="${objectClass}" name=${skuName}>${title}</label>
				</div>`);
			}

			sku.find('.unavailable').attr('disabled', true);
			if(sku.find('.available').length === 2) {
				sku.find('.available').attr('checked', 'checked');
			}
		}
	});

	if($('body').hasClass('listagem')) {
		$('.prod__selectSKU').removeClass('hide');
	}
};

export default setSKUselector;