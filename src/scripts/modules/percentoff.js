/* global $: true, Nitro: true, _: true */
'use strict';

Nitro.module('percentoff', function() {


    $('.box-produto:not(.list-percent)').each(function() {
        var self = $(this),
            valPercentage = self.data('percent'),
            txtPercentage = self.find('.off'),
            valProd = self.find('.por .val').text().replace('R$ ', '').replace('.', '').replace(',', '.'),
            promoDiscount = {},
            percentage;
        promoDiscount.value = [0];

        self.find('.FlagsHightLight [class*="boleto"]').each(function(i, e) {
            var promoName = $(e).text();
            var promoValue = parseInt(promoName.match(/\d+/ig));
            if (!isNaN(promoValue) && promoValue > 0) {
                promoDiscount.value.push(promoValue);
            }
        });

        var cmcDiscount = promoDiscount.value.reduce(function(prev, curr) {
            return prev + curr;
        });

        if (valPercentage !== null && valPercentage !== 0) {
            percentage = Math.floor(parseFloat(valPercentage.replace(',', '.').replace(' ', '').replace('%', '')));
            if (percentage >= 20) {
                txtPercentage.text(percentage + '% OFF').show();
            }
        }

        // var total = parseFloat($(this).data('price').replace('R$ ', '').replace('.', '').replace(',', '.'));
        // $(this).find('span').text( $.formatNumber( total * (1 - discount) ) ).end().addClass('on');

        self.find('.discount-boleto').text('R$ ' + _.formatCurrency(valProd - (valProd * (cmcDiscount / 100))) + ' à vista no boleto');

        self.addClass('list-percent');
    });

});
