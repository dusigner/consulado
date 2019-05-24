'use strict';

require('vendors/slick');

Nitro.module('shelfCategoryHome', function() {
	// Variables
	const $shelfCategory = $('.shelf-category-home');
	const $shelfCategoryConteinaer = $('.shelf-category-home-container');
	const shelfTtitle = $shelfCategoryConteinaer.find('.page-title').text().trim();

	// Tabs
	const shelfCategoryHome = {};

	// Start all
	shelfCategoryHome.init = () => {
		shelfCategoryHome.startSlick();
		shelfCategoryHome.Tracking();
	};

	shelfCategoryHome.startSlick = () => {
		$shelfCategory.slick({
			adaptiveHeight: false,
			arrows: true,
			infinite: false,
			slidesToScroll: 6,
			slidesToShow: 6,
			responsive: [{
				breakpoint: 1100,
				settings: {
					arrows: true,
					dots: false,
					slidesToScroll: 4,
					slidesToShow: 4
				}
			},
			{
				breakpoint: 770,
				settings: {
					arrows: false,
					dots: true,
					infinite: true,
					slidesToScroll: 1,
					slidesToShow: 1
				}
			}]
		});
	};

	shelfCategoryHome.Tracking = () => {
		const prevButton = $shelfCategory.find('.slick-prev');
		const nextButton = $shelfCategory.find('.slick-next');
		const cardItems = $shelfCategory.find('.shelf-category-home-card');

		prevButton.click(() => {
			dataLayer.push({
				event: 'generic',
				category: `[SQUAD] - ${shelfTtitle}`,
				action: 'Clique Seta  Esquerda ',
				label: 'Ver Categorias para esquerda'
			});
		});

		nextButton.click(() => {
			dataLayer.push({
				event: 'generic',
				category: `[SQUAD] - ${shelfTtitle}`,
				action: 'Clique Seta  Direita ',
				label: 'Ver Categorias para Direita'
			});
		});

		cardItems.click(function(e) {
			e.preventDefault();

			const $card = $(this);
			const cardLink = $card.find('.shelf-category-home-card__text').attr('href');
			const cardText = $card.find('.shelf-category-home-card__text').text().replace(/\s+/gmi, ' ');

			dataLayer.push({
				event: 'generic',
				category: `[SQUAD] - ${shelfTtitle} - ${cardText}`,
				action: 'Clique na categoria',
				label: 'Ir para categoria'
			});

			setTimeout(() => {
				window.location.href = cardLink;
			}, 500);
		});
	};

	shelfCategoryHome.init();
});
