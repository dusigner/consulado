/* global $: true, Nitro: true, _: true */

Nitro.module('percentoff', function(){

	'use strict';

	var boletoValue = + $('.boleto-value-cmc').text(),
		cmcDiscount = ( !isNaN( boletoValue ) && boletoValue > 0 ) ? boletoValue : 5 ;

	$('.box-produto:not(.list-percent)').each(function(){
		var self 			= $(this),
			valPercentage 	= self.data('percent'),
			txtPercentage 	= self.find('.off'),
			valProd			= self.find('.por .val').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
			percentage;

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