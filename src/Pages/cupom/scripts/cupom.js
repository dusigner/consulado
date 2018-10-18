/**
 *
 * @fileOverview cupons page
 *
 */
'use strict';

require('modules/custom-select');
const { getCouponsByCategory } = require('modules/store/crm');
const logger = require('js-pretty-logger');

Nitro.setup(['custom-select'], function (customSelect) {
	let self = this;

	/**
	 * @description initialize page code
	 */
	this.init = () => {
		self.log('Initialized...');
		self.initializeFilter();
	};

	this.initializeFilter = () => {
		let options = [];
		getCouponsByCategory().then(result => {
			options = [].map.call(result, cupon => {
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
					getCouponsByCategory(option.value);
				}
			});
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
