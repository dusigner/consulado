const valueFormatting = text => {
	const value = text.replace('R$ ', '').replace('.', '').replace(',', '.') ;
	return value;
};

// Promo destaque - Dia das mães
module.exports = (produto) => {
	const promoProd = $(produto).find('.FlagsHightLight .flag[class*="_promo-destaque_"]');

	promoProd.each(function(index, element) {
		const $promoItem = $(element).parents('.box-produto');
		const $prodInfo = $promoItem.find('.prod-info');
		const precoDe = valueFormatting($promoItem.find('.de .val').text());
		const precoPor = valueFormatting($promoItem.find('.por .val').text());
		let desconto;

		if (precoDe) {
			desconto = Number(precoDe - precoPor).toFixed(2);
			desconto = desconto.replace('.', ',');

			const $promoDestaque = `
				<div class="promo-destaque">
					<div class="promo-destaque__price">
						-R$${desconto}
					</div>
				</div>
			`;

			$prodInfo.prepend($promoDestaque);
		}
	});
};