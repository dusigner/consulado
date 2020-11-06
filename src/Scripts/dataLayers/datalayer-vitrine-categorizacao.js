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

		$('.vitrine-subcategorias .subCategorySection a.subcategory-link').on('click', function () {
			const label = $(this).find('img').attr('alt');

			pushDataLayer(
				'[SQUAD] Vitirine Categorizacao',
				`${acao}`,
				`${label}`
			);
		});

		$('.vitrine-subcategorias').find('.subCategorySection ul button.slick-arrow').on('click', function () {
			const data = $(this).parents('.subCategorySection').attr('data-category');
			const seta = $(this).attr('aria-label');
			pushDataLayer(
				'[SQUAD] Vitirine Categorizacao',
				`${data}`,
				`Seta ${seta === 'Previous' ? 'Esquerda' : 'Direita'}`
			);
		});

		$('.vitrine-subcategorias .subCategorySection > a.categoryLink').on('click', function () {
			const data = $(this).parents('.subCategorySection').attr('data-category');
			const link = $(this).text();

			pushDataLayer(
				'[SQUAD] Vitirine Categorizacao',
				`${data}`,
				`${link}`
			);
		});

	};

	this.init();
});
