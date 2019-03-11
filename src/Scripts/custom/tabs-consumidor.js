'use strict';

require('vendors/slick');

Nitro.module('tabs-consumidor', function () {
	// Variables
	const tabPrateleira = $('.prateleira-tabs');
	const contentTitles = $('.prateleira-tabs__tabs');
	const tabsTitles = tabPrateleira.find('h2');

	// Tabs
	const tabs = {};

	// Start all
	tabs.init = function () {
		tabs.titleTemplate();
		tabs.handleActiveTabs();
		tabs.firstActiveTabs();
		tabs.handleActiveMobileTabs();
		tabs.initSlick();
	};

	// Titles
	tabs.titleTemplate = () => {
		tabsTitles.each((index, tab) => {
			const tabText = $(tab).text();
			const tabTemplate = `
				<li class="prateleira-tabs__tab tab-${index}" data-tab="tab-${index}">
					${tabText}
				</li>
			`;

			$(tab).parent().addClass('tab-' + index);
			contentTitles.append(tabTemplate);
		});
	};

	// Active tabs
	tabs.handleActiveTabs = () => {
		const tab = $('.prateleira-tabs__tab');

		tab.click(function () {
			const tabId = $(this).data('tab');
			const thisTab = $(this);
			const cssClass = 'is--active';

			tab.removeClass(cssClass);
			thisTab.addClass(cssClass);

			tabPrateleira.find('.prateleira').removeClass(cssClass);
			tabPrateleira.find('.' + tabId).addClass(cssClass);
		});
	};

	// Mobile select tabs
	tabs.handleActiveMobileTabs = () => {
		contentTitles.click(function () {
			const pageWidth = $(window).width();
			if (pageWidth < 768) {
				contentTitles.toggleClass('is-mobile--active');
			}
		});
	};

	// Active first tab
	tabs.firstActiveTabs = () => {
		tabPrateleira.find('.tab-0').addClass('is--active');
	};

	// Start the slick shelfs
	tabs.initSlick = () => {
		tabPrateleira.find('.prateleira.default ul').slick({
			adaptiveHeight: false,
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [{
				breakpoint: 990,
				settings: {
					dots: true,
					slidesToShow: 2,
					slidesToScroll: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					dots: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});
	};

	tabs.init();
});
