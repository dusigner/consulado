/**
 *
 * @fileOverview cupons page
 *
 */
'use strict';

require('modules/custom-select');
const { getCouponsByCategory } = require('modules/store/crm');
const logger = require('js-pretty-logger');
const { getUniques } = require('modules/helpers');

Nitro.setup(['custom-select'], function (customSelect) {
	let self = this;

	this.filterBy = 'category';
	this.couponListSelector = '.cupom-list .container';

	/**
	 * @description initialize page code
	 */
	this.init = () => {
		self.log('Initialized...');
		self.getCoupons().then(coupons => {
			self.initializeFilter(coupons);
			self.renderCoupons(coupons);
		});
	};

	/**
	 * @description retrieve list of available coupons
	 * @returns Promise - list of coupons or error message
	 */
	this.getCoupons = () => {
		const deferred = $.Deferred();
		
		getCouponsByCategory().then(coupons => {
			deferred.resolve(coupons);
		}, error => {
			deferred.reject(error);
		});

		return deferred.promise();
	};
	/**
	 * @description Render the list of coupons
	 * @param {*} coupons
	 */
	this.renderCoupons = coupons => {
		const couponsTemplate = `
		${coupons.map(coupon => `
			<div class="coupon" data-coupon="${coupon[self.filterBy]}">
				<h2>${coupon.coupon}</h2>
				<b>${coupon.category}</b>
				<small>${coupon.offer}</small>
				<small>${coupon.valProduct}</small>
			</div>
		`).join('')}
		`;

		$(self.couponListSelector).append(couponsTemplate);
	};

	this.filterCoupons = filter => {
		if (filter) {
			$('.coupon').hide();
			$(`[data-coupon=${filter}]`).show();
		} else {
			$('.coupon').show();
		}
	};

	/**
	 * @description initialize the custom filter
	 * @param {Array<object>} coupons list of coupons from Master Data
	 */
	this.initializeFilter = coupons => {
		let options = [];

		coupons = getUniques(coupons, 'category');
		
		options = [].map.call(coupons, cupon => {
			return {
				value: cupon.category,
				text: cupon.category
			};
		});

		options = [
			{
				text: 'Todas as categorias',
				value: ''
			}, ...options
		];

		customSelect.setup({
			target: '.cupom-filter',
			appendType: 'prepend',
			options,
			onChange(option) {
				self.log(`Select changed to: ${option.value}`);
				self.filterCoupons(option.value);
			}
		});

	};

	/**
	 * @description Log messages into console
	 * @param {string} message - the message that will be logged
	 * @param {string} [type] - type of message. coude be default, info, danger, success and warn
	 */
	this.log = (message, type = 'info') => {
		logger('Cupom', message, { type });
	};

	// Start it
	this.init();
});
