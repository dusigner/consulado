const setSKUselector = () => {
	let productBox = $('.list-content article');
	let skus = productBox.find('.product-insertsku');

	//$('body').addClass('buyButton');

	skus.each(function(index) {
		let item = skus.eq(index).find('.from-shelf'),
			skuName = skus.eq(index).find('input[type=checkbox]').attr('name'),
			sku = skus.eq(index).parents('.detalhes').find('.prod__selectSKU'),
			productLink = sku.parents('.detalhes'),
			produtoIndisponivel = productLink.parents('article').hasClass('semEstoque'),
			textButton;

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

			if (produtoIndisponivel) {
				textButton =  'Produto indisponível';
				productLink.find('.prod-info').after(`
					<a class="sku_buy -not-available">${textButton}</a>
				`);

			} else {
				textButton = 'Comprar';
				productLink.find('.prod-info').after(`
					<a class="sku_buy -not-selected">${textButton}</a>
				`);
			}


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
										<span class="select-sku"> Por favor, <strong>selecione uma voltagem <strong></span>
									</div>
								`;

					productLink.find('.prod-info').prepend($(message));
					productLink.find('.nome, .promo-destaque').addClass('hide');
				}
			});
		}
	});

	if($('body').hasClass('listagem')) {
		$('.prod__selectSKU').removeClass('hide');
		$('.buy-button').removeClass('hide');
	}
};

const setUrlButton = (productLink) => {
	let skuData = $(productLink).find('.sku_radio:checked').data('sku-value'),
		skuButton = productLink.find('.sku_buy');
	skuButton.unbind().removeClass('-not-selected').attr('href', `/checkout/cart/add?sku=${skuData}&qty=1&seller=1&redirect=true&sc=${window.jssalesChannel ? window.jssalesChannel : 3}`);
};

export default setSKUselector;