const valueFormat = text => {
	const value = text.replace('R$ ', '').replace('.', '').replace(',', '.') ;
	return value;
};

const discountCalculate = (listPrice, bestPrice) => Number(listPrice - bestPrice).toFixed(2);

const discountFormat = discount => discount.replace('.', ',');

// Verifica se o desconto está dentro do range estabelecido pelas regras de negócio;
const discountValidate = discount => {
	const minPrice = 50.00;
	const maxPrice = 900.00;
	const prodDiscount = Number(discount);

	return !!(prodDiscount > minPrice && prodDiscount < maxPrice);
};

// Promo destaque - Dia das mães
const promoDestaque = produto => {
	const promoProd = produto.find('.FlagsHightLight .flag[class*="_promo-destaque_"]');
	const $prodInfo = produto.find('.prod-info');
	const precoDe   = valueFormat(produto.find('.de .val').text());
	const precoPor  = valueFormat(produto.find('.por .val').text());
	const desconto  = discountCalculate(precoDe, precoPor);

	if (promoProd.length && precoDe.length && discountValidate(desconto)) {
		const $promoDestaque = `
			<div class="promo-destaque">
				<div class="promo-destaque__text">
					Promoção<br />
					DIA DAS MÃES
				</div>
				<div class="promo-destaque__price">
					R$-${discountFormat(desconto)}
				</div>
			</div>
		`;

		$prodInfo.prepend($promoDestaque);
	}
};

const prodPromoDestaque = () => {
	const hasPromo   = $('.prod-selos .flag[class*="_promo-destaque_"]');
	const $prodPreco = $('.prod-preco');
	const precoDe    = valueFormat($prodPreco.find('.skuListPrice').text());
	const precoPor   = valueFormat($prodPreco.find('.skuBestPrice').text());

	if (hasPromo.length) {
		const $promoDestaque = `
			<div class="promo-destaque promo-produto">
				<div class="promo-destaque__text">
					Promoção<br />
					DIA DAS MÃES
				</div>
				<div class="promo-destaque__price">
					Produto com <span>R$${discountCalculate(precoDe, precoPor)} de desconto</span>
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