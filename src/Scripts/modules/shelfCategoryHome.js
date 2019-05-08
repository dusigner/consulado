'use strict';

require('vendors/slick');

Nitro.module('shelfCategoryHome', function () {

	// Tabs
	const shelfCategoryHome = {};

	// Start all
	shelfCategoryHome.init = function () {
		console.log('@@@@@@@@@@ ____ shelfCategoryHome');
		let categoriasHome = `

		<div class="container">
		<div class="shelf-category-home">

			<!-- Cervejeiras -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__cervejeiras.png" alt="Cervejeiras" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Cervejeiras</h2>
				</div>
			</div>

			<!-- Geladeiras -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__geladeiras.png" alt="Geladeiras" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Geladeiras</h2>
				</div>
			</div>

			<!-- Cooktops -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__cooktops.png" alt="Cooktops" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Cooktops</h2>
				</div>
			</div>

			<!-- Coifas -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__coifas.png" alt="Coifas" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Coifas</h2>
				</div>
			</div>

			<!-- Fornos -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__fornos.png" alt="Fornos" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Fornos</h2>
				</div>
			</div>

			<!-- Lavadoras -->
			<div class="shelf-category-home-card">
				<div class="shelf-category-home-card__image">
					<div class="shelf-category-home-card__image-container">
						<img src="/arquivos/shelf-category-home__lavadoras.png" alt="Lavadoras" />
					</div>
				</div>

				<div class="shelf-category-home-card__text">
					Nossas
					<h2 class="shelf-category-home-card__title">Lavadoras</h2>
				</div>
			</div>
		</div>
	</div>

		`;


		const $homeBanners = $('.banners.hide-extra-small');
		$homeBanners.after(categoriasHome);
	};

	// Start the slick shelfs
	// tabs.initSlick = () => {
	// 	tabPrateleira.find('.prateleira.default > ul').slick({
	// 		adaptiveHeight: false,
	// 		arrows: true,
	// 		infinite: true,
	// 		slidesToScroll: 4,
	// 		slidesToShow: 4,
	// 		responsive: [{
	// 			breakpoint: 990,
	// 			settings: {
	// 				arrows: true,
	// 				dots: true,
	// 				slidesToScroll: 2,
	// 				slidesToShow: 2
	// 			}
	// 		}, {
	// 			breakpoint: 480,
	// 			settings: {
	// 				arrows: true,
	// 				dots: true,
	// 				slidesToScroll: 1,
	// 				slidesToShow: 1
	// 			}
	// 		}]
	// 	});
	// };

	shelfCategoryHome.init();
});
