// Pega todos produtos que possuem os 6 primeiros catarcteres do modelo iguais ao modelo passado no parâmetro
export const getProductVariety = model => {
	let productField = '/* @echo shelfProductFieldModelo */',
		API_ENDPOINT = '/api/catalog_system/pub/products/search';

	if (!model || model === '') {
		console.error('Modelo de produto inválido');
		return;
	}

	return $.ajax({
		url: API_ENDPOINT,
		data: {
			fq: `specificationFilter_${productField}:${model.substr(0, 6)}*`
		},
		dataType: 'json',
		localCache: true
	}).then(data => data);
};
