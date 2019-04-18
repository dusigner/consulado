'use strict';

import 'vendors/nitro';
import 'vendors/slick';
import Tab from 'modules/tabs';

Nitro.setup(['dia-das-maes'], function () {

	class DiaDasMaes {
		constructor() {
			this.slickConfig = {
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
		}

		sectionSeuJeitinho() {
			const tab = new Tab('seu-jeitinho');
			tab.init();
		}

		initSlick() {
			$('.prateleira-slider .prateleira>ul').slick(this.slickConfig);
		}

		reInitSlickOnTabChange() {
			$(window).on('Tab.changed', (e, $nav, $content) => {
				$($content).find('.prateleira > ul').slick('unslick').slick(this.slickConfig);

			});
		}

		sectionDescontos() {
			const $listItem = $('#descontos .list-items'),
				$overlay = $('.overlay'),
				$selectedItem = $('.item-selected'),
				openItems = () => {
					if ($(window).width() < 960) {

						const changeTextButton = () => $selectedItem.html($listItem.find('.-active button').html());

						changeTextButton();

						$selectedItem.add($listItem.find('li')).unbind().click(() => {
							$overlay.toggleClass('-hidden');
							$listItem.toggleClass('-active').parents('.group').toggleClass('-opened');

							changeTextButton();

						});
					} else $selectedItem.unbind();
				};

			openItems();

			$(window).on('resize', () => {
				openItems();
			});
		}

		init() {
			this.sectionSeuJeitinho();
			this.initSlick();
			this.reInitSlickOnTabChange();
			this.sectionDescontos();
		}


	}


	const diaDasMaes = new DiaDasMaes();
	diaDasMaes.init();

});


