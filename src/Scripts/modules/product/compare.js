'use strict';

Nitro.module('compare', function() {
	let prodData = {
		id: skuJson.productId,
		name: skuJson.name,
		cache: skuJson.skus[0].cacheVersionUsedToCallCheckout,
		image: skuJson.skus[0].image,
		category: vtxctx.categoryName
	}

	let prodsToCompare = [];

	self.init = () => {
		self.build();
		self.addToCompare();
	};

	self.build = () => {
		const prodTitle = document.querySelector('.prod-title');

		const content = `
			<div class="prod-compare" style="display: inline-block; width: 100%;">
				<div class="container" style="align-itens: center; display: flex; justify-content: flex-start;">
					<input type="checkbox" id="${prodData.cache}" class="compare-product-checkbox" rel="${prodData.id}"/>
					<label htmlFor="${prodData.cache}">Comparar produto</label>
				</div>
			</div>
		`;

		prodTitle.insertAdjacentHTML('afterend', content);
	};

	self.addToCompare = () => {

		const prodCompare = document.querySelector('.prod-compare');
		// prodCompare ? console.info('prodCompare existe') : console.info('prodCompare não existe');
		prodCompare.addEventListener('click', () => {
			const prod = {
				category: prodData.category,
				image: prodData.image,
				rel: prodData.id,
				title: prodData.name
			}

			// console.info({
			// 	category: prodData.category,
			// 	image: prodData.image,
			// 	rel: prodData.id,
			// 	title: prodData.name
			// });

			if(localStorage.getItem('comparador') === null) {
				window.localStorage.setItem('comparador', []);
				window.localStorage.setItem('comparadorContador', 0);
			}

			if (parseInt(localStorage.getItem('comparadorContador')) <= 2) {
				prodsToCompare.push(prod);
				window.localStorage.setItem('comparador', JSON.stringify(prodsToCompare));
				window.localStorage.setItem('comparadorContador', (parseInt(localStorage.getItem('comparadorContador')) + 1));
			} else {
				console.warn('Já estamos comparando 3 itens!');
			}

			// console.info(JSON.parse(window.localStorage.getItem('comparador')));
		});
	}

	self.init();
});
