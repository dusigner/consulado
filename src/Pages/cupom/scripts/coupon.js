/**
 *
 * @fileOverview cupons page
 *
 */
'use strict';

require('modules/custom-select');
require('Dust/coupon/coupon-list.html');
const { getCouponsByCategory } = require('modules/store/crm');
const logger = require('js-pretty-logger');
const { getUniques } = require('modules/helpers');
const toastr = require('vendors/toastr');

Nitro.setup(['custom-select'], function (customSelect) {
	let self = this;

	this.filterBy = 'category';
	this.couponListSelector = '.coupon-list .container';

	/**
	 * @description initialize page code
	 */
	this.init = () => {
		self.log('Initialized...');
		self.getCoupons().then(coupons => {
			self.initializeFilter(coupons);
			self.renderCoupons(coupons, () => {
				this.buttonCopyCodeClick();
			});
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
	this.renderCoupons = (coupons, onRender) => {

		dust.render('coupon-list', {coupons}, (err, out) => {
			if (err) {
				throw new Error('Lista de Cupons Dust error: ' + err);
			}

			$('.coupons-list_items').html(out);
			if (typeof onRender === 'function') {
				onRender();
			}
		});
	};

	this.filterCoupons = filter => {
		if (filter) {
			$('.coupons-list_item').hide();
			$(`[data-coupon=${filter}]`).show();
		} else {
			$('.coupons-list_item').show();
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
			target: '.coupon-filter',
			appendType: 'prepend',
			options,
			onChange(option) {
				self.log(`Select changed to: ${option.value}`);
				self.filterCoupons(option.value);
			}
		});

	};

	this.couponToastr = code => {
		jQuery($ => {
			const windowWidth = $(window).width();
			const position = windowWidth <= 320 ? 'toast-bottom-center' : 'toast-top-center';
			toastr.options = {
				closeButton: true,
				debug: false,
				newestOnTop: true,
				progressBar: false,
				positionClass: position,
				preventDuplicates: true,
				onclick: null,
				showDuration: '300',
				hideDuration: '1000',
				timeOut: '5000',
				extendedTimeOut: '1000',
				showEasing: 'swing',
				hideEasing: 'linear',
				showMethod: 'fadeIn',
				hideMethod: 'fadeOut',
			};
			toastr.info(`Código ${code} copiado`);
		});
	};

	this.buttonCopyCodeClick = () => {
		const buttonCopyCode = '.copy-code';

		jQuery($ => {
			$(buttonCopyCode).on('click', e => {
				this.copyCode(e.target);
			});
		});
	};

	this.copyCode = triggerElement => {
		jQuery($ => {
			const code = $(triggerElement)
				.closest('.content-body')
				.find('.code')[0];
			const temp = $('<input>');

			$('body').append(temp);

			temp.val($(code).text()).select();

			document.execCommand('copy');

			this.couponToastr($(code).text());

			temp.remove();
		});
	};

	/**
	 * @description Log messages into console
	 * @param {string} message - the message that will be logged
	 * @param {string} [type] - type of message. coude be default, info, danger, success and warn
	 */
	this.log = (message, type = 'info') => {
		logger('coupon', message, { type });
	};

	// Start it
	this.init();
});
