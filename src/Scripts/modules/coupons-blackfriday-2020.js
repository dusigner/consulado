
'use strict';

const { getCoupons } = require('modules/store/crm');

Nitro.module('coupons-blackfriday-2020', function() {
	let self = this;

	self.init = () => {

		self.getCouponsBf().then(coupons => {
			self.formatCouponsBlackFridayVitrine(coupons);
		});

		self.copyCouponToClioBoard();
	}

	self.formatCouponsBlackFridayVitrine = (coupon, index) => {
		let productBoxes
		if($('body').hasClass('home') || $('body').hasClass('categoria') || $('body').hasClass('listagem')){
			productBoxes = $('.box-produto .FlagsHightLight p');
		} else {
			productBoxes = $('.prod-image .prod-selos p');
		}

		$(productBoxes).map(function(product, index){
			let produto = $(this);
			if($(produto).attr('class').indexOf('blackfriday-2020') > -1) {
				let collectionId = $(produto).attr('class').split('-');
				$(coupon).map(function(index, c){
					if($(c).idCollection === collectionId[-1]) {
						$(produto).parent().find('.cns__promo__ganhe__de-volta-__-702f8f__500').text($(c)[0].coupon)
					}
				})
			}
		})


	}

	self.copyCouponToClioBoard = () => {
		const copyCouponButton = $('.cns__promo__ganhe__de-volta-__-702f8f__500');

		$(copyCouponButton).on('click', function(e){
			e.preventDefault();

			let copiedCoupon = $(this).text();
			$(this).addClass('copied');
			var $temp = $("<input>");
			$("body").append($temp);
			$temp.val($(this).text()).select();
			document.execCommand("copy");
			$temp.remove();
		})
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

	if($('body').hasClass('categoria') || $('body').hasClass('listagem')) {
		$(document).ajaxStop(function () {

			self.init();

			if ($('.see-more').length && $('.see-more button').hasClass('hide')) {
				console.info('batata');
				$(this).unbind("ajaxStop");
			}

		});
	} else {
		self.init();
	}
});
