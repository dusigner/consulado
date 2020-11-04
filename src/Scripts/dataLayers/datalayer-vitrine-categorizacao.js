import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-vitrine-categorizacao', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.vitrineSubcategorias();

		this.dataLayerBFCoupons();
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

	this.dataLayerBFCoupons = () => {
		$(window).load(function(){
			if($('body').hasClass('produto') && $('.black-friday-coupons').length){
				let couponName = $('.prod-info .prod-selos .black-friday-coupons').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();

				dataLayer.push({
					event: 'generic',
					category: 'PDP_cupom',
					action: 'exbicao_cupom ',
					label: `exibicao_${couponName}`
				})
			}

			$('.black-friday-coupons').on('click', function(){
				let couponName = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
				let pageCategory = dataLayer[0].pageCategory.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
				dataLayer.push({
					event: 'generic',
					category: `Vitrine_cupom_${pageCategory}`,
					action: 'click_copiar_cupom',
					label: `cupom_${couponName}`
				})

				setTimeout(function(){
					dataLayer.push({
						event: 'generic',
						category: `Vitrine_cupom_${pageCategory}`,
						action: 'exbicao_codigo_copiado ',
						label: 'codigo_copiado_sucesso '
					})
				}, 1000)
			})

		})
	}

	this.init();
});
