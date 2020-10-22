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
		hasPromo = $('.prod-selos .flag[class*="__promo__"]').first(),
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
			checkIcon = `
				<svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.84551 10.4067C5.71262 10.4068 5.58094 10.3806 5.4582 10.3297C5.33545 10.2788 5.22397 10.2041 5.13013 10.11L0.504858 5.4847C0.314997 5.29484 0.208374 5.03733 0.208374 4.76883C0.208374 4.50032 0.314997 4.24282 0.504858 4.05296C0.69472 3.8631 0.952296 3.75647 1.2208 3.75647C1.48931 3.75647 1.74674 3.8631 1.9366 4.05296L5.84663 7.96299L13.0605 0.749023C13.2504 0.559162 13.508 0.452469 13.7765 0.452469C14.045 0.452469 14.3024 0.559162 14.4923 0.749023C14.6821 0.938885 14.7889 1.19639 14.7889 1.4649C14.7889 1.7334 14.6821 1.99091 14.4923 2.18077L6.55738 10.1158C6.36783 10.303 6.1119 10.4076 5.84551 10.4067Z" fill="${promoColor}"/>
				</svg>`
			,
			cashBackDiscount = promoText[5] ? `R$+${promoText[5].replace('CNS', '')} de desconto` : null,
			promoDiscount = `
				<span class="promo-destaque__price--discount-value">
					<span>${checkIcon}</span>R$${discountFormat(desconto)}
				</span>
				<span class="promo-destaque__price--discount-text">de desconto já aplicado</span>
			`;

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

const prodPromoDestaqueInstitucional = () => {
	const
		hasPromo = $('.prod-selos .flag[class*="__promo__"]').first(),
		hasCashBack = $('.prod-selos .flag[class*="__promo__ganhe"]').length,
		$prodPreco = $('.product-info-bar__price'),
		precoDe = formatValue($prodPreco.find('.skuListPrice').text()),
		precoPor = formatValue($prodPreco.find('.skuBestPrice').text()),
		desconto = discountCalculate(precoDe, precoPor),
		economiaDe = $('.economia-de'),
		economia = $('.economia').text();

	if (hasPromo.length > 0 && precoDe.length && discountPercentageValidate(precoDe, precoPor)) {
		const
			promoText = hasPromo.text().split('__'),
			promoPreTitle = promoText[2],
			promoTitle = promoText[3],
			promoColor = promoText[4],
			checkIcon = `
				<svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.84551 10.4067C5.71262 10.4068 5.58094 10.3806 5.4582 10.3297C5.33545 10.2788 5.22397 10.2041 5.13013 10.11L0.504858 5.4847C0.314997 5.29484 0.208374 5.03733 0.208374 4.76883C0.208374 4.50032 0.314997 4.24282 0.504858 4.05296C0.69472 3.8631 0.952296 3.75647 1.2208 3.75647C1.48931 3.75647 1.74674 3.8631 1.9366 4.05296L5.84663 7.96299L13.0605 0.749023C13.2504 0.559162 13.508 0.452469 13.7765 0.452469C14.045 0.452469 14.3024 0.559162 14.4923 0.749023C14.6821 0.938885 14.7889 1.19639 14.7889 1.4649C14.7889 1.7334 14.6821 1.99091 14.4923 2.18077L6.55738 10.1158C6.36783 10.303 6.1119 10.4076 5.84551 10.4067Z" fill="${promoColor}"/>
				</svg>`
			,
			cashBackDiscount = promoText[5] ? `R$+${promoText[5].replace('CNS', '')} de desconto` : null,
			promoDiscount = `
				<span class="promo-destaque__price--discount-value">
					<span>${checkIcon}</span>R$${discountFormat(desconto)}
				</span>
				<span class="promo-destaque__price--discount-text">de desconto já aplicado</span>
			`;

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

		$prodPreco.siblings('.formas-pagamento-container').after($promoDestaque);

	} else if (economiaDe.length > 0 && precoDe.length && discountPercentageValidate(precoDe, precoPor)) {
		const
			checkIcon = `
				<svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.84551 10.4067C5.71262 10.4068 5.58094 10.3806 5.4582 10.3297C5.33545 10.2788 5.22397 10.2041 5.13013 10.11L0.504858 5.4847C0.314997 5.29484 0.208374 5.03733 0.208374 4.76883C0.208374 4.50032 0.314997 4.24282 0.504858 4.05296C0.69472 3.8631 0.952296 3.75647 1.2208 3.75647C1.48931 3.75647 1.74674 3.8631 1.9366 4.05296L5.84663 7.96299L13.0605 0.749023C13.2504 0.559162 13.508 0.452469 13.7765 0.452469C14.045 0.452469 14.3024 0.559162 14.4923 0.749023C14.6821 0.938885 14.7889 1.19639 14.7889 1.4649C14.7889 1.7334 14.6821 1.99091 14.4923 2.18077L6.55738 10.1158C6.36783 10.303 6.1119 10.4076 5.84551 10.4067Z" fill="#ffffff"/>
				</svg>`
			,
			promoDiscount = `
				<span class="promo-destaque__price--discount-value promo-destaque__economic--discount-value">
					<span>${checkIcon}</span>${economia}
				</span>
				<span class="promo-destaque__price--discount-text promo-destaque__economic--discount-text">de desconto já aplicado</span>
			`;

		const $promoDestaque = `
			<div class="promo-destaque promo-produto" style="background-color: #9aca3c;">
				<div class="promo-destaque__price promo-destaque__economic" style="color: #ffffff">
					${promoDiscount}
				</div>
			</div>
		`;

		$prodPreco.siblings('.formas-pagamento-container').after($promoDestaque);
	}
};

// Inicia a promoção somente na página de produto
if ($('body').hasClass('produto-v2')) {
	prodPromoDestaque();
}

if ($('body').hasClass('produto-institucional')) {
	prodPromoDestaqueInstitucional();

	console.info('PDPI');
}

export default promoDestaque;
