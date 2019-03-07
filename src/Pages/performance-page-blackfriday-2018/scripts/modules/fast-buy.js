/**
 *
 * @fileOverview Add the radio buttons to create the fast buy component
 *
 */
'use strict';

import 'vendors/nitro';

Nitro.module('fast-buy', function() {
	const self = this;
	const shelfItems = $('.shelfs__section .shelf__item');

	/**
	 * Default method to initialize all functions inside module
	 */
	this.init = () => {
		this.renderSkuProductItem();
	};

	/**
	 * Generate a cart link to render on fast buy button when the user select his SKU option
	 * @param {*} element HTMLElement that will be used as
	 */
	this.generateFastBuyLink = (element) => {
		let skuSelection = element.find('.shelf__radio');
		let buyButton = element.find('.shelf__buy-fast');

		skuSelection.on('change', function() {
			buyButton.attr('href', `/checkout/cart/add?sku=${$(this).val()}&qty=1&seller=1&redirect=true&sc=${window.jssalesChannel ? window.jssalesChannel : 3}`);
			element.find('.shelf__sku-list').removeClass('is-invalid');
		});

		self.validateSkuSelection(skuSelection, buyButton);
	};

	/**
	 * Iterate over each product item
	 * and add the sku option selection based on VTEX shelf sku list control
	 */
	this.renderSkuProductItem = () => {
		shelfItems.each(function() {
			let productItem = $(this);
			let productSkuItems = productItem.find('.is-checklist-item');
			let productSkuList = productItem.find('.shelf__sku-list');

			productSkuItems.each(function() {
				let $self = $(this);
				let skuId = $self.find('.insert-sku-checkbox').attr('rel');
				let skuTitle = $self.find('.insert-sku-quantity').attr('title');
				let labelId = Math.floor(Math.random() * 99) + 100000;

				productSkuList.append(`
					<label class="shelf__label" for="shelf-sku-${skuId}-${labelId}">
						<input class="shelf__radio" id="shelf-sku-${skuId}-${labelId}" name="shelf-product-${productItem.data('idproduto')}" type="radio" value="${skuId}">
						<span class="shelf__label-text">${skuTitle}</span>
					</label>
				`);
			});

			self.generateFastBuyLink(productItem);
		});
	};

	/**
	 * Validate if the user selected at least one sku option
	 * @param {*} skus HTMLElement with the radio buttons that represents the sku options
	 * @param {*} button HTMLELement with
	 */
	this.validateSkuSelection = (skus, button) => {
		button.on('click', function() {
			let wrapper = skus.closest('.shelf__sku-list');

			if (!skus.is(':checked')) {
				wrapper.addClass('is-invalid');
			}
		});
	};

	this.init();
});
