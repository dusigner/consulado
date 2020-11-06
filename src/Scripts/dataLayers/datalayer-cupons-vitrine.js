'use strict'

Nitro.module('datalayer-cupons-vitrine', function () {

	this.init = () => {

		this.dataLayerBFCoupons();
	};

	this.dataLayerBFCoupons = () => {
		$(window).load(function(){
			if($('body').hasClass('produto') && $('.black-friday-coupons').length){
				let couponName = $('.prod-info .prod-selos .black-friday-coupons').text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();

				dataLayer.push({
					event: 'generic',
					category: 'PDP_cupom',
					action: 'exbicao_cupom ',
					label: `exibicao_${couponName}`
				})

				$('.black-friday-coupons').on('click', function(){
					let couponName = $(this).text().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\-]+/g, '_').toLowerCase();
					dataLayer.push({
						event: 'generic',
						category: 'PDP_cupom',
						action: 'click_copiar_cupom',
						label: `cupom_${couponName}`
					})

					setTimeout(function(){
						dataLayer.push({
							event: 'generic',
							category: 'PDP_cupom',
							action: 'exbicao_codigo_copiado ',
							label: 'codigo_copiado_sucesso '
						})
					}, 1000)
				})
			} else {
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
			}
		})
	}

	this.init();
});
