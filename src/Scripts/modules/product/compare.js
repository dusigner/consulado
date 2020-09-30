'use strict';

Nitro.module('compare', function () {
	let prodData = {
		id: skuJson.productId,
		name: skuJson.name,
		cache: skuJson.skus[0].cacheVersionUsedToCallCheckout,
		image: skuJson.skus[0].image,
		category: vtxctx.categoryName,
		categoryId: vtxctx.categoryId,
	}

	let prodsToCompare = [];

	self.init = () => {
		self.build();
		self.addToCompare();
	};

	self.build = () => {

		let prodTitle = $('.prod-wishlist_compare');

		let content = `
				<div class="product-compare">
					<input type="checkbox" id="${prodData.cache}" rel="${prodData.id}"/>
					<label for="${prodData.cache}" htmlFor="${prodData.cache}">Comparar produto</label>
				</div>
		`;

		prodTitle.append(content);
	};

	self.addToCompare = () => {

		const prodCompare = document.querySelector('.product-compare');
		// prodCompare ? console.info('prodCompare existe') : console.info('prodCompare não existe');
		prodCompare.addEventListener('click', () => {

			dataLayer.push({
				event: 'generic',
				category: 'PDP_vitrine_superior',
				action: 'clique',
				label: 'comparar_produto'
			});

			const $compareBar = $('.compare-bar');
			$compareBar.addClass('-is--active');

			const prod = {
				category: prodData.category,
				image: prodData.image,
				rel: prodData.id,
				title: prodData.name
			}

			const $productCompare = $('.compare-bar__product').first().addClass('-has-product');

			$productCompare.html('<div class="compare-bar__product-close js-remove-item" data-text="' +
				prod.title +
				'" data-rel="' +
				prod.rel +
				'"></div>' +
				'<div class="compare-bar__product-image">' +
				'<img src="' +
				prod.image +
				'" alt="' +
				prod.title +
				'" />' +
				'</div>' +
				'<div class="compare-bar__product-name">' +
				prod.title +
				'</div>');

			// console.info({
			// 	category: prodData.category,
			// 	image: prodData.image,
			// 	rel: prodData.id,
			// 	title: prodData.name
			// });

			if (localStorage.getItem('comparadorPdp') === null) {
				window.localStorage.setItem('comparadorPdp', []);
				window.localStorage.setItem('comparadorContador', 0);
			}

			if (parseInt(localStorage.getItem('comparadorContador')) <= 100) {
				prodsToCompare.push(prod);
				window.localStorage.setItem('comparadorPdp', JSON.stringify(prodsToCompare));
				window.localStorage.setItem('comparadorContador', (parseInt(localStorage.getItem('comparadorContador')) + 1));
			} else {
				console.warn('Já estamos comparando 3 itens!');
			}

			let categoryIdStr = prodData.categoryId.toString();

			let $link = `/api/catalog_system/pub/category/${categoryIdStr}`;

			$.ajax({
				async: true,
				crossDomain: true,
				url: $link,
				type: 'GET',
				dataType: 'json',
			}).done(function (data) {
				console.info("...redirecionando");
				setTimeout(function () {
					window.location.replace(data.url);
				}, 1500);
			}).fail(function (error) {
				console.warn(error);
			});

			// setTimeout(function(){
			// 	window.location.replace(`/${prodData.department}/${prodData.categoryurl}`);
			// }, 1500);

			// console.info(JSON.parse(window.localStorage.getItem('comparador')));
		});
	}

	self.init();
});
