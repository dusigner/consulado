/**
 *
 * @fileOverview Tabs component to create a show/hide effect
 *
 */
'use strict';

import 'vendors/nitro';
import './prodStock';

Nitro.module('tabs', ['prodStock'], function(prodStock) {
	const tabsItems = $('.tabs__nav-link');
	const tabPanes = $('.tabs__pane');
	const dropdownNav = $('.dropdown__nav');
	const dropdownActive = $('.dropdown__nav-selected');

	/**
	 * Default method to initialize all functions inside module
	 */
	this.init = () => {
		this.buildTabsNav();
		this.changeDropdownState();
		this.checkTabPaneContent();
	};

	/**
	 * Create the link between tabs navigation and tabs content item
	 * When the user click on a tab link, we add an active class to the tab link
	 * We also add an active class on corresponding tab pane
	 */
	this.buildTabsNav = () => {
		$('[data-tab]').on('click', function(e) {
			e.preventDefault();

			let self = $(this);
			let dataPane = self.attr('data-tab');

			// First we remove all active class on tab items and add on the respective item
			tabsItems.removeClass('is-active');
			self.addClass('is-active');

			// Then we remove all active class from tab panes and add on the corresponding tab item link
			tabPanes.removeClass('is-active');
			$(`${dataPane}`).addClass('is-active');
			$(`[data-tab="${dataPane}"]`).addClass('is-active');

			// To finish, we change the dropdown active text
			dropdownActive.text(self.text());

			// prevent from load stock to current tab products if its already loaded
			if (!self.hasClass('stock-loaded')) {
				prodStock.buildProductStock(() => self.addClass('stock-loaded'));
			}
		});
	};

	/**
	 * Check the dropdown state to add or remove visible class
	 */
	this.changeDropdownState = () => {
		dropdownNav.on('click', function() {
			$(this).toggleClass('is-visible');
		});

		$('body').on('click', function(e) {
			if (e.target.className.indexOf('dropdown__nav') < 0) {
				dropdownNav.removeClass('is-visible');
			}
		});
	};

	/**
	 * Check if a tab pane is empty and hide the corresponding tab item link
	 * If the tab pane don't have a shelf list registered
	 * we hide the tab pane and the corresponding tab item
	 */
	this.checkTabPaneContent = () => {
		tabPanes.each(function() {
			let tabPane = $(this);

			if (!tabPane.find('.prateleira').length) {
				tabPane.addClass('is-empty');
				$(`[data-tab="#${$(this).attr('id')}"]`).parent().addClass('is-empty');
			}
		});
	};

	this.init();
});
