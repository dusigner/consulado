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

// Verifica se o desconto está dentro do range estabelecido pelas regras de negócio.
const discountValidate = (discount, productPrice) => {
	const prodDiscount = Number(discount);
	const prodPrice = Number(productPrice);
	const minPrice = 50.0;
	const maxPrice = 950.0;

	return !!(prodDiscount >= minPrice && prodDiscount <= maxPrice && prodDiscount < prodPrice);
};

// Troca os espaços do texto por traços e padroniza o tamanho para definirmos o nome das imagens
const clearText = str => str.replace(/\s+/gmi, '-').toLowerCase();

// Promoção para as prateleiras
const promoDestaque = produto => {
	const hasPromo = produto.find('.FlagsHightLight .flag[class*="__promo__"]');
	const $prodInfo = produto.find('.prod-info, .shelf-item__info');
	const precoDe = formatValue(produto.find('.de .val').text());
	const precoPor = formatValue(produto.find('.por .val').text());
	const desconto = discountCalculate(precoDe, precoPor);

	if (hasPromo.length && precoDe.length && discountValidate(desconto, precoPor)) {
	// if (hasPromo.length) {
		const promoText = hasPromo.text().split('__');
		const promoPreTitle = promoText[2];
		const promoTitle = promoText[3];
		const promoColor = promoText[4];

		const $promoDestaque = `
			<div class="promo-destaque">
				<div class="promo-destaque__text" style="color: ${promoColor}">
					<div class="promo-destaque__icon" style="background-image: url('//loja.consul.com.br/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}.png?v=dln')"></div>
					<div class="promo-destaque__icon" style="background-image: url('//loja.consul.com.br/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}__hover.png?v=dln')"></div>

					${promoPreTitle}<br />
					${promoTitle}
				</div>
				<div class="promo-destaque__price">
					R$-${discountFormat(desconto)}
				</div>

				<div class="promo-destaque__bg" style="background: ${promoColor}"></div>
			</div>
		`;

		$prodInfo.prepend($promoDestaque);
	}
};

// Promoção para a página de produto
const prodPromoDestaque = () => {
	const hasPromo = $('.prod-selos .flag[class*="__promo__"]');
	const $prodPreco = $('.prod-preco');
	const precoDe = formatValue($prodPreco.find('.skuListPrice').text());
	const precoPor = formatValue($prodPreco.find('.skuBestPrice').text());
	const desconto = discountCalculate(precoDe, precoPor);

	if (hasPromo.length && precoDe.length && discountValidate(desconto, precoPor)) {
	// if (hasPromo.length) {
		const promoText = hasPromo.text().split('__');
		const promoPreTitle = promoText[2];
		const promoTitle = promoText[3];
		const promoColor = promoText[4];

		const $promoDestaque = `
			<div class="promo-destaque promo-produto">
				<div class="promo-destaque__text">
					<div class="promo-destaque__icon" style="background-image: url('//loja.consul.com.br/arquivos/cns__promo__${clearText(promoPreTitle + '-' + promoTitle)}__hover.png?v=dln')"></div>
					${promoPreTitle}<br />
					${promoTitle}
				</div>
				<div class="promo-destaque__price" style="color: ${promoColor}">
					Produto com <span>R$${discountFormat(desconto)} de desconto</span>
				</div>

				<div class="promo-destaque__bg" style="background: ${promoColor}"></div>
			</div>
		`;

		$prodPreco.after($promoDestaque);
	}
};

// Inicia a promoção somente na página de produto
if ($('body').hasClass('produto')) {
	prodPromoDestaque();
}

export default promoDestaque;
