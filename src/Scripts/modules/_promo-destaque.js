const valueFormatting = text => {
	const value = text.replace('R$ ', '').replace('.', '').replace(',', '.') ;
	return value;
};

const calculateDiscount = (listPrice, bestPrice) => {
	let discount = Number(listPrice - bestPrice).toFixed(2);
	return discount.replace('.', ',');
};

// Promo destaque - Dia das mães
const promoDestaque = produto => {
	const promoProd = produto.find('.FlagsHightLight .flag[class*="_promo-destaque_"]');

	promoProd.each(() => {
		const $prodInfo = produto.find('.prod-info');
		const precoDe = valueFormatting(produto.find('.de .val').text());
		const precoPor = valueFormatting(produto.find('.por .val').text());

		promoProd.parents('.detalhes').addClass('promo-destaque--is-active');

		if (precoDe.length) {

			const $promoDestaque = `
				<div class="promo-destaque">
					<div class="promo-destaque__text">
						Promoção<br />
						DIA DAS MÃES
					</div>
					<div class="promo-destaque__price">
						R$-${calculateDiscount(precoDe, precoPor)}
					</div>
				</div>
			`;

			$prodInfo.prepend($promoDestaque);
		}
	});
};

const prodPromoDestaque = () => {
	const hasPromoDestaque = $('.prod-selos .flag[class*="_promo-destaque_"]');
	const $prodPreco = $('.prod-preco');
	const precoDe = valueFormatting($prodPreco.find('.skuListPrice').text());
	const precoPor = valueFormatting($prodPreco.find('.skuBestPrice').text());

	if (hasPromoDestaque.length) {
		const $promoDestaque = `
			<div class="promo-destaque promo-produto">
				<div class="promo-destaque__text">
					Promoção<br />
					DIA DAS MÃES
				</div>
				<div class="promo-destaque__price">
					Produto com <span>R$${calculateDiscount(precoDe, precoPor)} de desconto</span>
				</div>
			</div>
		`;

		$prodPreco.after($promoDestaque);
	}
};

if ($('body').hasClass('produto')) {
	prodPromoDestaque();
}








export default promoDestaque;