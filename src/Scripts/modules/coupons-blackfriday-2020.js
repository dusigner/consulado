
'use strict';

const { getCoupons } = require('modules/store/crm');

Nitro.module('coupons-blackfriday-2020', function() {
	let self = this;

	self.init = () => {

		self.getCouponsBf().then(coupons => {
			self.formatCouponsBlackFridayVitrine(coupons);
		});

		self.copyCouponToClioBoard();

		// self.dataLayerBFCoupons();
	}

	self.formatCouponsBlackFridayVitrine = (coupon, index) => {
		let productBoxes
		if($('body').hasClass('home') || $('body').hasClass('categoria') || $('body').hasClass('listagem')){
			productBoxes = $('.box-produto .FlagsHightLight p');
		} else {
			productBoxes = $('.prod-selos p');
		}

		$(productBoxes).map(function(product, index){
			let produto = $(this);
			if($(produto).attr('class').indexOf('blackfriday-2020') > -1) {
				let collectionId = $(produto).attr('class').split('-');
				$(coupon).map(function(index, c){
					if($(c)[0].idCollection === collectionId[2]) {
						$(produto).parent().find('.black-friday-coupons').text($(c)[0].coupon)
						$(produto).parent().find('.black-friday-coupons').css('display', 'flex')
					}
				})
			}
		})


	}

	self.copyCouponToClioBoard = () => {
		const copyCouponButton = $('.black-friday-coupons');

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

	self.dataLayerBFCoupons = () => {
		$(window).load(function(){
			if($('body').hasClass('produto') && $('.black-friday-coupons').length){
				let couponName = $('.prod-info .prod-selos .black-friday-coupons').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();

				dataLayer.push({
					event: 'generic',
					category: 'PDP_cupom',
					action: 'exbicao_cupom ',
					label: `exibicao_${couponName}`
				})
			}

			$('.black-friday-coupons').on('click', function(){
				let couponName = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
				let pageCategory = dataLayer[0].pageCategory.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
				dataLayer.push({
					event: 'generic',
					category: `Vitrine_cupom_${pageCategory}`,
					action: 'click_copiar_cupom',
					label: `cupom_${couponName}`
				})

				setTimeout(function(){
					dataLayer.push({
						event: 'generic',
						category: `Vitrine_cupom_${pageCategory}`,
						action: 'exbicao_codigo_copiado ',
						label: 'codigo_copiado_sucesso '
					})
				}, 1000)
			})

		})
	}

	if($('body').hasClass('categoria') || $('body').hasClass('listagem')) {
		$(document).ajaxStop(function () {

			self.init();

			if ($('.see-more').length && $('.see-more button').hasClass('hide')) {
				$(this).unbind("ajaxStop");
			}

		});
	} else {
		self.init();
	}
});
