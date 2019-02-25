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

Nitro.controller('coupon', ['custom-select'], function (customSelect) {
	let self = this;

	this.filterBy = 'category';
	this.couponListSelector = '.coupon-list .container';

	/**
	 *
	 * @param {Object} ref The database ref object
	 * @param {Object} data The property/value pairs to be created
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
	 * Add click event to show more coupons button.
	 */
	this.showMoreCoupons = () => {
		$('.show-more-coupons').on('click', () => {
			this.toggleExtraCoupons('slow');
			$('.coupons-expand').hide();
		});
	};

	/**
	 * Toggle display of extra coupos
	 * @param {string} speed Toggle transition speed (fast, slow)
	 */
	this.toggleExtraCoupons = speed => {
		const couponListItems = $('.coupons-list_item');
		const couponSize = couponListItems.length;
		const couponLastIndex = couponSize - 1;
		const couponMax = 6;

		if (couponSize > couponMax) {
			const extraCoupons = couponListItems.splice(
				couponMax,
				couponLastIndex
			);

			extraCoupons.map(extra => $(extra).toggle(speed));
			this.showMoreCoupons();
		}
	};

	/**
	 * @description retrieve list of available coupons
	 * @returns Promise - list of coupons or error message
	 */
	this.getCoupons = () => {
		const deferred = $.Deferred();
		getCouponsByCategory().then(
			coupons => {
				deferred.resolve(coupons);
			},
			error => {
				deferred.reject(error);
			}
		);

		return deferred.promise();
	};

	/**
	 * @description Render the list of coupons
	 * @param {*} coupons
	 */
	this.renderCoupons = (coupons, onRender) => {
		dust.render('coupon-list', { coupons }, (err, out) => {
			if (err) {
				throw new Error('Lista de Cupons Dust error: ' + err);
			}

			$('.coupons-list_items').html(out);

			this.toggleExtraCoupons('fast');
			if (typeof onRender === 'function') {
				onRender();
			}
		});

		self.tags();
	};

	this.filterCoupons = filter => {
		if (filter) {
			$('.coupons-list_item').hide();
			$(`[data-coupon=${filter}]`).show();
		} else {
			$('.coupons-list_item').show();
		}

		$('.coupons-expand').hide();
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
				text: cupon.category,
			};
		});

		options = [
			{
				text: 'Todas as categorias',
				value: '',
			},
			...options,
		];

		customSelect.setup({
			target: '.coupon-filter',
			appendType: 'prepend',
			options,
			onChange(option) {
				self.log(`Select changed to: ${option.value}`);
				self.filterCoupons(option.value);
			},
		});
	};

	/**
	 * Show a toastr alert with the coupon code
	 * @param {string} code Coupon code
	 */
	this.couponToastr = code => {
		jQuery($ => {
			const windowWidth = $(window).width();
			const position =
				windowWidth <= 320 ? 'toast-bottom-center' : 'toast-top-center';
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

	/**
	 * Add click event to copy code button
	 */
	this.buttonCopyCodeClick = () => {
		const buttonCopyCode = '.copy-code';

		jQuery($ => {
			$(buttonCopyCode).on('click', e => {
				this.copyCode(e.target);
			});
		});
	};

	/**
	 * Copy coupon code to the clipboard
	 * @param {Object} triggerElement Element triggering the copy code event
	 */
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

	/**
	 * @description Send events to analytics
	 */
	this.tags = () => {
		$('.content-body .primary-button').on('click', function () {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Categoria de Cupom',
				action: 'Copiar código ',
				label: $(this).parents('.content-body').find('.code').text()
			});
		});

		$('.coupon-list .products').find('a').on('click', function () {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Categoria de Cupom',
				action: 'Ver produtos participantes ',
				label: '- '
			});
		});

		$('.show-more-coupons').on('click', function () {
			dataLayer.push({
				event: 'generic-event-trigger',
				category: 'Categoria de Cupom',
				action: 'Ver mais cupons ',
				label: '- '
			});
		});
	};

	// Start it
	this.init();
});
