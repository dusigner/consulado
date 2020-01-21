import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-vitrine-categorizacao', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.vitrineSubcategorias();
	};

	this.vitrineSubcategorias = () => {

		let acao = $('.vitrine-subcategorias').find('.categories-list a.active').attr('data-category');

		$('.vitrine-subcategorias').find('.categories-list a').on('click', function () {
			acao = $(this).attr('data-category');

			pushDataLayer(
				'[SQUAD] Vitirine Categorizacao',
				`${acao}`,
				`Menu Categoria`
			);
		});

		$('.vitrine-subcategorias').find('.subCategorySection a').on('click', function () {
			const label = $(this).find('img').attr('alt');

			pushDataLayer(
				'[SQUAD] Vitirine Categorizacao',
				`${acao}`,
				`${label}`
			);
		});
	};

	this.init();
});
