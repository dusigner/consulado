const setSKUselector = () => {
	let productBox = $('.list-content article');
	let skus = productBox.find('.product-insertsku');

	skus.each(function(index) {
		let item = skus.eq(index).find('.from-shelf'),
			skuName = skus.eq(index).find('input[type=checkbox]').attr('name'),
			sku = skus.eq(index).parents('.detalhes').find('.prod__selectSKU'),
			productLink = sku.parents('.detalhes');

		if(sku.children().length === 0) {
			for (var i = 0; i < item.length; i++) {
				let title = (item.eq(i).find('input[type=text]').attr('title') === '127V') ? '110V' : item.eq(i).find('input[type=text]').attr('title'),
					skuId = item.eq(i).find('input[type=checkbox]').attr('rel'),
					objectClass = title.replace(/\s/g, '') + '_' + skuId,
					isAvailable = (item.eq(i).hasClass('unavailable')) ? 'unavailable' : 'available';

				skus.eq(index).parents('article').find('.prod__selectSKU').attr('name', skuName).append(`
				<div class="sku__selector" data-title="${title}">
				<input class="sku_radio ${isAvailable}" type="radio" id="${objectClass}" name=${skuName} data-sku-value="${skuId}">
				<label class="sku_title ${isAvailable}" for="${objectClass}" name=${skuName}>${title}</label>
				</div>`);
			}

			sku.find('.unavailable').attr('disabled', true);

			productLink.find('.prod-info').after(`
				<a class="sku_buy -not-selected">Comprar</a>
			`);

			if(sku.find('.available').length === 2) {
				sku.find('.available').attr('checked', 'checked');
				setUrlButton(productLink);
			}


			productLink.find('.sku_radio').on('change', function () {
				setUrlButton(productLink);
			});

			$('.-not-selected').on('click', function() {
				if ($(this).parents('.detalhes').find('.sku_error').length === 0) {
					let message = `
									<div class="sku_error">
										<span class="select-sku"> Selecione uma voltagem </span>
									</div>
								`;

					$(message).insertBefore(productLink.find('.prod__selectSKU'));
				}
			});
		}
	});

	if($('body').hasClass('listagem')) {
		$('.prod__selectSKU').removeClass('hide');
	}
};

const setUrlButton = (productLink) => {
	let skuData = $(productLink).find('.sku_radio:checked').data('sku-value'),
		skuButton = productLink.find('.sku_buy');
	skuButton.unbind().removeClass('-not-selected').attr('href', `/checkout/cart/add?sku=${skuData}&qty=1&seller=1&redirect=true&sc=${window.jssalesChannel ? window.jssalesChannel : 3}`);
};

export default setSKUselector;