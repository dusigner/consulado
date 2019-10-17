const DestaqueEmbutidos = {
	// init: () => {
	// 	DestaqueEmbutidos.renderDestaqueEmbutidos();
	// },
	renderDestaqueEmbutidos: gallery => {
		let productImage = [],
			productSkuSelector = $('.smartbeer-showcase').find('.product-skuSelector'),
			productBox = $('.smartbeer-showcase'),
			skus = productBox.find('.product-insertsku'),
			galleryImg = $('.product-image'),
			fatherBox = $('.vitrine-smartbeer');

		switch (productBox.attr('data-idproduto')) {
			//Coifa 1517
			case '428':
				fatherBox.addClass('Coifa-Cooktop');
				productImage.push('/arquivos/CAP60AR_destaque_coifa_lado_1.png');
				productImage.push('/arquivos/CAP60AR_destaque_coifa_frente_1.png');
				productImage.push('/arquivos/CAP60AR_destaque_coifa_ambiente_1.png');
				productImage.push('/arquivos/CAP60AR_destaque_coifa_ambiente_2.png');
				productImage.push('/arquivos/CAP60AR_destaque_coifa_detalhe_1.png');
				break;
			//Cooktop 346
			case '346':
				fatherBox.addClass('Coifa-Cooktop');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_topview_1.png');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_topview_2.png');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_ambientada_1.png');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_ambientada_2.png');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_detail_2.png');
				productImage.push('/arquivos/CD060AE_destaque_cooktop_detail_3.png');
				break;
			//Forno 2002768
			case '2002768':
				fatherBox.addClass('Forno');
				productImage.push('/arquivos/COB84AR_destaque_forno_frente_3.png');
				productImage.push('/arquivos/COB84AR_destaque_forno_lado_1.png');
				productImage.push('/arquivos/COB84AR_destaque_forno_aberto_2.png');
				productImage.push('/arquivos/COB84AR_destaque_forno_ambientado_4.png');
				productImage.push('/arquivos/COB84AR_destaque_forno_ambientado_5.png');
				break;

			default:
				break;
		}

		let galleryThumbs = galleryImg.find('.thumbs');

		productImage.forEach(function(index) {
			galleryThumbs.append(`
				<li>
					<a rel="${index}" title="Zoom" href="javascript:void(0);" id="botaoZoom" class="ON" zoom="${index}">
						<img src=${index}>
					</a>
				</li>
			`);
		});

		gallery.init();

		const setUrlButton = productLink => {
			const skuData = $(productLink)
					.find('.product-sku_radio:checked')
					.data('sku-value'),
				skuButton = productLink.find('.product-buy'),
				skuName = $(productLink)
					.find('.product-sku_radio:checked')
					.parent()
					.data('title');

			skuButton
				.unbind()
				.removeClass('-not-selected-smartbeer')
				.attr(
					'href',
					`/checkout/cart/add?sku=${skuData}&qty=1&seller=1&redirect=true&sc=${
						window.jssalesChannel ? window.jssalesChannel : 3
					}`
				);

			$(window).trigger('cervejeira.skuChanged', {
				skuData: skuData,
				skuName: skuName
			});
		};

		if (productSkuSelector.children().length === 0) {
			let item = skus.find('.from-shelf'),
				skuName = skus.find('input[type=checkbox]').attr('name'),
				sku = skus.parents('.product-info').find('.product-skuSelector'),
				productLink = sku.parents('.product-info');

			if (sku.children().length === 0) {
				for (var i = 0; i < item.length; i++) {
					// prettier-ignore
					let title = item.eq(i).find('input[type=text]').attr('title') === '127V'
							? '110V'
							: item.eq(i).find('input[type=text]').attr('title'),
						skuId = item
							.eq(i)
							.find('input[type=checkbox]')
							.attr('rel'),
						objectClass = title.replace(/\s/g, '') + '_' + skuId,
						isAvailable = item.eq(i).hasClass('unavailable') ? 'unavailable' : 'available';

					skus
						.parents('.smartbeer-showcase')
						.find('.product-skuSelector')
						.attr('name', skuName).append(`
						<div class="product-sku__selector" data-title="${title}">
							<input class="product-sku_radio ${isAvailable}" type="radio" id="${objectClass}" name=${skuName} data-sku-value="${skuId}">
							<label class="product-sku_title ${isAvailable}" for="${objectClass}" name=${skuName}>${title}</label>
						</div>
					`);
				}

				$('.vitrine-smartbeer .product-buy').addClass('-not-selected-smartbeer');

				sku.find('.unavailable').attr('disabled', true);

				if (sku.find('.available').length === 2) {
					sku.find('.available').attr('checked', 'checked');
					setUrlButton(productLink);
				}

				productLink.find('.product-sku_radio').on('change', function() {
					setUrlButton(productLink);
					$('.product-sku_error').addClass('hide');

					$('.product-sku_error').slideUp('slow', function() {});
				});

				$('.-not-selected-smartbeer').on('click', function() {
					$('.product-sku_error').slideDown('slow', function() {
						$('.product-sku_error').removeClass('hide');
					});
				});
			}
		}
	}
};

export default DestaqueEmbutidos;
