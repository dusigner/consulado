
'use strict';

const { getCoupons } = require('modules/store/crm');

Nitro.module('coupons-blackfriday-2020', function() {
	let self = this;

	self.init = () => {
		self.getCouponsBf().then(coupons => {
			self.formatCouponsBlackFridayVitrine(coupons);
		});
	}

	self.formatCouponsBlackFridayVitrine = (coupon, index) => {
		let productBoxes = $('.box-produto .FlagsHightLight p');
		$(productBoxes).map(function(product, index){
			let produto = $(this);
			if($(produto).attr('class').indexOf('blackfriday-2020') > -1) {
				let collectionId = $(produto).attr('class').split('-');
				$(coupon).map(function(index, c){
					console.info(c);
					if($(c).idCollection === collectionId[-1]) {
						$(produto).parent().find('.cns__promo__ganhe__de-volta-__-702f8f__500').text($(c)[0].coupon)
					}
				})
				// console.info(collectionId);
			}
		})

		// console.info(coupon);
	}

	self.getCouponsBf = () => {
		const deferred = $.Deferred();
		getCoupons().then(
			coupons => {
				deferred.resolve(coupons);
			},
			error => {
				deferred.reject(error);
			}
		);

		return deferred.promise();
	};
	// Start it
	self.init();
});
