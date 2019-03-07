'use strict';

Nitro.module('tabs-consumidor', function () {
	const tabPrateleira = $('.prateleira-tabs');
	const contentTitles = $('.prateleira-tabs__tabs');
	const tabsTitles = tabPrateleira.find('h2');

	// Tabs
	const tabs = {};

	// Titles
	tabs.titleTemplate = () => {
		tabsTitles.each((index, tab) => {
			const tabText = $(tab).text();
			const tabItem = `<li class="prateleira-tabs__tab tab-${index}" data-tab="tab-${index}">${tabText}</li>`;
			$(tab).parent().addClass('tab-' + index);
			contentTitles.append(tabItem);
		});
	};

	// Active tabs
	tabs.handleActiveTabs = () => {
		const tabs = $('.prateleira-tabs__tabs');
		const tab = $(tabs).find('li');

		tab.click(function () {
			const tabId = $(this).data('tab');

			tab.removeClass('is--active');
			$(this).addClass('is--active');
			tabPrateleira.find('.prateleira').removeClass('is--active');
			tabPrateleira.find('.' + tabId).addClass('is--active');
		});
	};

	// Active first tab
	tabs.firstActiveTabs = () => {
		tabPrateleira.find('.tab-0').addClass('is--active');
	};

	tabs.init = function () {
		tabs.titleTemplate();
		tabs.handleActiveTabs();
		tabs.firstActiveTabs();
	};

	tabs.init();
});
