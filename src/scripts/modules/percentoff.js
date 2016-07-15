/* global $: true, Nitro: true, _: true */

Nitro.module('percentoff', function(){

	'use strict';

	var boletoValue = + $('.boleto-value-cmc').text();

	$('.box-produto:not(.list-percent)').each(function(){
		var self = $(this),
			valPercentage = self.data('percent'),
			txtPercentage = self.find('.off'),
			valProd = self.find('.por .val').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
			promoDiscount = {},
			cmcDiscount,
			percentage;

			promoDiscount.value = [0];

			self.find(".FlagsHightLight [class*='boleto']").each(function(i,e) {
				var promoName = $(e).text();
				var promoValue = parseInt(promoName.match(/\d+/ig));
				if(!isNaN( promoValue ) && promoValue > 0) {
					promoDiscount.value.push(promoValue);
				}
			});

			var promoBoleto = promoDiscount.value.reduce(function(prev, curr, i) {
				return prev + curr;
			});

			var cmcDiscount = (promoBoleto) ? promoBoleto : ( !isNaN( boletoValue ) && boletoValue > 0 ) ? boletoValue : 5;

			if(valPercentage !== null && valPercentage !== 0){
				percentage = Math.floor( parseFloat( valPercentage.replace(',','.').replace(' ','').replace('%','') ) );
				if(percentage >= 20){
					txtPercentage.text(percentage + '% OFF').show();
				}
			}

			// var total = parseFloat($(this).data('price').replace('R$ ', '').replace('.', '').replace(',', '.'));
			// $(this).find('span').text( $.formatNumber( total * (1 - discount) ) ).end().addClass('on');

			self.find('.discount-boleto').text( 'R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscount / 100))) + ' à vista no boleto' );

			self.addClass('list-percent');
	});

});
