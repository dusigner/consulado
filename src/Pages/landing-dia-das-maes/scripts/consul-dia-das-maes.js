'use strict';

import 'vendors/nitro';
import 'vendors/slick';
import { checkInlineDatalayers } from 'modules/_datalayer-inline';
import Tab from 'modules/tabs';
import './custom-datalayer';

Nitro.setup(['custom-datalayer'], function () {
	checkInlineDatalayers();

	/**
	 * Class to create a DiaDasMaes Module
	 *
	 * @class DiaDasMaes
	 */
	class DiaDasMaes {

		/**
		 * *Section SeuJeitinho
		 * Init tab and slick carroussel
		 *
		 * @memberof DiaDasMaes
		 */
		sectionSeuJeitinho() {
			const tab = new Tab('seu-jeitinho'),
				$navItems = $('#seu-jeitinho .tab'),
				slickConfig = {
					slidesToShow: 2,
					slidesToScroll: 2,
					responsive: [
						{
							breakpoint: 640,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							}
						}
					]
				};

			$navItems.find('li').each((index, el) => {
				$(el).click(() => {
					$navItems.attr('data-active-item', index);
				});
			});

			tab.init();

			$('#seu-jeitinho .prateleira-slider .prateleira>ul').slick(slickConfig);

			$(window).on('Tab.willChange', (e, $nav, $prevContent, $content) => {
				setTimeout(() => {
					$($content).find('.prateleira > ul').slick('setPosition', 0);
				}, 650);
			});
		}

		/**
		 * *Section Descontos
		 * Init tab and slick carroussel
		 *
		 * @memberof DiaDasMaes
		 */
		sectionDescontos() {
			const $listItem = $('#descontos .list-items'),
				$overlay = $('.overlay'),
				$selectedItem = $('.item-selected'),
				tab = new Tab('descontos'),
				slickConfig = {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: true,
					responsive: [{
						breakpoint: 1200,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 1,
						}
					}, {
						breakpoint: 960,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
						}
					}, {
						breakpoint: 640,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
						}
					}]
				};

			/**
			 * Create a select box
			 * for mobile devices
			 *
			 */
			const openItems = () => {
				if ($(window).width() < 960) {

					const changeTextButton = () => $selectedItem.html($listItem.find('button.-active').html());

					changeTextButton();

					$selectedItem.add($listItem.find('li')).unbind().click(() => {
						$overlay.toggleClass('-hidden');
						$listItem.toggleClass('-active').parents('.group').toggleClass('-opened');

						changeTextButton();

					});
				} else $selectedItem.unbind();
			};

			openItems();
			tab.init();

			$('#descontos .prateleira-slider .prateleira>ul').slick(slickConfig);

			$(window).on('Tab.willChange', (e, $nav, $prevContent, $content) => {
				setTimeout(() => {
					$($content).find('.prateleira > ul').slick('setPosition', 0);
				}, 650);
			});

			$(window).on('resize', () => {
				openItems();
			});
		}

		/**
		 * Init DiaDasMaes
		 *
		 * @memberof DiaDasMaes
		 */
		init() {
			this.sectionSeuJeitinho();
			this.sectionDescontos();
		}


	}


	const diaDasMaes = new DiaDasMaes();
	diaDasMaes.init();

});


