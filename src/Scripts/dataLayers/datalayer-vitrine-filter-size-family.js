import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('datalayer-vitrine-filter-size-family', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.vitrineFilterFamily();
	};

	this.vitrineFilterFamily = () => {

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
	this.taggingSelo = () => {
        var $categoryVitrine = 'Vitrines_Tamanho-familia';
        $('body').on('click', '.container .list-container .main .vitrine .prateleira ul li .box-produto', function() {
            var $label = '';
            var $nameProduct = '';
            $label = $(this).parents('li').find('.promo-destaque__icon').attr('style')
            $nameProduct = $(this).parents('li').find('.nome').text()
            if ( $label === `background-image: url('/arquivos/cns__promo__famílias-pequenas.png?v=dln')` ) {
                pushDataLayer(
                    `[SQUAD] ${$categoryVitrine}`,
                    `${$nameProduct}`,
                    `Familias pequenas`
                );
            } else if ( $label === `background-image: url('/arquivos/cns__promo__famílias-médias.png?v=dln')` ) {
                pushDataLayer(
                    `[SQUAD] ${$categoryVitrine}`,
                    `${$nameProduct}`,
                    `Familias médias`
                );
            } else if ( $label === `background-image: url('/arquivos/cns__promo__famílias-grandes.png?v=dln')` ) {
                pushDataLayer(
                    `[SQUAD] ${$categoryVitrine}`,
                    `${$nameProduct}`,
                    `Familias grandes`
                );
            }
        });

	this.init();
});
