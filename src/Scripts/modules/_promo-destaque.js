const valueFormatting = text => {
	const value = text.replace('R$ ', '').replace('.', '').replace(',', '.') ;
	return value;
};

// Promo destaque - Dia das mães
const promoDestaque = produto => {
	const promoProd = produto.find('.FlagsHightLight .flag[class*="_promo-destaque_"]');

	promoProd.each(() => {
		const $prodInfo = produto.find('.prod-info');
		const precoDe = valueFormatting(produto.find('.de .val').text());
		const precoPor = valueFormatting(produto.find('.por .val').text());
		let desconto;

		promoProd.parents('.detalhes').addClass('promo-destaque--is-active');

		if (precoDe) {
			desconto = Number(precoDe - precoPor).toFixed(2);
			desconto = desconto.replace('.', ',');

			const $promoDestaque = `
				<div class="promo-destaque">
					<div class="promo-destaque__text">
						Promoção<br />
						DIA DAS MÃES
					</div>
					<div class="promo-destaque__price">
						R$-${desconto}
					</div>
				</div>
			`;

			$prodInfo.prepend($promoDestaque);
		}
	});
};

export default promoDestaque;