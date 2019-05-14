'use strict';

require('vendors/slick');

Nitro.module('shelfCategoryHome', function() {

	// Tabs
	const shelfCategoryHome = {};

	// Start all
	shelfCategoryHome.init = function() {
		console.log('@@@@@@@@@@ ____ shelfCategoryHome');
		let categoriasHome = `
			<div class="container"> <div class="shelf-category-home"> <!-- Cervejeiras --> <div class="shelf-category-home-card"> <a class="shelf-category-home-card__image" href="#" title="Cervejeiras"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__cervejeiras.png" alt="Cervejeiras" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Cervejeiras"> Nossas <h2 class="shelf-category-home-card__title">Cervejeiras</h2> </a> </div> <!-- Geladeiras --> <div class="shelf-category-home-card"> <a class="shelf-category-home-card__image" href="" title="Geladeiras"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__geladeiras.png" alt="Geladeiras" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Geladeiras"> Nossas <h2 class="shelf-category-home-card__title">Geladeiras</h2> </a> </div> <!-- Cooktops --> <div class="shelf-category-home-card"> <a class="shelf-category-home-card__image" href="#" title="Cooktops"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__cooktops.png" alt="Cooktops" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Cooktops"> Nossas <h2 class="shelf-category-home-card__title">Cooktops</h2> </a> </div> <!-- Coifas --> <div class="shelf-category-home-card shelf-coifa"> <a class="shelf-category-home-card__image" href="#" title="Coifas"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__coifas.png" alt="Coifas" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Coifas"> Nossas <h2 class="shelf-category-home-card__title">Coifas</h2> </a> </div> <!-- Fornos --> <div class="shelf-category-home-card"> <a class="shelf-category-home-card__image" href="#" title="Fornos"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__fornos.png" alt="Fornos" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Fornos"> Nossas <h2 class="shelf-category-home-card__title">Fornos</h2> </a> </div> <!-- Lavadoras --> <div class="shelf-category-home-card"> <a class="shelf-category-home-card__image" href="#" title="Lavadoras"> <span class="shelf-category-home-card__image-container"> <img src="/arquivos/shelf-category-home__lavadoras.png" alt="Lavadoras" /> </span> </a> <a class="shelf-category-home-card__text" href="#" title="Lavadoras"> Nossas <h2 class="shelf-category-home-card__title">Lavadoras</h2> </a> </div> </div> </div>
		`;
		const $homeBanners = $('.banners.hide-extra-small');

		$homeBanners.after(categoriasHome);

		setTimeout(shelfCategoryHome.startSlick, 5000);
	};

	shelfCategoryHome.startSlick = function() {
		const $shelfCategory = $('.shelf-category-home');

		console.log('Slick starting...');

		$shelfCategory.slick({
			adaptiveHeight: false,
			arrows: false,
			infinite: true,
			slidesToScroll: 6,
			slidesToShow: 6,
			responsive: [
				{
					breakpoint: 1100,
					settings: {
						dots: true,
						slidesToScroll: 4,
						slidesToShow: 4
					}
				},
				{
					breakpoint: 770,
					settings: {
						dots: true,
						slidesToScroll: 3,
						slidesToShow: 3
					}
				},
				{
					breakpoint: 480,
					settings: {
						dots: true,
						slidesToScroll: 2,
						slidesToShow: 2
					}
				}
			]
		});
	};

	shelfCategoryHome.init();
});
