'use strict';

require('vendors/slick');

Nitro.module('tabs-consumidor', function() {
	// Variables
	const tabPrateleira = $('.prateleira-tabs');
	const contentTitles = $('.prateleira-tabs__tabs');
	const tabsTitles = tabPrateleira.find('h2');

	// Tabs
	const tabs = {};

	// Start all
	tabs.init = function() {
		tabs.titleTemplate();
		tabs.handleActiveTabs();
		tabs.firstActiveTabs();
		tabs.handleActiveMobileTabs();
		tabs.initSlick();
		//tabs.buildProductStock();
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

			$(tab)
				.parent()
				.addClass('tab-' + index);
			contentTitles.append(tabTemplate);
		});
	};

	// Active tabs
	tabs.handleActiveTabs = () => {
		const tab = $('.prateleira-tabs__tab');

		tab.click(function() {
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
		contentTitles.click(function() {
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
		tabPrateleira.find('.prateleira.default > ul').slick({
			adaptiveHeight: false,
			arrows: true,
			infinite: true,
			slidesToScroll: 4,
			slidesToShow: 4,
			responsive: [
				{
					breakpoint: 990,
					settings: {
						arrows: true,
						dots: true,
						slidesToScroll: 2,
						slidesToShow: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						arrows: true,
						dots: true,
						slidesToScroll: 1,
						slidesToShow: 1
					}
				}
			]
		});
	};

	/*
	 * This method get all .shelf__item current visibles and genereate stock values into each one
	 */
	tabs.buildProductStock = callback => {
		const $shelfsShowing = tabPrateleira.find('.box-produto');

		let params = '?',
			currentProductsIDs = [],
			prodsWithStock = [];

		/* get productId from DOM to currentProductsIDs Array */
		$.each($shelfsShowing, (idx, el) => currentProductsIDs.push($(el).data('idproduto')));

		/* Build ajax parameters */
		currentProductsIDs.forEach(el => {
			params += `fq=productId:${el}&`;
		});

		let currentProdStock;

		/* Ajax to get products from API*/
		tabs.getProdSearchAPI(params).then(res => {
			/* Iterates products */
			res.map(function(el) {
				currentProdStock = 0;

				/* Iterate Item skus */
				for (const item of el.items) {
					currentProdStock += item.sellers[0].commertialOffer.AvailableQuantity;
				}

				/* Add product objects to an array */
				prodsWithStock.push({
					productID: el.productId,
					stock: currentProdStock > 500 ? 500 : currentProdStock
				});
			});

			/* Render stock on products */
			for (const item of prodsWithStock) {
				const $shelfs = tabPrateleira.find(`[data-idproduto="${item.productID}"]`);
				const $image = $shelfs.find('.image');

				let template = `
					<div class="shelf__stock">
						Últimos <span class="${item.stock < 100 ? 'is--active' : ''}">${item.stock}</span> em estoque
					</div>
				`;

				$image.after(template);
			}

			callback && callback();
		});
	};

	/**
	 * Get product information using the VTEX Search API to render stock information on shelf elements
	 * @param {String} params a string with the products that will be searched on VTEX Search API
	 * @returns an array of objects with each product information
	 */
	tabs.getProdSearchAPI = params => {
		return $.ajax({
			url: '/api/catalog_system/pub/products/search/' + params,
			method: 'GET'
		}).then(res => {
			return res;
		});
	};

	tabs.init();
});
