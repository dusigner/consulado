import {
	checkInlineDatalayers,
	pushDataLayer
} from 'modules/_datalayer-inline';

Nitro.module('dataLayer-categoria', function () {

	this.init = () => {
		checkInlineDatalayers();

		this.breadCrumb();
		this.shelfSelectSku();
		this.bannerDataLayer();
		this.taggingSelo();
		this.dataLayerAlavancasComerciais();
		this.positionBanner();
	},

		this.breadCrumb = () => {
			$('.breadcrumb a').click(function () {
				const category = $(this).text();

				pushDataLayer(
					'[SQUAD] Breadcrumb Eletrodomésticos',
					`Ir para a Categoria ${category === 'Consul' || category === 'ConsulQA' ? 'Home' : category}`,
					`Ir para a Categoria ${category === 'Consul' || category === 'ConsulQA' ? 'Home' : category}`
				);
			});
		};

	this.shelfSelectSku = () => {
		$(window).on('shelf.skuChanged', (e, data) => {
			pushDataLayer(
				`${data.productName} ${data.skuName}`,
				'Escolher Voltagem Cervejeira',
				`Escolher Voltagem ${data.productName} ${data.skuName}`
			);
		});
	};

	this.bannerDataLayer = () => {
		const category = dataLayer[0].categoryName;
		$('.category-page-top-banner a').on('click', function () {
			pushDataLayer(
				`[SQUAD] Banner Categoria - ${category}`,
				'Clique no banner',
				'Banner Promocional'
			);
		});
	},

		//Posição do banner, nome da PDC mais nome do banner
		this.positionBanner = () => {
			$('img').on('click', function () {
				const getAlt = $(this).attr('alt') //get alt the image

				const categoryName = dataLayer[0].categoryName; //get name the page category
				$('.slick-slide a').on('click', function () {

					const slickIndex = $(this).parent().attr('data-slick-index')
					window.dataLayer.push({
						event: 'generic',
						category: `categoria_${categoryName}`,
						action: `click_banner_${slickIndex}`,
						label: `${getAlt}`
					})
				});
			})
		},

		this.taggingSelo = () => {
			var $categoryVitrine = 'Vitrines_Tamanho-familia';

			$('body').on('click', '.container .list-container .main .vitrine .prateleira ul li .box-produto', function () {
				var $label = '';
				var $nameProduct = '';

				$label = $(this).parents('li').find('.promo-destaque__icon').attr('style')
				$nameProduct = $(this).parents('li').find('.nome').text()

				if ($label === `background-image: url('/arquivos/cns__promo__famílias-pequenas.png?v=dln')`) {
					pushDataLayer(
						`[SQUAD] ${$categoryVitrine}`,
						`${$nameProduct}`,
						`Familias pequenas`
					);
				} else if ($label === `background-image: url('/arquivos/cns__promo__famílias-médias.png?v=dln')`) {
					pushDataLayer(
						`[SQUAD] ${$categoryVitrine}`,
						`${$nameProduct}`,
						`Familias médias`
					);
				} else if ($label === `background-image: url('/arquivos/cns__promo__famílias-grandes.png?v=dln')`) {
					pushDataLayer(
						`[SQUAD] ${$categoryVitrine}`,
						`${$nameProduct}`,
						`Familias grandes`
					);
				}
			});
		}



	this.dataLayerAlavancasComerciais = () => {
		$('.category-alavancas-comerciais__banners .box-banner').on('click', function(){
			const option = $(this).find('a img').attr('alt').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
			const categoryName = dataLayer[0].categoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();;
			pushDataLayer(
				`black_friday_2020`,
				`categoria_${categoryName}`,
				`click_alavanca_promocao_${option}`
			);
		})
	}

	this.init();
});
