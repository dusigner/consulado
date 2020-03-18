// Transforma o texto do front em números para o cálculo do desconto.
const formatValue = text => {
	let value = text
		.replace('R$ ', '')
		.replace('.', '')
		.replace(',', '.');

	return value;
};

// Calcula a diferença entre o preço anterior do produto e o preço atual.
const discountCalculate = (listPrice, bestPrice) => Number(listPrice - bestPrice).toFixed(2);

// Troca o ponto por vírgula para exibição no front.
const discountFormat = discount => discount.replace('.', ',');

// Verifica se o desconto está dentro do range nominal estabelecido pelas regras de negócio.
/*const discountNominalValidate = (discount, productPrice) => {
	const prodDiscount = Number(discount);
	const prodPrice = Number(productPrice);
	const minPrice = 50.0;
	const maxPrice = 950.0;

	return !!(prodDiscount >= minPrice && prodDiscount <= maxPrice && prodDiscount < prodPrice);
};*/

// Verifica se o desconto está dentro do range percentual estabelecido pelas regras de negócio.
const discountPercentageValidate = (prodListPrice, prodBestPrice) => {
	const discountPercentage = Math.abs((prodBestPrice / prodListPrice ) - 1).toFixed(2);
	const discountMin = 0.05; // Mínimo de 5% de desconto
	const discountMax = 0.60; // Máximo de 60% de desconto

	return !!(discountPercentage >= discountMin && discountPercentage <= discountMax);
};

// Troca os espaços do texto por traços e padroniza o tamanho para definirmos o nome das imagens
const clearText = str => str.replace(/\s+/gmi, '-').replace(/\*/gm, '').toLowerCase();

// Promoção para as prateleiras
const promoDestaque = produto => {
	const
		hasPromo = produto.find('.FlagsHightLight .flag[class*="__promo__"]'),
		hasCashBack = produto.find('.flag[class*="__promo__ganhe"]').length,
		$prodInfo = produto.find('.prod-info, .shelf-item__info'),
		precoDe = formatValue(produto.find('.de .val').text()),
		precoPor = formatValue(produto.find('.por .val').text()),
		desconto = discountCalculate(precoDe, precoPor);

	// if (hasPromo.length && precoDe.length && discountNominalValidate(desconto, precoPor)) {
	if (hasPromo.length && precoDe.length && discountPercentageValidate(precoDe, precoPor)) {
	// if (hasPromo.length) {
		const
			promoText = hasPromo.text().split('__'),
			promoPreTitle = promoText[2],
			promoTitle = promoText[3],
			promoColor = promoText[4],
			cashBackDiscount = promoText[5] ? `R$+${promoText[5]}` : null,
			promoDiscount = `R$-${discountFormat(desconto)}`;

		const $promoDestaque = `
			<div class="promo-destaque">
				<div class="promo-destaque__text" style="color: ${promoColor}">
					<div class="promo-destaque__icon" style="background-image: url('/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}.png?v=dln')"></div>
					<div class="promo-destaque__icon" style="background-image: url('/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}__hover.png?v=dln')"></div>

					${promoPreTitle}<br />
					${promoTitle}
				</div>
				<div class="promo-destaque__price">
					${hasCashBack && cashBackDiscount ? cashBackDiscount : promoDiscount}
				</div>

				<div class="promo-destaque__bg" style="background: ${promoColor}"></div>
			</div>
		`;

		$prodInfo.prepend($promoDestaque);
	}
};

// Promoção para a página de produto
const prodPromoDestaque = () => {
	const
		hasPromo = $('.prod-selos .flag[class*="__promo__"]'),
		hasCashBack = $('.prod-selos .flag[class*="__promo__ganhe"]').length,
		$prodPreco = $('.prod-preco'),
		precoDe = formatValue($prodPreco.find('.skuListPrice').text()),
		precoPor = formatValue($prodPreco.find('.skuBestPrice').text()),
		desconto = discountCalculate(precoDe, precoPor);

	// if (hasPromo.length && precoDe.length && discountNominalValidate(desconto, precoPor)) {
	if (hasPromo.length && precoDe.length && discountPercentageValidate(precoDe, precoPor)) {
	// if (hasPromo.length) {
		const
			promoText = hasPromo.text().split('__'),
			promoPreTitle = promoText[2],
			promoTitle = promoText[3],
			promoColor = promoText[4],
			cashBackDiscount = promoText[5] ? `R$+${promoText[5].replace('CNS', '')} de desconto` : null,
			promoDiscount = `R$-${discountFormat(desconto)} de desconto`;

		const $promoDestaque = `
			<div class="promo-destaque promo-produto">
				<div class="promo-destaque__text">
					<div class="promo-destaque__icon" style="background-image: url('/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}__hover.png?v=dln')"></div>
					${promoPreTitle}<br />
					${promoTitle}
				</div>
				<div class="promo-destaque__price" style="color: ${promoColor}">
					${hasCashBack && cashBackDiscount ? cashBackDiscount : promoDiscount}
				</div>

				<div class="promo-destaque__bg" style="background: ${promoColor}"></div>
			</div>
		`;

		$prodPreco.after($promoDestaque);
	}
};

// Inicia a promoção somente na página de produto
if ($('body').hasClass('produto-v2')) {
	prodPromoDestaque();
}

export default promoDestaque;
